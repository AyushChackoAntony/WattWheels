from flask import request, jsonify
from . import bookings_bp
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app import db
from datetime import datetime

# In a real app, you would have a way to get the current user,
# for example, using a decorator like @jwt_required and get_jwt_identity
# from flask_jwt_extended. For now, we'll simulate it.
def get_current_user_id():
    # Placeholder: In a real app, you'd get this from a session or JWT token
    # For demonstration, we'll expect it in the request data,
    # but this is NOT secure for a production application.
    return request.get_json().get('customer_id')

@bookings_bp.route('/', methods=['POST'])
def create_booking():
    data = request.get_json()

    # --- Get customer_id from a secure source (e.g., JWT token) ---
    # customer_id = get_jwt_identity() 
    customer_id = get_current_user_id() # Using placeholder for now

    vehicle_id = data.get('vehicle_id')
    start_date_str = data.get('start_date') # Expected format: 'YYYY-MM-DD'
    end_date_str = data.get('end_date')   # Expected format: 'YYYY-MM-DD'

    # --- Data Validation ---
    if not all([customer_id, vehicle_id, start_date_str, end_date_str]):
        return jsonify({'error': 'Missing required booking information'}), 400

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    if start_date >= end_date:
        return jsonify({'error': 'End date must be after start date'}), 400
    # --- End Validation ---

    # --- Price Calculation ---
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return jsonify({'error': 'Vehicle not found'}), 404

    num_days = (end_date - start_date).days
    if num_days <= 0:
        num_days = 1 # Minimum 1 day rental

    total_price = num_days * vehicle.price_per_day
    # --- End Calculation ---

    # --- Create and Save Booking ---
    new_booking = Booking(
        customer_id=customer_id,
        vehicle_id=vehicle_id,
        start_date=start_date,
        end_date=end_date,
        total_price=total_price
    )

    db.session.add(new_booking)
    db.session.commit()
    # --- End Create Booking ---

    return jsonify({
        'message': 'Booking created successfully!',
        'booking_id': new_booking.id
    }), 201