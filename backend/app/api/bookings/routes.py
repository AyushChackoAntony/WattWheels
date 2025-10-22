# backend/app/api/bookings/routes.py
from flask import request, jsonify, current_app # Keep current_app if using logger elsewhere
from . import bookings_bp
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.models.user import User
from app import db
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

# --- create_booking and other routes remain the same ---
# ...

@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_bookings():
    print("--- ENTERING get_bookings ---") # <<< ADD PRINT
    # Outer try...except block removed for debugging
    current_user = get_jwt_identity()
    user_id = current_user.get('id')
    user_type = current_user.get('type')
    print(f"--- User ID: {user_id}, User Type: {user_type} ---") # <<< ADD PRINT

    if not user_id or not user_type:
        print("--- ERROR: Invalid token identity ---") # <<< ADD PRINT
        # current_app.logger.error("Invalid token identity received in get_bookings") # Keep logger if you want
        return jsonify({"error": "Invalid token identity"}), 401

    bookings_query = None

    if user_type == 'customer':
        print(f"--- Fetching bookings for customer {user_id} ---") # <<< ADD PRINT
        bookings_query = Booking.query.filter_by(customer_id=user_id)
    elif user_type == 'owner':
        print(f"--- Fetching vehicles for owner {user_id} ---") # <<< ADD PRINT
        owner_vehicles = Vehicle.query.filter_by(owner_id=user_id).options(db.load_only(Vehicle.id)).all()
        if not owner_vehicles:
             print(f"--- Owner {user_id} has no vehicles. Returning empty list. ---") # <<< ADD PRINT
             # current_app.logger.info(f"Owner {user_id} has no vehicles. Returning empty list.")
             return jsonify({"bookings": []}), 200
        vehicle_ids = [v.id for v in owner_vehicles]
        print(f"--- Owner {user_id} Vehicle IDs: {vehicle_ids} ---") # <<< ADD PRINT
        # current_app.logger.info(f"Owner {user_id} - Vehicle IDs: {vehicle_ids}")
        bookings_query = Booking.query.filter(Booking.vehicle_id.in_(vehicle_ids))
    else:
        print(f"--- ERROR: Invalid user type '{user_type}' ---") # <<< ADD PRINT
        # current_app.logger.warning(f"Unauthorized user type '{user_type}' for user_id {user_id} attempting to get bookings.")
        return jsonify({"error": "Invalid user type specified in token"}), 403

    print("--- Executing database query... ---") # <<< ADD PRINT
    bookings = bookings_query.order_by(Booking.created_at.desc()).all()
    print(f"--- Found {len(bookings)} booking record(s) ---") # <<< ADD PRINT
    # current_app.logger.info(f"Found {len(bookings)} booking record(s) for user_id {user_id}.")

    bookings_data = []
    serialization_errors = 0
    print("--- Starting serialization loop... ---") # <<< ADD PRINT
    for i, b in enumerate(bookings): # Add index for easier identification
        print(f"--- Attempting to serialize booking index {i}, ID {b.id} ---") # <<< ADD PRINT
        try:
            booking_dict = b.to_dict()
            bookings_data.append(booking_dict)
            print(f"--- Successfully serialized booking ID {b.id} ---") # <<< ADD PRINT
        except Exception as e:
            serialization_errors += 1
            print(f"---!!! EXCEPTION serializing booking ID {b.id}: {e} ---") # <<< ADD PRINT (More visible)
            # Log full traceback using logger if it works, otherwise rely on print
            current_app.logger.error(f"Error serializing booking ID {b.id}: {e}", exc_info=True)
            raise e # Re-raise exception for Flask debugger

    if serialization_errors > 0:
         print(f"--- WARNING: Encountered {serialization_errors} serialization error(s). ---") # <<< ADD PRINT
         # current_app.logger.warning(f"Finished serializing bookings for user {user_id}, but encountered {serialization_errors} error(s).")

    print(f"--- Successfully processed {len(bookings_data)} bookings. Returning response. ---") # <<< ADD PRINT
    # current_app.logger.info(f"Successfully serialized {len(bookings_data)} bookings for user {user_id}.")
    return jsonify({"bookings": bookings_data}), 200

# --- get_single_booking and cancel_booking routes remain the same ---
# ...