# backend/app/api/bookings/routes.py
from flask import request, jsonify, current_app
from sqlalchemy.orm import load_only
from . import bookings_bp
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.availability import Availability
from app import db
# Import datetime AND timezone
from datetime import datetime, timezone
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    user_id_str = get_jwt_identity() # JWT identity is expected to be the user ID string
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    try:
        # Convert user_id from JWT (string) to integer
        user_id = int(user_id_str)
    except (ValueError, TypeError):
         current_app.logger.error(f"Invalid user identity in token: {user_id_str}")
         return jsonify({"error": "Invalid user identity in token"}), 401

    if user_type != 'customer':
        return jsonify({"error": "Only customers can create bookings"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request must be JSON"}), 400

    vehicle_id = data.get('vehicle_id')
    start_date_str = data.get('start_date') # Expecting ISO format like YYYY-MM-DDTHH:MM:SS.sssZ
    end_date_str = data.get('end_date')     # Expecting ISO format like YYYY-MM-DDTHH:MM:SS.sssZ
    destination = data.get('destination')   # Optional destination

    if not all([vehicle_id, start_date_str, end_date_str]):
        return jsonify({"error": "Missing required fields: vehicle_id, start_date, end_date"}), 400

    try:
        # Parse ISO string, result is offset-aware (UTC due to 'Z' or +00:00)
        start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))

        if start_date >= end_date:
            return jsonify({"error": "End date must be after start date"}), 400

        # Compare offset-aware start_date with offset-aware current UTC time
        if start_date < datetime.now(timezone.utc):
            return jsonify({"error": "Booking start date cannot be in the past"}), 400

    except (ValueError, TypeError) as e:
        current_app.logger.error(f"Date parsing error: {e}. Received start='{start_date_str}', end='{end_date_str}'", exc_info=True)
        return jsonify({"error": f"Invalid date format. Ensure dates are in a valid ISO format like YYYY-MM-DDTHH:MM:SS.sssZ"}), 400

    # --- Availability & Conflict Checks ---
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
    if vehicle.status != 'active':
        return jsonify({"error": f"Vehicle is currently not active ({vehicle.status})"}), 400

    # 1. Check against Owner's explicit unavailability (using full datetime comparison)
    is_unavailable = Availability.query.filter(
        Availability.vehicle_id == vehicle_id,
        Availability.is_available == False,
        Availability.start_date < end_date, # Check for overlap: Unavailability starts before booking ends
        Availability.end_date > start_date  # AND Unavailability ends after booking starts
    ).first()
    if is_unavailable:
        reason = f"due to {is_unavailable.reason}" if is_unavailable.reason else ""
        current_app.logger.warning(f"Booking conflict for vehicle {vehicle_id}: Owner marked unavailable {reason} from {is_unavailable.start_date} to {is_unavailable.end_date}")
        return jsonify({"error": f"Vehicle is marked unavailable by the owner {reason} during the selected period."}), 409

    # 2. Check against existing bookings (using full datetime comparison)
    conflicting_booking = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status.in_(['upcoming', 'active', 'confirmed']), # Check against relevant active statuses
        Booking.start_date < end_date, # Check for overlap: Existing booking starts before new one ends
        Booking.end_date > start_date  # AND Existing booking ends after new one starts
    ).first()
    if conflicting_booking:
        current_app.logger.warning(f"Booking conflict for vehicle {vehicle_id}: Already booked (ID: {conflicting_booking.id}) from {conflicting_booking.start_date} to {conflicting_booking.end_date}")
        return jsonify({"error": "Vehicle is already booked during the selected period."}), 409

    # --- Price Calculation ---
    duration_delta = end_date - start_date
    # Calculate duration in fractional days for potentially more accurate pricing
    duration_days = duration_delta.total_seconds() / (24 * 60 * 60)
    if duration_days <= 0:
         return jsonify({"error": "Booking duration must be positive"}), 400
    # Apply pricing rules (e.g., minimum 1 day charge)
    calculated_price = round(max(duration_days, 1) * vehicle.price_per_day, 2)

    # --- Create Booking ---
    try:
        new_booking = Booking(
            customer_id=user_id,        # Use integer user_id
            vehicle_id=vehicle_id,
            start_date=start_date,      # Store timezone-aware datetime
            end_date=end_date,        # Store timezone-aware datetime
            total_price=calculated_price,
            status='upcoming',        # Initial status
            destination=destination     # Store optional destination
        )
        db.session.add(new_booking)
        db.session.commit()

        # Log successful booking and potential notification trigger
        owner_id_to_notify = vehicle.owner_id
        current_app.logger.info(f"New booking created (ID: {new_booking.id}) for vehicle {vehicle_id} by customer {user_id}. Owner {owner_id_to_notify} should be notified.")
        # Placeholder for actual notification logic:
        # send_booking_notification(owner_id_to_notify, new_booking.id)

        return jsonify({"message": "Booking created successfully!", "booking": new_booking.to_dict()}), 201

    except Exception as e:
        db.session.rollback() # Rollback transaction on any error during commit
        current_app.logger.error(f"Error saving booking to database: {e}", exc_info=True)
        return jsonify({"error": "An internal error occurred while saving the booking."}), 500


