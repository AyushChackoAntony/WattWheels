from flask import request, jsonify, current_app
from . import vehicles_bp
from app import mongo
from bson import ObjectId
import os
from datetime import datetime

@vehicles_bp.route('/', methods=['POST'])
def add_vehicle():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request must be JSON'}), 400

    owner_id = data.get('owner_id')
    if not owner_id:
        return jsonify({'error': 'owner_id is required'}), 400

    required_fields = ['name', 'type', 'year', 'color', 'licensePlate', 'pricePerDay', 'location']
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({'error': f'Missing required fields: {", ".join(missing)}'}), 422

    try:
        new_vehicle = {
            "owner_id": owner_id,
            "name": data['name'],
            "type": data['type'],
            "year": int(data['year']),
            "color": data['color'],
            "license_plate": data['licensePlate'],
            "price_per_day": float(data['pricePerDay']),
            "location": data['location'],
            "battery_range": data.get('batteryRange'),
            "acceleration": data.get('acceleration'),
            "image_url": data.get('image'),
            "status": "active",
            "created_at": datetime.utcnow()
        }

        result = mongo.db.vehicles.insert_one(new_vehicle)
        new_vehicle['id'] = str(result.inserted_id)
        new_vehicle.pop('_id')
        
        return jsonify({'message': 'Vehicle added successfully', 'vehicle': new_vehicle}), 201
    except ValueError:
        return jsonify({'error': 'Invalid data type for year or price. Please provide numbers.'}), 422
    except Exception as e:
        current_app.logger.error(f"Error adding vehicle: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500


@vehicles_bp.route('/', methods=['GET'])
def get_all_vehicles():
    owner_id = request.args.get('ownerId')
    search_start_str = request.args.get('startDate')
    search_end_str = request.args.get('endDate')

    query = {}

    if owner_id:
        # --- Owner View ---
        query["owner_id"] = owner_id
        current_app.logger.info(f"Fetching vehicles for owner {owner_id}")
    else:
        # --- Customer View ---
        query["status"] = "active"

        if search_start_str and search_end_str:
            try:
                search_start = datetime.strptime(search_start_str, '%Y-%m-%d')
                search_end = datetime.strptime(search_end_str, '%Y-%m-%d')

                # 1. Get IDs of vehicles marked UNAVAILABLE
                unavailable_ids = mongo.db.availability.distinct("vehicle_id", {
                    "is_available": False,
                    "start_date": {"$lt": search_end},
                    "end_date": {"$gt": search_start}
                })

                # 2. Get IDs of vehicles already BOOKED
                booked_ids = mongo.db.bookings.distinct("vehicle_id", {
                    "status": {"$in": ['upcoming', 'active', 'confirmed']},
                    "start_date": {"$lt": search_end},
                    "end_date": {"$gt": search_start}
                })

                # Combine IDs to exclude
                exclude_ids = list(set(unavailable_ids + booked_ids))
                if exclude_ids:
                    query["_id"] = {"$nin": [ObjectId(vid) for vid in exclude_ids if ObjectId.is_valid(vid)]}
                    current_app.logger.info(f"Excluding {len(exclude_ids)} unavailable/booked vehicles.")

            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    vehicles = list(mongo.db.vehicles.find(query))
    for v in vehicles:
        v['id'] = str(v.pop('_id'))

    return jsonify({"vehicles": vehicles})


@vehicles_bp.route('/<string:vehicle_id>', methods=['PATCH'])
def update_vehicle_status(vehicle_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request must be JSON'}), 400
        
    owner_id = data.get('owner_id')
    new_status = data.get('status')

    if new_status not in ['active', 'maintenance', 'inactive']:
        return jsonify({'error': 'Invalid status'}), 400

    # Verify ownership and update status
    result = mongo.db.vehicles.update_one(
        {"_id": ObjectId(vehicle_id), "owner_id": owner_id},
        {"$set": {"status": new_status}}
    )

    if result.matched_count == 0:
        return jsonify({'error': 'Vehicle not found or you do not have permission to edit it'}), 404

    return jsonify({'message': 'Vehicle status updated successfully'}), 200


@vehicles_bp.route('/<string:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    data = request.get_json()
    owner_id = data.get('owner_id')

    if not owner_id:
        return jsonify({'error': 'owner_id is required'}), 400

    # Check for active bookings before deleting
    active_booking = mongo.db.bookings.find_one({
        "vehicle_id": vehicle_id,
        "status": {"$in": ['upcoming', 'active', 'confirmed']}
    })

    if active_booking:
        return jsonify({'error': 'Cannot delete vehicle with active or upcoming bookings'}), 400

    result = mongo.db.vehicles.delete_one({"_id": ObjectId(vehicle_id), "owner_id": owner_id})
    
    if result.deleted_count == 0:
        return jsonify({'error': 'Vehicle not found or unauthorized'}), 404

    # Cleanup related availability records
    mongo.db.availability.delete_many({"vehicle_id": vehicle_id})

    return jsonify({'message': 'Vehicle deleted successfully'}), 200
    
@vehicles_bp.route('/<string:vehicle_id>', methods=['GET'])
def get_single_vehicle(vehicle_id):
    vehicle = mongo.db.vehicles.find_one({"_id": ObjectId(vehicle_id), "status": "active"})
    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
        
    if vehicle.get('status') != 'active':
        return jsonify({"error": "Vehicle not currently available"}), 404

    vehicle['id'] = str(vehicle.pop('_id'))
    
    # Fetch owner details from users collection
    owner = mongo.db.users.find_one({"_id": ObjectId(vehicle['owner_id'])})
    if owner:
        vehicle['ownerInfo'] = {
            'firstName': owner.get('first_name'),
            'lastName': owner.get('last_name'),
            'rating': owner.get('owner_rating'),
            'memberSince': owner.get('created_at').strftime('%B %Y') if owner.get('created_at') else None
        }

    return jsonify(vehicle), 200