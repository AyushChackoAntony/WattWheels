from flask import request, jsonify
from . import settings_bp
from app import mongo # Replace 'db' with 'mongo'
from app.models.user import User
from bson import ObjectId
import re

# Helper function to convert camelCase to snake_case
def to_snake_case(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

@settings_bp.route('/<string:owner_id>', methods=['GET']) # Changed int to string for MongoDB IDs
def get_settings(owner_id):
    # Retrieve owner from MongoDB using helper method
    owner = User.find_by_id(owner_id)
    if not owner or owner.get('user_type') != 'owner':
        return jsonify({'error': 'Owner not found'}), 404

    # Check for settings in the 'owner_settings' collection
    settings = mongo.db.owner_settings.find_one({"owner_id": owner_id})
    
    if not settings:
        # If settings don't exist, create a default document
        settings = {
            "owner_id": owner_id,
            "notifications_email": True,
            "notifications_push": True,
            "booking_auto_approve": False,
            "privacy_show_profile": True
        }
        mongo.db.owner_settings.insert_one(settings)

    # Convert MongoDB _id to string for JSON compatibility
    settings['id'] = str(settings.pop('_id'))
    return jsonify(settings), 200

@settings_bp.route('/<string:owner_id>', methods=['PUT']) # Changed int to string
def update_settings(owner_id):
    owner = User.find_by_id(owner_id)
    if not owner or owner.get('user_type') != 'owner':
        return jsonify({'error': 'Owner not found'}), 404

    data = request.get_json()
    update_data = {}

    # Flatten the incoming JSON categories and convert keys to snake_case
    for category, values in data.items():
        if isinstance(values, dict):
            for key, value in values.items():
                snake_case_key = to_snake_case(key)
                update_data[snake_case_key] = value

    # Perform an upsert (update if exists, insert if not) in MongoDB
    mongo.db.owner_settings.update_one(
        {"owner_id": owner_id},
        {"$set": update_data},
        upsert=True
    )
    
    return jsonify({'message': 'Settings updated successfully'}), 200