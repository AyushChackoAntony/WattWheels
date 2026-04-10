from flask import request, jsonify, current_app
from . import owner_bp
from app.models.user import User
from app import mongo
from datetime import datetime, timezone
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@owner_bp.route('/<string:owner_id>/dashboard', methods=['GET'])
@jwt_required()
def get_owner_dashboard(owner_id):
    try:
        current_user_id = get_jwt_identity()
        jwt_claims = get_jwt()
        current_user_type = jwt_claims.get("user_type")
    except Exception:
         return jsonify({'error': 'Invalid user identity in token'}), 401

    # Authorization Check
    if current_user_id != owner_id or current_user_type != 'owner':
        return jsonify({'error': 'Unauthorized access'}), 403

    # Retrieve owner data from MongoDB using helper method
    owner = User.find_by_id(owner_id)
    if not owner:
        return jsonify({'error': 'Owner not found'}), 404

    # --- Fetch Vehicles ---
    owner_vehicles = list(mongo.db.vehicles.find({"owner_id": owner_id}))
    vehicle_ids = [str(v['_id']) for v in owner_vehicles]

    # --- Stats Data ---
    active_vehicles_count = sum(1 for v in owner_vehicles if v.get('status') == 'active')
    avg_rating = owner.get('owner_rating', 4.5)

    # Count unique customers who have booked this owner's vehicles
    customer_ids_count = 0
    if vehicle_ids:
        unique_customers = mongo.db.bookings.distinct("customer_id", {"vehicle_id": {"$in": vehicle_ids}})
        customer_ids_count = len(unique_customers)

    # --- Earnings Data (Monthly Summary) ---
    now = datetime.utcnow()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    platform_commission = 0.15
    this_month_earnings = 0

    if vehicle_ids:
        pipeline = [
            {"$match": {
                "vehicle_id": {"$in": vehicle_ids},
                "created_at": {"$gte": start_of_month},
                "status": "completed"
            }},
            {"$group": {
                "_id": None,
                "total": {"$sum": "$total_price"}
            }}
        ]
        earnings_result = list(mongo.db.bookings.aggregate(pipeline))
        if earnings_result:
            this_month_earnings = round(earnings_result[0]['total'] * (1 - platform_commission), 2)

    # --- Current/Upcoming Bookings ---
    upcoming_bookings = []
    if vehicle_ids:
        bookings_cursor = mongo.db.bookings.find({
            "vehicle_id": {"$in": vehicle_ids},
            "status": {"$in": ['upcoming', 'active', 'pending_payment', 'confirmed']}, # Added new statuses
            "end_date": {"$gte": now}
        }).sort("start_date", 1).limit(2)
        
        for b in bookings_cursor:
            b['id'] = str(b.pop('_id'))
            b['start_date'] = b['start_date'].strftime('%Y-%m-%d %H:%M') if 'start_date' in b else None
            b['end_date'] = b['end_date'].strftime('%Y-%m-%d %H:%M') if 'end_date' in b else None
            upcoming_bookings.append(b)

    # --- Phase 2: Pending Requests ---
    pending_requests = []
    if vehicle_ids:
        pending_cursor = mongo.db.bookings.find({
            "vehicle_id": {"$in": vehicle_ids},
            "status": "pending_approval",
            "end_date": {"$gte": now}
        }).sort("start_date", 1).limit(5) # Fetch up to 5 pending requests
        
        for b in pending_cursor:
            b['id'] = str(b.pop('_id'))
            b['start_date'] = b['start_date'].strftime('%Y-%m-%d %H:%M') if 'start_date' in b else None
            b['end_date'] = b['end_date'].strftime('%Y-%m-%d %H:%M') if 'end_date' in b else None
            
            # Optionally attach vehicle info for the UI
            vehicle_info = next((v for v in owner_vehicles if str(v['_id']) == b['vehicle_id']), None)
            if vehicle_info:
                b['vehicle_name'] = vehicle_info.get('name')
                
            pending_requests.append(b)

    # --- Vehicle Management Summary ---
    vehicle_summary = []
    for v in owner_vehicles[:2]:
        v['id'] = str(v.pop('_id'))
        vehicle_summary.append(v)

    # --- Prepare Response Data ---
    dashboard_data = {
        'stats': {
            'thisMonthEarnings': this_month_earnings,
            'activeVehicles': active_vehicles_count,
            'rating': avg_rating,
            'happyCustomers': customer_ids_count
        },
        'earningsOverview': {
             'thisMonth': this_month_earnings,
             'weeklyTrend': [], 
        },
        'currentBookings': upcoming_bookings,
        'pendingRequests': pending_requests, # Phase 2 Addition
        'vehicleManagement': vehicle_summary
    }

    return jsonify(dashboard_data), 200

