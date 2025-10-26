# backend/app/api/bookings/routes.py
from flask import request, jsonify, current_app
from sqlalchemy.orm import load_only # Import load_only for optimization
from . import bookings_bp
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.availability import Availability
from app import db
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    # Get user ID and type from JWT
    user_id = get_jwt_identity()
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    # Ensure only customers can create bookings
    if user_type != 'customer':
        return jsonify({"error": "Only customers can create bookings"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request must be JSON"}), 400

    # Extract data from request body
    vehicle_id = data.get('vehicle_id')
    start_date_str = data.get('start_date') # Expecting ISO format from frontend (e.g., from date picker)
    end_date_str = data.get('end_date')
    destination = data.get('destination')

    # Validate required fields
    if not all([vehicle_id, start_date_str, end_date_str]):
        return jsonify({"error": "Missing required fields: vehicle_id, start_date, end_date"}), 400

    # Parse and validate dates
    try:
        # Assuming frontend sends date strings like 'YYYY-MM-DDTHH:MM:SS.sssZ' or similar standard format
        start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00')) # Handle Z for UTC
        end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))

        if start_date >= end_date:
            return jsonify({"error": "End date must be after start date"}), 400
        # Compare with current UTC time
        if start_date < datetime.utcnow():
            return jsonify({"error": "Booking start date cannot be in the past"}), 400

    except (ValueError, TypeError) as e:
        current_app.logger.error(f"Date parsing error: {e}. Received start='{start_date_str}', end='{end_date_str}'")
        return jsonify({"error": f"Invalid date format. Ensure dates are in a valid ISO format."}), 400

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
        Availability.start_date < end_date, # Check for any overlap
        Availability.end_date > start_date
    ).first()
    if is_unavailable:
        reason = f"due to {is_unavailable.reason}" if is_unavailable.reason else ""
        return jsonify({"error": f"Vehicle is marked unavailable by the owner {reason} during the selected period."}), 409 # 409 Conflict

    # 2. Check against existing bookings for the same vehicle
    conflicting_booking = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status.in_(['upcoming', 'active', 'confirmed']), # Check against relevant statuses
        Booking.start_date < end_date, # Check for any overlap
        Booking.end_date > start_date
    ).first()
    if conflicting_booking:
        return jsonify({"error": "Vehicle is already booked during the selected period."}), 409 # 409 Conflict

    # --- Price Calculation (Example - adapt as needed) ---
    duration_delta = end_date - start_date
    # Calculate duration in fractional days (more accurate for pricing)
    duration_days = duration_delta.total_seconds() / (24 * 60 * 60)
    if duration_days <= 0:
         return jsonify({"error": "Booking duration must be positive"}), 400
    # Example: Charge minimum 1 day, or pro-rata if less than a day based on rules
    # price_per_hour = vehicle.price_per_day / 24 # Example hourly rate
    # calculated_price = round(max(duration_delta.total_seconds() / 3600, min_hours) * price_per_hour, 2)
    calculated_price = round(max(duration_days, 1) * vehicle.price_per_day, 2) # Simple daily calculation, min 1 day

    # --- Create Booking ---
    try:
        new_booking = Booking(
            customer_id=user_id,
            vehicle_id=vehicle_id,
            start_date=start_date,
            end_date=end_date,
            total_price=calculated_price, # Use backend calculated price
            status='upcoming', # Default status
            destination=destination
        )
        db.session.add(new_booking)
        db.session.commit()

        # --- Notification Logic Placeholder ---
        # TODO: Implement notification system (e.g., using Flask-Mail, Celery, etc.)
        # to alert the vehicle owner.
        owner_id_to_notify = vehicle.owner_id
        current_app.logger.info(f"New booking (ID: {new_booking.id}) for vehicle {vehicle_id} by customer {user_id}. Owner {owner_id_to_notify} should be notified.")
        # Example function call: send_booking_notification(owner_id_to_notify, new_booking.id)

        return jsonify({"message": "Booking created successfully!", "booking": new_booking.to_dict()}), 201

    except Exception as e:
        db.session.rollback() # Rollback transaction on error
        current_app.logger.error(f"Error creating booking: {e}", exc_info=True) # Log full traceback
        return jsonify({"error": "An internal error occurred while creating the booking."}), 500

