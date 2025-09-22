from flask import request, jsonify
from . import vehicles_bp
from app.models.vehicle import Vehicle
from app import db

# Route for an owner to add a new vehicle
@vehicles_bp.route('/', methods=['POST'])
def add_vehicle():
    data = request.get_json()

    # Basic validation
    required_fields = ['owner_id', 'name', 'type', 'year', 'color', 'licensePlate', 'pricePerDay', 'location']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required vehicle information'}), 400

    new_vehicle = Vehicle(
        owner_id=data['owner_id'],
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
    vehicles = Vehicle.query.all()
    vehicle_list = []
    for v in vehicles:
        vehicle_list.append({
            'id': v.id,
            'name': v.name,
            'type': v.type,
            'pricePerDay': v.price_per_day,
            'location': v.location,
            'imageUrl': v.image_url
        })
    return jsonify(vehicle_list)