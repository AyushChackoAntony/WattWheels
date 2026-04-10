from flask import request, jsonify, current_app
from . import bookings_bp
from app import mongo
from bson import ObjectId
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.utils.pricing import calculate_dynamic_price
from app.utils.stats import update_aggregate_rating

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data: return jsonify({"error": "No data"}), 400

    vehicle_id = data.get('vehicle_id')
    try:
        start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
    except: return jsonify({"error": "Invalid dates"}), 400

    # Conflict & Ownership Checks
    vehicle = mongo.db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not vehicle or vehicle.get('status') != 'active':
        return jsonify({"error": "Vehicle unavailable"}), 400

    conflicting = mongo.db.bookings.find_one({
        "vehicle_id": vehicle_id,
        "status": {"$in": ['upcoming', 'active', 'confirmed', 'pending_approval', 'pending_payment']},
        "start_date": {"$lt": end_date},
        "end_date": {"$gt": start_date}
    })
    if conflicting: return jsonify({"error": "Conflict detected"}), 409

    # Pricing & Status logic
    calculated_price = calculate_dynamic_price(vehicle, start_date, end_date, mongo)
    is_instant = vehicle.get('is_instant_bookable', True)
    initial_status = 'pending_payment' if is_instant else 'pending_approval'

    new_booking = {
        "customer_id": user_id,
        "vehicle_id": vehicle_id,
        "start_date": start_date,
        "end_date": end_date,
        "total_price": calculated_price,
        "status": initial_status,
        "payment_status": 'pending',
        "created_at": datetime.now(timezone.utc)
    }
    result = mongo.db.bookings.insert_one(new_booking)
    
    return jsonify({
        "booking_id": str(result.inserted_id),
        "requires_approval": not is_instant,
        "total_price": calculated_price
    }), 201

@bookings_bp.route('/<string:booking_id>/review', methods=['POST'])
@jwt_required()
def add_review(booking_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    booking = mongo.db.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking or booking['status'] != 'completed':
        return jsonify({"error": "Invalid trip for review"}), 400

    new_review = {
        "booking_id": booking_id,
        "reviewer_id": user_id,
        "target_id": data['target_id'],
        "target_type": data['target_type'], 
        "rating": int(data['rating']),
        "comment": data['comment'],
        "created_at": datetime.now(timezone.utc)
    }
    mongo.db.reviews.insert_one(new_review)
    update_aggregate_rating(data['target_id'], data['target_type'])
    return jsonify({"message": "Review added"}), 201

@bookings_bp.route('/cleanup-expired', methods=['POST'])
def cleanup_expired():
    threshold = datetime.now(timezone.utc) - timedelta(minutes=30)
    res = mongo.db.bookings.update_many(
        {"status": "pending_payment", "created_at": {"$lt": threshold}},
        {"$set": {"status": "expired", "expired_at": datetime.now(timezone.utc)}}
    )
    return jsonify({"expired_count": res.modified_count}), 200

@bookings_bp.route('/<string:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    booking = mongo.db.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking or str(booking['customer_id']) != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    now = datetime.now(timezone.utc)
    refund = booking['total_price']
    if (booking['start_date'] - now) < timedelta(hours=24):
        refund *= 0.8 # 20% penalty

    mongo.db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": "cancelled", "refund_amount": refund, "cancelled_at": now}}
    )
    return jsonify({"message": "Cancelled", "refund": refund}), 200

@bookings_bp.route('/<string:booking_id>/refund-preview', methods=['GET'])
@jwt_required()
def get_refund_preview(booking_id):
    booking = mongo.db.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking: return jsonify({"error": "Not found"}), 404

    now = datetime.now(timezone.utc)
    time_to_pickup = booking['start_date'].replace(tzinfo=timezone.utc) - now
    
    total = booking['total_price']
    penalty = 0
    
    # Logic: 20% penalty if less than 24h notice
    if time_to_pickup < timedelta(hours=24):
        penalty = total * 0.2
    
    return jsonify({
        "total_paid": total,
        "penalty_amount": round(penalty, 2),
        "refund_amount": round(total - penalty, 2),
        "is_last_minute": time_to_pickup < timedelta(hours=24)
    }), 200