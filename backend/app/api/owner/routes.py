from flask import jsonify
from . import owner_bp
from app.models.user import User
from app import mongo # Replace 'db' with 'mongo'
from datetime import datetime
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@owner_bp.route('/<string:owner_id>/dashboard', methods=['GET']) # Changed int to string for MongoDB IDs
@jwt_required()
def get_owner_dashboard(owner_id):
    # JWT identity is already a string in our MongoDB setup
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
    # Find all vehicles belonging to this owner
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

    # --- Current/Upcoming Bookings (Limit for dashboard) ---
    upcoming_bookings = []
    if vehicle_ids:
        # MongoDB query for upcoming/active bookings that haven't ended
        bookings_cursor = mongo.db.bookings.find({
            "vehicle_id": {"$in": vehicle_ids},
            "status": {"$in": ['upcoming', 'active']},
            "end_date": {"$gte": now}
        }).sort("start_date", 1).limit(2)
        
        for b in bookings_cursor:
            b['id'] = str(b.pop('_id'))
            # Format dates for JSON
            b['start_date'] = b['start_date'].strftime('%Y-%m-%d %H:%M') if 'start_date' in b else None
            b['end_date'] = b['end_date'].strftime('%Y-%m-%d %H:%M') if 'end_date' in b else None
            upcoming_bookings.append(b)

    # --- Vehicle Management Summary (Limit for dashboard) ---
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
             'weeklyTrend': [], # Placeholder
        },
        'currentBookings': upcoming_bookings,
        'vehicleManagement': vehicle_summary
    }

    return jsonify(dashboard_data), 200