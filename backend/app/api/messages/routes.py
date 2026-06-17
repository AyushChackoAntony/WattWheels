from flask import request, jsonify
from . import messages_bp
from app import mongo
from bson import ObjectId
from datetime import datetime, timezone
from flask_jwt_extended import jwt_required, get_jwt_identity

@messages_bp.route('/<string:booking_id>', methods=['POST'])
@jwt_required()
def send_message(booking_id):
    sender_id = get_jwt_identity()
    data = request.get_json()
    
    booking = mongo.db.bookings.find_one({"_id": ObjectId(booking_id)})
    vehicle = mongo.db.vehicles.find_one({"_id": ObjectId(booking['vehicle_id'])})
    
    is_customer = str(booking['customer_id']) == sender_id
    is_owner = str(vehicle['owner_id']) == sender_id

    if not (is_customer or is_owner):
        return jsonify({"error": "Unauthorized"}), 403

    msg = {
        "booking_id": booking_id,
        "sender_id": sender_id,
        "content": data['content'],
        "timestamp": datetime.now(timezone.utc)
    }
    mongo.db.messages.insert_one(msg)

    # Notification
    receiver_id = str(vehicle['owner_id']) if is_customer else str(booking['customer_id'])
    mongo.db.notifications.insert_one({
        "user_id": receiver_id,
        "type": "new_message",
        "booking_id": booking_id,
        "is_read": False,
        "created_at": datetime.now(timezone.utc)
    })

    return jsonify({"message": "Sent"}), 201

@messages_bp.route('/<string:booking_id>', methods=['GET'])
@jwt_required()
def get_messages(booking_id):
    messages = list(mongo.db.messages.find({"booking_id": booking_id}).sort("timestamp", 1))
    for m in messages:
        m['id'] = str(m.pop('_id'))
        m['timestamp'] = m['timestamp'].isoformat()
    return jsonify({"messages": messages}), 200