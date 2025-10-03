from flask import request, jsonify
from . import availability_bp
from app import db
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.availability import Availability
from datetime import datetime

# GET all availability for an owner's vehicles
@availability_bp.route('/<int:owner_id>', methods=['GET'])
def get_availability(owner_id):
    owner = User.query.get(owner_id)
    if not owner or owner.user_type != 'owner':
        return jsonify({'error': 'Owner not found'}), 404

    vehicle_ids = [vehicle.id for vehicle in owner.vehicles]
    availabilities = Availability.query.filter(Availability.vehicle_id.in_(vehicle_ids)).all()

    return jsonify([a.to_dict() for a in availabilities]), 200

# POST a new availability period
@availability_bp.route('/', methods=['POST'])
def add_availability():
    data = request.get_json()

    vehicle_id = data.get('vehicle_id')
    start_date_str = data.get('start_date')
    end_date_str = data.get('end_date')
    is_available = data.get('is_available', True)
    reason = data.get('reason')

    if not all([vehicle_id, start_date_str, end_date_str]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    new_availability = Availability(
        vehicle_id=vehicle_id,
        start_date=start_date,
        end_date=end_date,
        is_available=is_available,
        reason=reason
    )

    db.session.add(new_availability)
    db.session.commit()

    return jsonify(new_availability.to_dict()), 201

# DELETE an availability period
@availability_bp.route('/<int:availability_id>', methods=['DELETE'])
def delete_availability(availability_id):
    availability = Availability.query.get(availability_id)
    if not availability:
        return jsonify({'error': 'Availability record not found'}), 404

    db.session.delete(availability)
    db.session.commit()

    return jsonify({'message': 'Availability record deleted'}), 200