# Route to get bookings (either for a specific customer or owner)
@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_bookings():
    # Get user ID and type from the JWT token
    user_id = get_jwt_identity() # The ID of the logged-in user
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    # Basic validation of token content
    if not user_id or not user_type:
        current_app.logger.error("Invalid token identity received in get_bookings")
        return jsonify({"error": "Invalid token identity"}), 401

    bookings_query = None # Initialize query

    # Filter bookings based on user type
    if user_type == 'customer':
        current_app.logger.info(f"Fetching bookings for customer {user_id}")
        bookings_query = Booking.query.filter_by(customer_id=user_id)
    elif user_type == 'owner':
        current_app.logger.info(f"Fetching bookings for owner {user_id}")
        # Find all vehicles belonging to this owner efficiently
        # Use load_only to fetch only the IDs, preventing loading full vehicle objects
        owner_vehicle_ids = db.session.query(Vehicle.id).filter_by(owner_id=user_id).all()
        # Extract IDs from the result tuples
        vehicle_ids = [v_id[0] for v_id in owner_vehicle_ids]

        if not vehicle_ids:
             current_app.logger.info(f"Owner {user_id} has no vehicles. Returning empty list.")
             return jsonify({"bookings": []}), 200 # Return empty list if owner has no vehicles

        current_app.logger.info(f"Owner {user_id} - Vehicle IDs: {vehicle_ids}")
        # Filter bookings associated with the owner's vehicles
        bookings_query = Booking.query.filter(Booking.vehicle_id.in_(vehicle_ids))
    else:
        # Handle unexpected user types found in token
        current_app.logger.warning(f"Unauthorized user type '{user_type}' for user_id {user_id} attempting to get bookings.")
        return jsonify({"error": "Invalid user type specified in token"}), 403

    # Execute the query, order by creation date descending
    bookings = bookings_query.order_by(Booking.created_at.desc()).all()
    current_app.logger.info(f"Found {len(bookings)} booking record(s) for user_id {user_id}.")

    # Serialize booking data
    bookings_data = []
    serialization_errors = 0
    for i, b in enumerate(bookings): # Add index for easier identification in logs
        try:
            booking_dict = b.to_dict() # Use the model's serialization method
            bookings_data.append(booking_dict)
        except Exception as e:
            serialization_errors += 1
            # Log errors during serialization
            current_app.logger.error(f"Error serializing booking ID {b.id} for user {user_id}: {e}", exc_info=True)
            # Depending on requirements, you might skip this booking or raise an error
            # For robustness, we'll skip problematic ones but log them
            continue # Skip this booking and continue with the next

    if serialization_errors > 0:
         current_app.logger.warning(f"Finished serializing bookings for user {user_id}, but encountered {serialization_errors} error(s).")

    current_app.logger.info(f"Successfully serialized {len(bookings_data)} bookings for user {user_id}.")
    # Return the list of bookings as JSON
    return jsonify({"bookings": bookings_data}), 200


# --- Placeholder Routes for Get Single Booking and Cancel Booking ---
# --- You will need to implement the actual logic for these ---

@bookings_bp.route('/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_single_booking(booking_id):
    user_id = get_jwt_identity()
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # Authorization check: Ensure the user is the customer or the owner of the vehicle
    is_owner = False
    if user_type == 'owner':
         # Check if the vehicle associated with the booking belongs to this owner
         if booking.vehicle and booking.vehicle.owner_id == user_id:
             is_owner = True

    if booking.customer_id != user_id and not is_owner:
         return jsonify({"error": "Unauthorized to view this booking"}), 403

    return jsonify(booking.to_dict()), 200


@bookings_bp.route('/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # Authorization check: Allow customer or owner to cancel
    # (Add more specific cancellation rules based on time/policy later)
    is_owner = False
    if user_type == 'owner':
        if booking.vehicle and booking.vehicle.owner_id == user_id:
            is_owner = True

    if booking.customer_id != user_id and not is_owner:
        return jsonify({"error": "Unauthorized to cancel this booking"}), 403

    # Check if booking can be cancelled (e.g., must be 'upcoming')
    if booking.status not in ['upcoming', 'confirmed', 'pending_approval']: # Adjust statuses as needed
         return jsonify({"error": f"Booking cannot be cancelled in its current status ('{booking.status}')"}), 400

    # Update status to 'cancelled' (or delete, depending on requirements)
    booking.status = 'cancelled'
    # TODO: Add cancellation reason if needed
    # TODO: Implement refund logic if applicable

    try:
        db.session.commit()
        # TODO: Notify other party (owner or customer) of cancellation
        current_app.logger.info(f"Booking {booking_id} cancelled by user {user_id} (type: {user_type}).")
        # Example: send_cancellation_notification(...)
        return jsonify({"message": "Booking cancelled successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error cancelling booking {booking_id}: {e}", exc_info=True)
        return jsonify({"error": "An internal error occurred while cancelling the booking."}), 500