# --- Phase 2: Owner Action Route ---
@owner_bp.route('/bookings/<string:booking_id>/respond', methods=['PATCH'])
@jwt_required()
def respond_to_booking(booking_id):
    current_user_id = get_jwt_identity()
    user_type = get_jwt().get("user_type")

    if user_type != 'owner':
        return jsonify({'error': 'Unauthorized access. Only owners can respond to bookings.'}), 403

    data = request.get_json()
    action = data.get('action') # 'approve' or 'reject'

    if action not in ['approve', 'reject']:
        return jsonify({'error': 'Invalid action. Must be "approve" or "reject".'}), 400

    booking = mongo.db.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    # Verify the owner actually owns this vehicle
    vehicle = mongo.db.vehicles.find_one({"_id": ObjectId(booking['vehicle_id'])})
    if not vehicle or str(vehicle['owner_id']) != current_user_id:
        return jsonify({'error': 'Unauthorized to modify this booking'}), 403

    if booking['status'] != 'pending_approval':
        return jsonify({'error': 'Booking is not pending approval'}), 400

    # If approved, change to pending_payment so customer can check out. 
    # If rejected, mark as rejected.
    new_status = 'pending_payment' if action == 'approve' else 'rejected'
    
    mongo.db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {
            "status": new_status,
            "updated_at": datetime.now(timezone.utc)
        }}
    )

    return jsonify({
        'message': f'Booking successfully {action}d',
        'new_status': new_status
    }), 
# --- Phase 3: Dynamic Pricing Rules Management ---

@owner_bp.route('/vehicles/<string:vehicle_id>/pricing-rules', methods=['GET'])
@jwt_required()
def get_pricing_rules(vehicle_id):
    current_user_id = get_jwt_identity()
    
    # Verify ownership
    vehicle = mongo.db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not vehicle or str(vehicle.get('owner_id')) != current_user_id:
        return jsonify({'error': 'Unauthorized access to vehicle rules'}), 403

    rules = list(mongo.db.pricing_rules.find({"vehicle_id": vehicle_id}))
    for r in rules:
        r['id'] = str(r.pop('_id'))
        if r.get('start_date'): r['start_date'] = r['start_date'].isoformat()
        if r.get('end_date'): r['end_date'] = r['end_date'].isoformat()
        
    return jsonify({"rules": rules}), 200

@owner_bp.route('/vehicles/<string:vehicle_id>/pricing-rules', methods=['POST'])
@jwt_required()
def add_pricing_rule(vehicle_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Verify ownership
    vehicle = mongo.db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not vehicle or str(vehicle.get('owner_id')) != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    try:
        new_rule = {
            "vehicle_id": vehicle_id,
            "rule_type": data.get('rule_type'), # 'weekend', 'holiday', 'custom_range'
            "adjustment_type": data.get('adjustment_type'), # 'multiplier' or 'fixed'
            "value": float(data.get('value')), # e.g., 1.2 for 20% increase
            "start_date": datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            "end_date": datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = mongo.db.pricing_rules.insert_one(new_rule)
        return jsonify({"message": "Pricing rule added", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@owner_bp.route('/pricing-rules/<string:rule_id>', methods=['DELETE'])
@jwt_required()
def delete_pricing_rule(rule_id):
    current_user_id = get_jwt_identity()
    
    rule = mongo.db.pricing_rules.find_one({"_id": ObjectId(rule_id)})
    if not rule or str(mongo.db.vehicles.find_one({"_id": ObjectId(rule['vehicle_id'])})['owner_id']) != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    mongo.db.pricing_rules.delete_one({"_id": ObjectId(rule_id)})
    return jsonify({"message": "Rule deleted"}), 200