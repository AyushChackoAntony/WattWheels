from flask import jsonify
from . import customer_bp
from app.models.user import User
from app import mongo
from bson import ObjectId

@customer_bp.route('/<string:customer_id>/dashboard', methods=['GET']) # Changed int to string for MongoDB IDs
def get_customer_dashboard(customer_id):
    # Retrieve user from MongoDB using helper method
    user = User.find_by_id(customer_id)
    if not user or user.get('user_type') != 'customer':
        return jsonify({'error': 'Customer not found'}), 404

    # Fetch recent bookings using MongoDB find with sort and limit
    recent_bookings_cursor = mongo.db.bookings.find({"customer_id": customer_id})\
                                              .sort("created_at", -1)\
                                              .limit(5)
    recent_bookings = list(recent_bookings_cursor)

    # Count total rides
    total_rides = mongo.db.bookings.count_documents({"customer_id": customer_id})

    # Calculate total spent on completed bookings
    completed_bookings = mongo.db.bookings.find({
        "customer_id": customer_id, 
        "status": 'completed'
    })
    total_spent = sum(b.get('total_price', 0) for b in completed_bookings)

    co2_saved = total_rides * 3.75 

    # Prepare response data, converting MongoDB types to JSON-friendly formats
    dashboard_data = {
        'message': f"Dashboard data for {user.get('first_name')}",
        'stats': {
            'totalRides': total_rides,
            'co2Saved': f"{co2_saved:.1f}kg",
            'totalSpent': f"₹{total_spent:,.0f}", 
            'rating': 4.8 
        },
        'recentBookings': []
    }

    # Manually serialize the recent bookings list
    for b in recent_bookings:
        b['id'] = str(b.pop('_id')) # Convert ObjectId to string
        # Ensure dates are converted to strings if necessary
        if 'created_at' in b and hasattr(b['created_at'], 'isoformat'):
            b['created_at'] = b['created_at'].isoformat()
        dashboard_data['recentBookings'].append(b)

    return jsonify(dashboard_data), 200