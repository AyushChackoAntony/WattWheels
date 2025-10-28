# backend/app/api/vehicles/routes.py
from flask import request, jsonify, current_app
from . import vehicles_bp
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.availability import Availability
# Import Booking model for conflict checking
from app.models.booking import Booking
from app import db
import os
from werkzeug.utils import secure_filename
from datetime import datetime

# --- add_vehicle, update_vehicle_status, delete_vehicle routes remain the same ---

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
            image_url=image_url
        )

        db.session.add(new_vehicle)
        db.session.commit()
        return jsonify({'message': 'Vehicle added successfully', 'vehicle': new_vehicle.to_dict()}), 201
    except ValueError:
        return jsonify({'error': 'Invalid data type for year or price. Please provide numbers.'}), 422
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding vehicle: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500


@vehicles_bp.route('/', methods=['GET'])
def get_all_vehicles():
    owner_id = request.args.get('ownerId')
    search_start_date_str = request.args.get('startDate') # Parameter from frontend
    search_end_date_str = request.args.get('endDate')     # Parameter from frontend

    query = Vehicle.query

    if owner_id:
        # --- Owner View ---
        query = query.filter_by(owner_id=owner_id)
        vehicles = query.all()
        current_app.logger.info(f"Returning {len(vehicles)} vehicles for owner {owner_id}")
    else:
        # --- Customer/Public View ---
        # Start by filtering only 'active' vehicles
        query = query.filter_by(status='active')

        # If specific dates are provided, perform availability checks
        if search_start_date_str and search_end_date_str:
            try:
                # Parse dates (ensure frontend sends YYYY-MM-DD format)
                search_start = datetime.strptime(search_start_date_str, '%Y-%m-%d').date()
                search_end = datetime.strptime(search_end_date_str, '%Y-%m-%d').date()

                # Find vehicles explicitly marked as UNAVAILABLE during ANY part of the search period
                unavailable_vehicle_ids_query = db.session.query(Availability.vehicle_id)\
                    .filter(
                        Availability.is_available == False,
                        # Overlap condition: Availability starts before search ends AND Availability ends after search starts
                        Availability.start_date.date() < search_end,
                        Availability.end_date.date() > search_start
                    ).distinct()

                # Find vehicles ALREADY BOOKED during ANY part of the search period
                booked_vehicle_ids_query = db.session.query(Booking.vehicle_id)\
                    .filter(
                        # Filter relevant booking statuses (adjust as needed)
                        Booking.status.in_(['upcoming', 'active', 'confirmed']),
                        # Overlap condition: Booking starts before search ends AND Booking ends after search starts
                        Booking.start_date.date() < search_end,
                        Booking.end_date.date() > search_start
                    ).distinct()

                # Combine the IDs to exclude using UNION
                exclude_ids_query = unavailable_vehicle_ids_query.union(booked_vehicle_ids_query)
                exclude_ids = [v_id[0] for v_id in exclude_ids_query.all()]

                # Filter the main query to exclude these vehicles
                if exclude_ids:
                    query = query.filter(Vehicle.id.notin_(exclude_ids))
                    current_app.logger.info(f"Excluding unavailable/booked vehicle IDs: {exclude_ids} for dates {search_start} to {search_end}")
                else:
                    current_app.logger.info(f"No unavailable/booked vehicles found for dates {search_start} to {search_end}")

            except ValueError:
                current_app.logger.warning(f"Invalid date format received: start='{search_start_date_str}', end='{search_end_date_str}'")
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        else:
            # If no dates are provided, just log that we're showing all active vehicles
             current_app.logger.info("No specific dates provided. Returning all 'active' vehicles.")


        vehicles = query.all()
        current_app.logger.info(f"Returning {len(vehicles)} available vehicles for customer view.")

    vehicles_data = [v.to_dict() for v in vehicles]
    return jsonify({"vehicles": vehicles_data})


@vehicles_bp.route('/<int:vehicle_id>', methods=['PATCH'])
def update_vehicle_status(vehicle_id):
    data = request.get_json()
    if not data:
         return jsonify({'error': 'Request must be JSON'}), 400
    # Ideally, get owner_id from JWT token for security
    owner_id = data.get('owner_id')
    if not owner_id:
         return jsonify({'error': 'owner_id is required for verification'}), 400

    vehicle = Vehicle.query.get(vehicle_id)
    # Verify ownership (convert owner_id from request to int for comparison)
    if not vehicle or vehicle.owner_id != int(owner_id):
        return jsonify({'error': 'Vehicle not found or you do not have permission to edit it'}), 404

    new_status = data.get('status')
    if new_status not in ['active', 'maintenance', 'inactive']:
        return jsonify({'error': 'Invalid status'}), 400

    vehicle.status = new_status
    try:
        db.session.commit()
        return jsonify({'message': 'Vehicle status updated successfully', 'vehicle': vehicle.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating status for vehicle {vehicle_id}: {e}", exc_info=True)
        return jsonify({'error': 'Failed to update status'}), 500


@vehicles_bp.route('/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    data = request.get_json()
    if not data:
         return jsonify({'error': 'Request must be JSON'}), 400
    # Ideally, get owner_id from JWT token for security
    owner_id = data.get('owner_id')
    if not owner_id:
         return jsonify({'error': 'owner_id is required for verification'}), 400

    vehicle = Vehicle.query.get(vehicle_id)
    # Verify ownership (convert owner_id from request to int for comparison)
    if not vehicle or vehicle.owner_id != int(owner_id):
        return jsonify({'error': 'Vehicle not found or you do not have permission to delete it'}), 404

    # Check for active/upcoming bookings before deleting (important!)
    active_booking = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status.in_(['upcoming', 'active', 'confirmed'])
    ).first()

    if active_booking:
        return jsonify({'error': 'Cannot delete vehicle with active or upcoming bookings'}), 400

    try:
        # Cascading delete should handle related availabilities if set up correctly
        db.session.delete(vehicle)
        db.session.commit()
        return jsonify({'message': 'Vehicle deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting vehicle {vehicle_id}: {e}", exc_info=True)
        return jsonify({'error': 'Failed to delete vehicle'}), 500