@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_bookings():
    user_id_str = get_jwt_identity()
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
         current_app.logger.error(f"Invalid user identity in token during get_bookings: {user_id_str}")
         return jsonify({"error": "Invalid token identity"}), 401

    if not user_type:
        current_app.logger.error("Missing user_type claim in token")
        return jsonify({"error": "Invalid token claims"}), 401

    bookings_query = None

    if user_type == 'customer':
        current_app.logger.info(f"Fetching bookings for customer {user_id}")
        bookings_query = Booking.query.filter_by(customer_id=user_id)
    elif user_type == 'owner':
        current_app.logger.info(f"Fetching bookings for owner {user_id}")
        # Fetch only the IDs of vehicles owned by the user
        owner_vehicle_ids = db.session.query(Vehicle.id).filter_by(owner_id=user_id).all()
        vehicle_ids = [v_id[0] for v_id in owner_vehicle_ids]

        if not vehicle_ids:
             current_app.logger.info(f"Owner {user_id} has no vehicles. Returning empty list.")
             return jsonify({"bookings": []}), 200

        current_app.logger.info(f"Owner {user_id} - Vehicle IDs: {vehicle_ids}")
        bookings_query = Booking.query.filter(Booking.vehicle_id.in_(vehicle_ids))
    else:
        current_app.logger.warning(f"Unauthorized user type '{user_type}' for user_id {user_id} attempting GET /bookings.")
        return jsonify({"error": "Unauthorized user type"}), 403

    bookings = bookings_query.order_by(Booking.created_at.desc()).all()
    current_app.logger.info(f"Found {len(bookings)} booking record(s) for user_id {user_id}.")

    bookings_data = []
    serialization_errors = 0
    for b in bookings:
        try:
            booking_dict = b.to_dict()
            bookings_data.append(booking_dict)
        except Exception as e:
            serialization_errors += 1
            current_app.logger.error(f"Error serializing booking ID {b.id} for user {user_id}: {e}", exc_info=True)
            continue # Skip problematic booking

    if serialization_errors > 0:
         current_app.logger.warning(f"Finished serializing bookings for user {user_id}, encountered {serialization_errors} error(s).")

    current_app.logger.info(f"Successfully serialized {len(bookings_data)} bookings for user {user_id}.")
    return jsonify({"bookings": bookings_data}), 200


@bookings_bp.route('/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_single_booking(booking_id):
    user_id_str = get_jwt_identity()
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
         return jsonify({"error": "Invalid user identity in token"}), 401

    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # Authorization check
    is_owner = False
    if user_type == 'owner':
         if booking.vehicle and booking.vehicle.owner_id == user_id:
             is_owner = True

    if booking.customer_id != user_id and not is_owner:
         current_app.logger.warning(f"Unauthorized attempt by user {user_id} (type: {user_type}) to view booking {booking_id}")
         return jsonify({"error": "Unauthorized to view this booking"}), 403

    try:
        return jsonify(booking.to_dict()), 200
    except Exception as e:
        current_app.logger.error(f"Error serializing single booking ID {booking_id}: {e}", exc_info=True)
        return jsonify({"error": "Error retrieving booking details"}), 500


@bookings_bp.route('/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    user_id_str = get_jwt_identity()
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
         return jsonify({"error": "Invalid user identity in token"}), 401

    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # Authorization check
    is_owner = False
    if user_type == 'owner':
        if booking.vehicle and booking.vehicle.owner_id == user_id:
            is_owner = True

    if booking.customer_id != user_id and not is_owner:
        current_app.logger.warning(f"Unauthorized attempt by user {user_id} (type: {user_type}) to cancel booking {booking_id}")
        return jsonify({"error": "Unauthorized to cancel this booking"}), 403

    # Check if booking is in a cancellable state
    cancellable_statuses = ['upcoming', 'confirmed', 'pending_approval'] # Define which statuses can be cancelled
    if booking.status not in cancellable_statuses:
         return jsonify({"error": f"Booking cannot be cancelled in its current status ('{booking.status}')"}), 400

    # Perform cancellation
    booking.status = 'cancelled'
    # Optional: Add cancellation reason, timestamp, who cancelled it
    # booking.cancellation_reason = data.get('reason', 'Cancelled by user')
    # booking.cancelled_at = datetime.now(timezone.utc)
    # booking.cancelled_by = user_id

    try:
        db.session.commit()
        # Placeholder for notification logic
        current_app.logger.info(f"Booking {booking_id} cancelled successfully by user {user_id} (type: {user_type}).")
        # send_cancellation_notification(booking)
        return jsonify({"message": "Booking cancelled successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error committing cancellation for booking {booking_id}: {e}", exc_info=True)
        return jsonify({"error": "An internal error occurred while cancelling the booking."}), 500