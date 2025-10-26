from flask import request, jsonify, current_app
from . import vehicles_bp
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.availability import Availability
from app import db
import os
from werkzeug.utils import secure_filename
from datetime import datetime

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
    owner_id = request.args.get('ownerId') # Check if request is owner-specific
    search_start_date_str = request.args.get('startDate') # For customer search
    search_end_date_str = request.args.get('endDate') # For customer search

    query = Vehicle.query

    if owner_id:
        # --- Owner View ---
        # Owner sees all their vehicles regardless of status/availability set by them
        query = query.filter_by(owner_id=owner_id)
        vehicles = query.all()
        current_app.logger.info(f"Returning {len(vehicles)} vehicles for owner {owner_id}")
    else:
        # --- Customer/Public View ---
        # Filter by vehicle status set by owner
        query = query.filter_by(status='active')

        # Further filter by Availability table for the requested dates (if provided)
        # If no dates provided, we might show all 'active' ones, or filter based on 'today'
        # For simplicity now, let's assume if dates are given, we filter precisely.
        # If no dates are given, we just show 'active' status vehicles.

        if search_start_date_str and search_end_date_str:
            try:
                search_start = datetime.strptime(search_start_date_str, '%Y-%m-%d')
                search_end = datetime.strptime(search_end_date_str, '%Y-%m-%d')

                # Find vehicles that are explicitly marked as UNAVAILABLE during ANY part of the search period
                unavailable_vehicle_ids = db.session.query(Availability.vehicle_id)\
                    .filter(
                        Availability.is_available == False,
                        Availability.start_date < search_end, # Unavailability starts before search ends
                        Availability.end_date > search_start  # Unavailability ends after search starts
                    ).distinct().all()
                unavailable_ids = [v_id[0] for v_id in unavailable_vehicle_ids]

                # Find vehicles that are ALREADY BOOKED during ANY part of the search period
                booked_vehicle_ids = db.session.query(Booking.vehicle_id)\
                    .filter(
                        # Add filter for relevant booking statuses if needed (e.g., 'confirmed', 'upcoming', 'active')
                        # Booking.status.in_(['confirmed', 'upcoming', 'active']),
                        Booking.start_date < search_end, # Booking starts before search ends
                        Booking.end_date > search_start  # Booking ends after search starts
                    ).distinct().all()
                booked_ids = [v_id[0] for v_id in booked_vehicle_ids]

                # Combine IDs to exclude
                exclude_ids = set(unavailable_ids + booked_ids)

                if exclude_ids:
                    query = query.filter(Vehicle.id.notin_(exclude_ids))

                # Optional: Add filter for vehicles that have *positive* availability set for the period
                # This depends on whether owners set available periods or just unavailable ones.
                # available_vehicle_ids = db.session.query(Availability.vehicle_id)\
                #     .filter(
                #         Availability.is_available == True,
                #         Availability.start_date <= search_start,
                #         Availability.end_date >= search_end
                #     ).distinct().all()
                # available_ids = [v_id[0] for v_id in available_vehicle_ids]
                # query = query.filter(Vehicle.id.in_(available_ids)) # Uncomment if using positive availability

            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        vehicles = query.all()
        current_app.logger.info(f"Returning {len(vehicles)} available vehicles for customer view.")

    # Convert to dictionary using the method defined in the model
    vehicles_data = [v.to_dict() for v in vehicles]
    return jsonify({"vehicles": vehicles_data})

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