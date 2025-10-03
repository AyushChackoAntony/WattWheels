from flask import request, jsonify
from . import settings_bp
from app import db
from app.models.user import User
from app.models.owner_settings import OwnerSettings
import re

# Helper function to convert camelCase to snake_case
def to_snake_case(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

@settings_bp.route('/<int:owner_id>', methods=['GET'])
def get_settings(owner_id):
    owner = User.query.get(owner_id)
    if not owner or owner.user_type != 'owner':
        return jsonify({'error': 'Owner not found'}), 404

    settings = owner.settings
    if not settings:
        # If settings don't exist, create them with default values
        settings = OwnerSettings(owner_id=owner_id)
        db.session.add(settings)
        db.session.commit()

    return jsonify(settings.to_dict()), 200

@settings_bp.route('/<int:owner_id>', methods=['PUT'])
def update_settings(owner_id):
    owner = User.query.get(owner_id)
    if not owner or owner.user_type != 'owner':
        return jsonify({'error': 'Owner not found'}), 404

    settings = owner.settings
    if not settings:
        settings = OwnerSettings(owner_id=owner_id)
        db.session.add(settings)

    data = request.get_json()

    # Iterate through the data and update the settings object
    for category, values in data.items():
        if isinstance(values, dict):
            for key, value in values.items():
                snake_case_key = to_snake_case(key)
                if hasattr(settings, snake_case_key):
                    setattr(settings, snake_case_key, value)
    
    db.session.commit()
    
    return jsonify({'message': 'Settings updated successfully'}), 200