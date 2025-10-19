from flask import jsonify
from . import customer_bp
from app.models.user import User
from app.models.booking import Booking

@customer_bp.route('/<int:customer_id>/dashboard', methods=['GET'])
def get_customer_dashboard(customer_id):
    user = User.query.get(customer_id)
    if not user or user.user_type != 'customer':
        return jsonify({'error': 'Customer not found'}), 404

    recent_bookings = Booking.query.filter_by(customer_id=customer_id)\
                                   .order_by(Booking.created_at.desc())\
                                   .limit(5).all()

    total_rides = Booking.query.filter_by(customer_id=customer_id).count()
    total_spent = sum(b.total_price for b in Booking.query.filter_by(customer_id=customer_id, status='completed').all())
    co2_saved = total_rides * 3.75 

    dashboard_data = {
        'message': f"Dashboard data for {user.first_name}",
        'stats': {
            'totalRides': total_rides,
            'co2Saved': f"{co2_saved:.1f}kg",
            'totalSpent': f"₹{total_spent:,.0f}", 
            'rating': 4.8 
        },
        'recentBookings': [b.to_dict() for b in recent_bookings],
    }

    return jsonify(dashboard_data), 200