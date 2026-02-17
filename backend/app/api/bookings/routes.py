from flask import request, jsonify, current_app
from . import bookings_bp
from app.models.booking import Booking
from app.models.user import User
from app.models.vehicle import Vehicle
from app import mongo
from bson import ObjectId
from datetime import datetime, timezone
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity() # MongoDB IDs are strings
    jwt_claims = get_jwt()
    user_type = jwt_claims.get("user_type")

    if user_type != 'customer':
        return jsonify({"error": "Only customers can create bookings"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request must be JSON"}), 400

    vehicle_id = data.get('vehicle_id')
    start_date_str = data.get('start_date')
    end_date_str = data.get('end_date')
    destination = data.get('destination')

    if not all([vehicle_id, start_date_str, end_date_str]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))

        if start_date >= end_date:
            return jsonify({"error": "End date must be after start date"}), 400
        if start_date < datetime.now(timezone.utc):
            return jsonify({"error": "Booking start date cannot be in the past"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid date format"}), 400

    # --- Conflict Checks ---
    # Fetch vehicle data from MongoDB
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

    # --- Price Calculation ---
    duration_days = (end_date - start_date).total_seconds() / (24 * 60 * 60)
    calculated_price = round(max(duration_days, 1) * vehicle.get('price_per_day', 0), 2)

    # --- Create Booking ---
    try:
        new_booking_doc = {
            "customer_id": user_id,
            "vehicle_id": vehicle_id,
            "start_date": start_date,
            "end_date": end_date,
            "total_price": calculated_price,
            "status": 'upcoming',
            "destination": destination,
            "created_at": datetime.now(timezone.utc)
        }
        result = mongo.db.bookings.insert_one(new_booking_doc)
        
        # Prepare for response
        new_booking_doc['id'] = str(result.inserted_id)
        return jsonify({"message": "Booking created successfully!", "booking_id": new_booking_doc['id']}), 201

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