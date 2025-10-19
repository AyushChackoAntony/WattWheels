from flask import request, jsonify, current_app
from . import vehicles_bp
from app.models.vehicle import Vehicle
from app.models.user import User
from app import db
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route for an owner to add a new vehicle
@vehicles_bp.route('/', methods=['POST'])
def add_vehicle():
    # Use request.get_json() to correctly parse the incoming JSON data
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request must be JSON'}), 400

    # Get owner_id from the JSON payload
    owner_id = data.get('owner_id')
    if not owner_id:
        return jsonify({'error': 'owner_id is required'}), 400

    required_fields = ['name', 'type', 'year', 'color', 'licensePlate', 'pricePerDay', 'location']
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({'error': f'Missing required fields: {", ".join(missing)}'}), 422

    try:
        # Use the image URL sent from the frontend
        image_url = data.get('image')

        new_vehicle = Vehicle(
            owner_id=owner_id,
            name=data['name'],
            type=data['type'],
            year=int(data['year']),
            color=data['color'],
            license_plate=data['licensePlate'],
            price_per_day=float(data['pricePerDay']),
            location=data['location'],
            battery_range=data.get('batteryRange'),
            acceleration=data.get('acceleration'),
            image_url=image_url  # Use the image URL from the form
        )

        db.session.add(new_vehicle)
        db.session.commit()
        return jsonify({'message': 'Vehicle added successfully', 'vehicle': new_vehicle.to_dict()}), 201
    except ValueError:
        return jsonify({'error': 'Invalid data type for year or price. Please provide numbers.'}), 422
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Route for anyone to view all vehicles OR for an owner to view their vehicles
@vehicles_bp.route('/', methods=['GET'])
def get_all_vehicles():
    owner_id = request.args.get('ownerId')
    if owner_id:
        vehicles = Vehicle.query.filter_by(owner_id=owner_id).all()
    else:
        vehicles = Vehicle.query.all()
    return jsonify({"vehicles": [v.to_dict() for v in vehicles]})

# Route for an owner to update a vehicle's status
@vehicles_bp.route('/<int:vehicle_id>', methods=['PATCH'])
def update_vehicle_status(vehicle_id):
    data = request.get_json()
    owner_id = data.get('owner_id') # Insecure
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle or vehicle.owner_id != int(owner_id):
        return jsonify({'error': 'Vehicle not found or you do not have permission to edit it'}), 404
    new_status = data.get('status')
    if new_status not in ['active', 'maintenance', 'inactive']:
        return jsonify({'error': 'Invalid status'}), 400
    vehicle.status = new_status
    db.session.commit()
    return jsonify({'message': 'Vehicle status updated successfully', 'vehicle': vehicle.to_dict()}), 200

# Route for an owner to delete a vehicle
@vehicles_bp.route('/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    data = request.get_json()
    owner_id = data.get('owner_id') # Insecure
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle or vehicle.owner_id != int(owner_id):
        return jsonify({'error': 'Vehicle not found or you do not have permission to delete it'}), 404
    db.session.delete(vehicle)
    db.session.commit()
    return jsonify({'message': 'Vehicle deleted successfully'}), 200