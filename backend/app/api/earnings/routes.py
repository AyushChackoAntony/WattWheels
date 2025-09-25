from flask import jsonify
from . import earnings_bp
from app.models.booking import Booking
from app.models.user import User

# This route will get all earnings for a specific owner
@earnings_bp.route('/<int:owner_id>', methods=['GET'])
def get_owner_earnings(owner_id):
    print(f"--- Received request for owner_id: {owner_id} ---")
    # Find the owner
    owner = User.query.get(owner_id)
    print(f"--- Found user in database: {owner} ---")
    if not owner or owner.user_type != 'owner': # Correct line with one underscore
        return jsonify({'error': 'Owner not found'}), 404

    # Get all vehicles belonging to this owner
    owner_vehicles = owner.vehicles
    if not owner_vehicles:
        return jsonify({
            'total_earnings': 0,
            'transaction_count': 0,
            'transactions': []
        })

    vehicle_ids = [vehicle.id for vehicle in owner_vehicles]

    # Find all bookings for those vehicles
    bookings = Booking.query.filter(Booking.vehicle_id.in_(vehicle_ids)).all()

    total_earnings = 0
    transactions = []
    platform_commission = 0.15  # 15% commission

    for booking in bookings:
        earning = booking.total_price * (1 - platform_commission)
        total_earnings += earning
        transactions.append({
            'booking_id': booking.id,
            'vehicle_name': booking.vehicle.name,
            'customer_id': booking.customer_id,
            'total_price': booking.total_price,
            'earning': round(earning, 2),
            'date': booking.created_at.strftime('%Y-%m-%d')
        })

    return jsonify({
        'total_earnings': round(total_earnings, 2),
        'transaction_count': len(transactions),
        'transactions': transactions
    })