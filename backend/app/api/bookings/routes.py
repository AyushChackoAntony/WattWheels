from flask import request, jsonify
from . import bookings_bp
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app import db
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

# In a real app, you would have a way to get the current user,
# for example, using a decorator like @jwt_required and get_jwt_identity
# from flask_jwt_extended. For now, we'll simulate it.
def get_current_user_id():
    # Placeholder: In a real app, you'd get this from a session or JWT token
    # For demonstration, we'll expect it in the request data,
    # but this is NOT secure for a production application.
    return request.get_json().get('customer_id')

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()
    current_user = get_jwt_identity()

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
    
@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_bookings():
    current_user = get_jwt_identity()
    user_id = current_user['id']
    user_type = current_user['type']
    
    if user_type == 'customer':
        bookings = Booking.query.filter_by(customer_id=user_id).all()
    elif user_type == 'owner':
        owner_vehicles = Vehicle.query.filter_by(owner_id=user_id).all()
        vehicle_ids = [v.id for v in owner_vehicles]
        bookings = Booking.query.filter(Booking.vehicle_id.in_(vehicle_ids)).all()
    else:
        return jsonify({"error": "Invalid user type"}), 400

    return jsonify({"bookings": [b.to_dict() for b in bookings]}), 200
