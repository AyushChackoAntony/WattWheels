from flask import request, jsonify
from . import vehicles_bp
from app.models.vehicle import Vehicle
from app.models.user import User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route for an owner to add a new vehicle
@vehicles_bp.route('/', methods=['POST'])
@jwt_required()
def add_vehicle():
    current_user = get_jwt_identity()
    if current_user['type'] != 'owner':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # --- File Upload Handling ---
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Ensure the upload folder exists
        upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, filename))
        image_url = f"/{current_app.config['UPLOAD_FOLDER']}/{filename}"
    else:
        return jsonify({'error': 'Invalid file type'}), 400
    # --- End File Upload Handling ---

    data = request.get_json()

    # Basic validation
    required_fields = ['owner_id', 'name', 'type', 'year', 'color', 'licensePlate', 'pricePerDay', 'location']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required vehicle information'}), 400

    new_vehicle = Vehicle(
        owner_id=current_user['owner_id'],
        name=data['name'],
        type=data['type'],
        year=data['year'],
        color=data['color'],
        license_plate=data['licensePlate'],
        battery_range=data.get('batteryRange'),
        acceleration=data.get('acceleration'),
        price_per_day=data['pricePerDay'],
        location=data['location'],
        image_url=data.get('image')
    )

    db.session.add(new_vehicle)
    db.session.commit()

    return jsonify({'message': 'Vehicle added successfully', 'vehicle_id': new_vehicle.id}), 201

# Route for anyone to view all vehicles
@vehicles_bp.route('/', methods=['GET'])
def get_all_vehicles():
    owner_id = request.args.get('ownerId')
    if owner_id:
        # If ownerId is provided, return only that owner's vehicles
        vehicles = Vehicle.query.filter_by(owner_id=owner_id).all()
    else:
        # Otherwise, return all vehicles
        vehicles = Vehicle.query.all()
        
    vehicle_list = [v.to_dict() for v in vehicles]
    return jsonify({"vehicles": vehicle_list})

# Route for an owner to update a vehicle's status
@vehicles_bp.route('/<int:vehicle_id>', methods=['PATCH'])
@jwt_required()
def update_vehicle_status(vehicle_id):
    current_user = get_jwt_identity()
    if current_user['type'] != 'owner':
        return jsonify({'error': 'Unauthorized'}), 403

    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle or vehicle.owner_id != current_user['id']:
        return jsonify({'error': 'Vehicle not found or you do not have permission to edit it'}), 404

    data = request.get_json()
    new_status = data.get('status')
    
    if new_status not in ['active', 'maintenance', 'inactive']:
        return jsonify({'error': 'Invalid status'}), 400

    vehicle.status = new_status
    db.session.commit()

    return jsonify({'message': 'Vehicle status updated successfully', 'vehicle': vehicle.to_dict()}), 200

# Route for an owner to delete a vehicle
@vehicles_bp.route('/<int:vehicle_id>', methods=['DELETE'])
@jwt_required()
def delete_vehicle(vehicle_id):
    current_user = get_jwt_identity()
    if current_user['type'] != 'owner':
        return jsonify({'error': 'Unauthorized'}), 403

    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle or vehicle.owner_id != current_user['id']:
        return jsonify({'error': 'Vehicle not found or you do not have permission to delete it'}), 404

    # Add a check for active bookings before deleting in a real app
    
    db.session.delete(vehicle)
    db.session.commit()

    return jsonify({'message': 'Vehicle deleted successfully'}), 200

# Route to upload an image for an existing vehicle
@vehicles_bp.route('/<int:vehicle_id>/image', methods=['POST'])
@jwt_required()
def upload_vehicle_image(vehicle_id):
    current_user = get_jwt_identity()
    if current_user['type'] != 'owner':
        return jsonify({'error': 'Unauthorized'}), 403

    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle or vehicle.owner_id != current_user['id']:
        return jsonify({'error': 'Vehicle not found or you do not have permission to edit it'}), 404
        
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, filename))
        vehicle.image_url = f"/{current_app.config['UPLOAD_FOLDER']}/{filename}"
        db.session.commit()
        return jsonify({'message': 'Image uploaded successfully', 'vehicle': vehicle.to_dict()}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400