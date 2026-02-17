from flask import request, jsonify
from . import availability_bp
from app import mongo # Replace 'db' with 'mongo'
from app.models.user import User
from app.models.vehicle import Vehicle
from bson import ObjectId # Required for MongoDB ID lookups
from datetime import datetime

# GET all availability for an owner's vehicles
@availability_bp.route('/<string:owner_id>', methods=['GET']) # Changed int to string for MongoDB IDs
def get_availability(owner_id):
    # Search for owner using the helper method and ObjectId
    owner = User.find_by_id(owner_id)
    if not owner or owner.get('user_type') != 'owner':
        return jsonify({'error': 'Owner not found'}), 404

    # Find all vehicles belonging to this owner
    vehicles = list(mongo.db.vehicles.find({"owner_id": owner_id}))
    vehicle_ids = [str(v['_id']) for v in vehicles]
    
    # Query availability collection using the list of vehicle IDs
    availabilities = list(mongo.db.availability.find({"vehicle_id": {"$in": vehicle_ids}}))

    # Format the results for JSON
    formatted_availabilities = []
    for a in availabilities:
        a['id'] = str(a.pop('_id')) # Convert ObjectId to string
        # Ensure dates are formatted as strings if they are datetime objects
        if isinstance(a.get('start_date'), datetime):
            a['start_date'] = a['start_date'].strftime('%Y-%m-%d')
        if isinstance(a.get('end_date'), datetime):
            a['end_date'] = a['end_date'].strftime('%Y-%m-%d')
        formatted_availabilities.append(a)

    return jsonify(formatted_availabilities), 200

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

    # Prepare MongoDB document
    new_availability = {
        "vehicle_id": vehicle_id,
        "start_date": start_date,
        "end_date": end_date,
        "is_available": is_available,
        "reason": reason,
        "created_at": datetime.utcnow()
    }

    # Insert into the 'availability' collection
    result = mongo.db.availability.insert_one(new_availability)
    
    # Add string version of ID for the response
    new_availability['id'] = str(result.inserted_id)
    new_availability.pop('_id', None)
    
    # Re-format dates for the response
    new_availability['start_date'] = start_date_str
    new_availability['end_date'] = end_date_str

    return jsonify(new_availability), 201

# DELETE an availability period
@availability_bp.route('/<string:availability_id>', methods=['DELETE']) # Changed int to string
def delete_availability(availability_id):
    # Delete the document using its ObjectId
    result = mongo.db.availability.delete_one({"_id": ObjectId(availability_id)})
    
    if result.deleted_count == 0:
        return jsonify({'error': 'Availability record not found'}), 404

    return jsonify({'message': 'Availability record deleted'}), 200