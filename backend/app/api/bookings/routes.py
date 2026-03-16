from flask import request, jsonify, current_app
from . import bookings_bp
from app.models.booking import Booking
from app.models.user import User
from app.models.vehicle import Vehicle
from app import mongo
from bson import ObjectId
from datetime import datetime, timezone
import math  # For ceiling calculation of hours
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity() 
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    if user_type != 'customer':
        return jsonify({"error": "Only customers can create bookings"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request must be JSON"}), 400

    vehicle_id = data.get('vehicle_id')
    # Frontend should now send datetime-local strings (YYYY-MM-DDTHH:MM)
    start_date_str = data.get('start_date') 
    end_date_str = data.get('end_date')
    destination = data.get('destination')

    if not all([vehicle_id, start_date_str, end_date_str]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Parse exact date and time
        start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))

        if start_date >= end_date:
            return jsonify({"error": "End time must be after start time"}), 400
        if start_date < datetime.now(timezone.utc):
            return jsonify({"error": "Booking start time cannot be in the past"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid date/time format"}), 400

    # --- Conflict Checks ---
    vehicle = mongo.db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
    if vehicle.get('status') != 'active':
        return jsonify({"error": "Vehicle is not active"}), 400

    # 1. Check Owner Unavailability
    is_unavailable = mongo.db.availability.find_one({
        "vehicle_id": vehicle_id,
        "is_available": False,
        "start_date": {"$lt": end_date},
        "end_date": {"$gt": start_date}
    })
    if is_unavailable:
        return jsonify({"error": "Vehicle is unavailable during this period"}), 409

    # 2. Check Existing Bookings
    conflicting_booking = mongo.db.bookings.find_one({
        "vehicle_id": vehicle_id,
        "status": {"$in": ['upcoming', 'active', 'confirmed']},
        "start_date": {"$lt": end_date},
        "end_date": {"$gt": start_date}
    })
    if conflicting_booking:
        return jsonify({"error": "Vehicle is already booked"}), 409

    # --- Phase 1: Price Calculation (Hourly) ---
    # Calculate duration in hours
    duration_seconds = (end_date - start_date).total_seconds()
    duration_hours = math.ceil(duration_seconds / 3600)
    
    # Use hourly rate if it exists, otherwise fallback to daily/24
    daily_rate = vehicle.get('price_per_day', 0)
    hourly_rate = vehicle.get('price_per_hour', round(daily_rate / 24, 2))
    calculated_price = round(duration_hours * hourly_rate, 2)

    # --- Phase 1: Create Booking with Payment Fields ---
    try:
        new_booking_doc = {
            "customer_id": user_id,
            "vehicle_id": vehicle_id,
            "start_date": start_date,
            "end_date": end_date,
            "total_price": calculated_price,
            "status": 'pending_payment', # Changed from 'upcoming' to reflect payment flow
            "payment_status": 'pending',  # NEW
            "destination": destination,
            "created_at": datetime.now(timezone.utc)
        }
        result = mongo.db.bookings.insert_one(new_booking_doc)
        
        booking_id = str(result.inserted_id)
        return jsonify({
            "message": "Booking initiated. Please complete payment.", 
            "booking_id": booking_id,
            "total_price": calculated_price
        }), 201

    except Exception as e:
        current_app.logger.error(f"Error saving booking: {e}")
        return jsonify({"error": "Internal error"}), 500

@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_bookings():
    user_id = get_jwt_identity()
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    if user_type == 'customer':
        query = {"customer_id": user_id}
    elif user_type == 'owner':
        # Find vehicles owned by this user
        owner_vehicles = list(mongo.db.vehicles.find({"owner_id": user_id}, {"_id": 1}))
        vehicle_ids = [str(v['_id']) for v in owner_vehicles]
        if not vehicle_ids:
            return jsonify({"bookings": []}), 200
        query = {"vehicle_id": {"$in": vehicle_ids}}
    else:
        return jsonify({"error": "Unauthorized user type"}), 403

    bookings = list(mongo.db.bookings.find(query).sort("created_at", -1))
    
    # Simple serialization loop
    for b in bookings:
        b['id'] = str(b.pop('_id'))
        b['start_date'] = b['start_date'].isoformat()
        b['end_date'] = b['end_date'].isoformat()

    return jsonify({"bookings": bookings}), 200

@bookings_bp.route('/<string:booking_id>', methods=['GET'])
@jwt_required()
def get_single_booking(booking_id):
    user_id = get_jwt_identity()
    user_type = get_jwt().get("user_type")

    booking = mongo.db.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # Authorization Check
    authorized = False
    if booking['customer_id'] == user_id:
        authorized = True
    elif user_type == 'owner':
        vehicle = mongo.db.vehicles.find_one({"_id": ObjectId(booking['vehicle_id'])})
        if vehicle and vehicle['owner_id'] == user_id:
            authorized = True

    if not authorized:
        return jsonify({"error": "Unauthorized"}), 403

    booking['id'] = str(booking.pop('_id'))
    return jsonify(booking), 200

@bookings_bp.route('/<string:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    
    booking = mongo.db.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    if booking['customer_id'] != user_id:
        # Optionally allow owner to cancel too
        return jsonify({"error": "Unauthorized"}), 403

    if booking['status'] not in ['upcoming', 'confirmed']:
        return jsonify({"error": "Booking cannot be cancelled"}), 400

    mongo.db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": "cancelled", "cancelled_at": datetime.now(timezone.utc)}}
    )

    return jsonify({"message": "Booking cancelled successfully"}), 200