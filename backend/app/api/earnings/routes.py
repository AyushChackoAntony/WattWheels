from flask import jsonify, current_app
from . import earnings_bp
from app.models.booking import Booking
from app.models.user import User
from app import mongo # Replace 'db' with 'mongo'
from datetime import datetime, timedelta
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@earnings_bp.route('/<string:owner_id>', methods=['GET']) # Changed int to string for MongoDB IDs
@jwt_required()
def get_owner_earnings(owner_id):
    
    # --- Authorization Check ---
    try:
        current_user_id = get_jwt_identity() # Identity is already a string in MongoDB setup
        jwt_claims = get_jwt()
        current_user_type = jwt_claims.get("user_type")
    except Exception:
         return jsonify({'error': 'Invalid token identity'}), 401

    if current_user_id != owner_id or current_user_type != 'owner':
        return jsonify({'error': 'Unauthorized access'}), 403

    # --- Fetch Owner Data ---
    owner = User.find_by_id(owner_id)
    if not owner:
        return jsonify({'error': 'Owner not found'}), 404

    # Fetch vehicle IDs for this owner
    owner_vehicles = list(mongo.db.vehicles.find({"owner_id": owner_id}))
    if not owner_vehicles:
        return jsonify({
            'total_earnings': 0,
            'availableBalance': 0,
            'thisMonthEarnings': 0,
            'lastMonthEarnings': 0,
            'thisWeekEarnings': 0,
            'pendingPayouts': 0,
            'totalTrips': 0,
            'averagePerTrip': 0,
            'commissionRate': 15,
            'nextPayoutDate': (datetime.utcnow() + timedelta(days=7)).strftime('%Y-%m-%d'),
            'transactions': [],
            'monthlyData': [],
            'weeklyData': [],
            'yearlyData': []
        })

    vehicle_ids = [str(v['_id']) for v in owner_vehicles]
    platform_commission = 0.15 
    now = datetime.utcnow()

    # --- Basic Stats Aggregation ---
    bookings = list(mongo.db.bookings.find({
        "vehicle_id": {"$in": vehicle_ids},
        "status": "completed"
    }))

    total_earnings = 0
    this_month_earnings = 0
    last_month_earnings = 0
    this_week_earnings = 0
    transactions = []

    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    start_of_last_month = (start_of_month - timedelta(days=1)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    start_of_week = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)

    for booking in bookings:
        # MongoDB stores dates as datetime objects automatically
        end_date = booking.get('end_date') or booking.get('created_at')
        if not end_date: continue
            
        earning = booking.get('total_price', 0) * (1 - platform_commission)
        total_earnings += earning
        
        if end_date >= start_of_month:
            this_month_earnings += earning
        elif start_of_last_month <= end_date < start_of_month:
            last_month_earnings += earning
            
        if end_date >= start_of_week:
            this_week_earnings += earning
            
        # Find vehicle name for transaction list
        v_name = "Unknown Vehicle"
        for v in owner_vehicles:
            if str(v['_id']) == booking.get('vehicle_id'):
                v_name = v.get('name')
                break

        transactions.append({
            'booking_id': str(booking['_id']),
            'vehicle_name': v_name,
            'customer_id': booking.get('customer_id'),
            'total_price': booking.get('total_price'),
            'earning': round(earning, 2),
            'date': end_date.strftime('%Y-%m-%d')
        })

    # --- Advanced Aggregation for Charts ---
    def get_chart_data(group_format, date_filter):
        pipeline = [
            {"$match": {
                "vehicle_id": {"$in": vehicle_ids},
                "status": "completed",
                "end_date": {"$gte": date_filter}
            }},
            {"$group": {
                "_id": {"$dateToString": {"format": group_format, "date": "$end_date"}},
                "earnings": {"$sum": {"$multiply": ["$total_price", 1 - platform_commission]}},
                "trips": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]
        return list(mongo.db.bookings.aggregate(pipeline))

    # Monthly Data (Last 6 Months)
    raw_monthly = get_chart_data("%Y-%m", now - timedelta(days=180))
    monthlyData = [{
        "month": datetime.strptime(r['_id'], "%Y-%m").strftime("%b %y"),
        "earnings": round(r['earnings'], 2),
        "trips": r['trips']
    } for r in raw_monthly]

    # Weekly Data (Last 8 Weeks)
    raw_weekly = get_chart_data("%U-%Y", now - timedelta(weeks=8))
    weeklyData = [{
        "week": f"W{r['_id'].split('-')[0]} '{r['_id'].split('-')[1][-2:]}",
        "earnings": round(r['earnings'], 2),
        "trips": r['trips']
    } for r in raw_weekly]

    # Yearly Data
    raw_yearly = get_chart_data("%Y", datetime(2000, 1, 1))
    yearlyData = [{
        "year": int(r['_id']),
        "earnings": round(r['earnings'], 2),
        "trips": r['trips']
    } for r in raw_yearly]

    return jsonify({
        'total_earnings': round(total_earnings, 2),
        'availableBalance': round(total_earnings, 2),
        'thisMonthEarnings': round(this_month_earnings, 2),
        'lastMonthEarnings': round(last_month_earnings, 2),
        'thisWeekEarnings': round(this_week_earnings, 2),
        'pendingPayouts': 0,
        'totalTrips': len(transactions),
        'averagePerTrip': round(total_earnings / len(transactions) if transactions else 0, 2),
        'commissionRate': 15,
        'nextPayoutDate': (now + timedelta(days=7)).strftime('%Y-%m-%d'),
        'transactions': transactions,
        'monthlyData': monthlyData,
        'weeklyData': weeklyData,
        'yearlyData': yearlyData
    })