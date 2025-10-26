# backend/app/api/bookings/routes.py
from flask import request, jsonify, current_app
from . import bookings_bp
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.availability import Availability # <<< Import Availability
from app import db
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    current_user = get_jwt_identity()
    user_id = current_user.get('id')
    user_type = current_user.get('type')

    if user_type != 'customer':
        return jsonify({"error": "Only customers can create bookings"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request must be JSON"}), 400

    vehicle_id = data.get('vehicle_id')
    start_date_str = data.get('start_date') # Expecting 'YYYY-MM-DD HH:MM:SS' or similar
    end_date_str = data.get('end_date')
    # total_price = data.get('total_price') # Price calculation should ideally happen backend
    destination = data.get('destination')

    if not all([vehicle_id, start_date_str, end_date_str]):
        return jsonify({"error": "Missing required fields: vehicle_id, start_date, end_date"}), 400

    try:
        # Use a format that includes time, adjust if frontend sends differently
        start_date = datetime.strptime(start_date_str, '%Y-%m-%dT%H:%M:%S.%fZ') # Example ISO format
        end_date = datetime.strptime(end_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
        if start_date >= end_date:
            return jsonify({"error": "End date must be after start date"}), 400
        if start_date < datetime.utcnow():
            return jsonify({"error": "Booking start date cannot be in the past"}), 400

    except ValueError:
        return jsonify({"error": "Invalid date format. Use ISO format like YYYY-MM-DDTHH:MM:SS.sssZ"}), 400

    # --- Availability & Conflict Checks ---
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
    if vehicle.status != 'active':
        return jsonify({"error": f"Vehicle is currently not active ({vehicle.status})"}), 400

    # 1. Check against Owner's explicit unavailability
    is_unavailable = Availability.query.filter(
        Availability.vehicle_id == vehicle_id,
        Availability.is_available == False,
        Availability.start_date < end_date,
        Availability.end_date > start_date
    ).first()
    if is_unavailable:
        reason = f"due to {is_unavailable.reason}" if is_unavailable.reason else ""
        return jsonify({"error": f"Vehicle is marked unavailable by the owner {reason} during the selected period."}), 409 # 409 Conflict

    # 2. Check against existing bookings for the same vehicle
    conflicting_booking = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        # Add relevant statuses to check against (e.g., ignore 'cancelled')
        Booking.status.in_(['upcoming', 'active', 'confirmed']),
        Booking.start_date < end_date,
        Booking.end_date > start_date
    ).first()
    if conflicting_booking:
        return jsonify({"error": "Vehicle is already booked during the selected period."}), 409 # 409 Conflict

    # --- Price Calculation (Example) ---
    # Duration in hours (or days)
    duration_delta = end_date - start_date
    duration_days = duration_delta.days + (duration_delta.seconds / 86400) # Simple days calculation
    # Ensure minimum duration if needed
    if duration_days <= 0: duration_days = 1 # Example: Minimum 1 day charge
    calculated_price = round(duration_days * vehicle.price_per_day, 2)
    # Compare calculated_price with price sent from frontend if needed, or just use backend price

    # --- Create Booking ---
    try:
        new_booking = Booking(
            customer_id=user_id,
            vehicle_id=vehicle_id,
            start_date=start_date,
            end_date=end_date,
            total_price=calculated_price, # Use backend calculated price
            status='upcoming', # Or 'pending_approval' if owner needs to approve
            destination=destination
        )
        db.session.add(new_booking)
        db.session.commit()

        # --- TODO: Notification Logic ---
        # You would add code here to trigger a notification (e.g., email, push)
        # to the vehicle owner (vehicle.owner_id) about the new booking (new_booking.id).
        current_app.logger.info(f"New booking created (ID: {new_booking.id}) for vehicle {vehicle_id} by customer {user_id}. Owner {vehicle.owner_id} should be notified.")
        # Example: send_booking_notification(vehicle.owner_id, new_booking.id)

        return jsonify({"message": "Booking created successfully!", "booking": new_booking.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating booking: {e}")
        return jsonify({"error": "An internal error occurred while creating the booking."}), 500

# ... (get_bookings, get_single_booking, cancel_booking functions) ...