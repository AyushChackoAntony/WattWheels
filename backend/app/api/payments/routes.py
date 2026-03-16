import stripe
import os
from flask import request, jsonify, current_app
from bson import ObjectId
from app import mongo
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import payments_bp

# Set your secret key. Remember to switch to your live secret key in production.
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_your_dummy_key_here')

@payments_bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    data = request.get_json()
    booking_id = data.get('bookingId')
    
    # Find the pending booking
    booking = mongo.db.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    try:
        # Create a Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'inr', # Adjust currency as needed
                    'unit_amount': int(booking['total_price'] * 100), # Stripe expects amount in paise/cents
                    'product_data': {
                        'name': 'WattWheels EV Rental',
                        'description': f"Booking ID: {booking_id}",
                    },
                },
                'quantity': 1,
            }],
            mode='payment',
            metadata={'booking_id': booking_id},
            success_url=os.getenv('FRONTEND_URL', 'http://localhost:3000') + f'/dashboard/customer/bookings?payment=success',
            cancel_url=os.getenv('FRONTEND_URL', 'http://localhost:3000') + f'/vehicles/{booking["vehicle_id"]}?payment=cancelled',
        )

        return jsonify({'id': checkout_session.id, 'url': checkout_session.url})
    except Exception as e:
        current_app.logger.error(f"Stripe Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@payments_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        booking_id = session['metadata']['booking_id']
        transaction_id = session['payment_intent']

        # Update MongoDB booking to 'confirmed'
        mongo.db.bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {
                "status": "confirmed", 
                "payment_status": "success",
                "transaction_id": transaction_id
            }}
        )
        current_app.logger.info(f"Payment successful for booking {booking_id}")

    return jsonify({'status': 'success'}), 200