from flask import jsonify
from sqlalchemy import func, distinct # Import distinct
from . import owner_bp
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.booking import Booking
from app import db
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@owner_bp.route('/<int:owner_id>/dashboard', methods=['GET'])
@jwt_required()
def get_owner_dashboard(owner_id):
    # get_jwt_identity() now returns the ID (as a string from the token)
    # We need to convert it back to an integer for comparison if owner_id is an int
    try:
        current_user_id_str = get_jwt_identity()
        current_user_id = int(current_user_id_str)
    except (ValueError, TypeError):
         # Handle cases where identity might not be a valid integer string
         return jsonify({'error': 'Invalid user identity in token'}), 401

    # Get user_type from the additional claims
    jwt_claims = get_jwt()
    current_user_type = jwt_claims.get("user_type")

    # Compare the integer ID from the token with the integer owner_id from the URL
    # Also check the user_type from claims
    if current_user_id != owner_id or current_user_type != 'owner':
        return jsonify({'error': 'Unauthorized access'}), 403

    owner = User.query.get(owner_id)
    if not owner:
        return jsonify({'error': 'Owner not found'}), 404

    vehicles = owner.vehicles # Use the relationship to get vehicles
    vehicle_ids = [v.id for v in vehicles]

    # --- Stats Data ---
    active_vehicles_count = sum(1 for v in vehicles if v.status == 'active')
    # Use owner_rating from the user model if available, else default
    avg_rating = owner.owner_rating if owner.owner_rating else 4.5 # Example default

    # Count unique customers who have booked this owner's vehicles
    customer_ids_count = 0
    if vehicle_ids: # Only query if there are vehicles
        customer_ids_count = db.session.query(func.count(distinct(Booking.customer_id)))\
            .filter(Booking.vehicle_id.in_(vehicle_ids))\
            .scalar() or 0

    # --- Earnings Data (Monthly Summary) ---
    now = datetime.utcnow()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    platform_commission = 0.15 # Assuming 15%
    this_month_earnings = 0
    if vehicle_ids: # Only query if there are vehicles
        monthly_earnings_query = db.session.query(func.sum(Booking.total_price * (1 - platform_commission)))\
            .filter(
                Booking.vehicle_id.in_(vehicle_ids),
                Booking.created_at >= start_of_month,
                Booking.status == 'completed' # Ensure earnings are from completed bookings
            ).scalar()
        this_month_earnings = round(monthly_earnings_query or 0, 2)

    # --- Current/Upcoming Bookings (Limit for dashboard) ---
    upcoming_bookings = []
    if vehicle_ids: # Only query if there are vehicles
        upcoming_bookings = Booking.query.filter(
            Booking.vehicle_id.in_(vehicle_ids),
            Booking.status.in_(['upcoming', 'active']), # Fetch both upcoming and active
            Booking.end_date >= now # Only show bookings that haven't ended yet
        ).order_by(Booking.start_date.asc()).limit(2).all() # Limit to 2 for dashboard preview

    # --- Vehicle Management Summary (Limit for dashboard) ---
    # Use the already fetched 'vehicles' list
    vehicle_summary = [v.to_dict() for v in vehicles[:2]] # Show first 2 vehicles as preview

    # --- Prepare Response Data ---
    dashboard_data = {
        'stats': {
            'thisMonthEarnings': this_month_earnings,
            'activeVehicles': active_vehicles_count,
            'rating': avg_rating,
            'happyCustomers': customer_ids_count
        },
        'earningsOverview': { # Basic structure for Earning component
             'thisMonth': this_month_earnings,
             # You might need a more complex query for weekly trends
             'weeklyTrend': [], # Placeholder - populate if needed
        },
        'currentBookings': [b.to_dict() for b in upcoming_bookings],
        'vehicleManagement': vehicle_summary
    }

    return jsonify(dashboard_data), 200