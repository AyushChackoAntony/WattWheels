from flask import jsonify
from . import earnings_bp
from app.models.booking import Booking
from app.models.user import User
from datetime import datetime, timedelta

# This route will get all earnings for a specific owner
@earnings_bp.route('/<int:owner_id>', methods=['GET'])
def get_owner_earnings(owner_id):
    print(f"--- Received request for owner_id: {owner_id} ---")
    # Find the owner
    owner = User.query.get(owner_id)
    print(f"--- Found user in database: {owner} ---")
    if not owner or owner.user_type != 'owner': # Correct line with one underscore
        return jsonify({'error': 'Owner not found'}), 404

    # Get all vehicles belonging to this owner
    owner_vehicles = owner.vehicles
    if not owner_vehicles:
        return jsonify({
            'total_earnings': 0,
            'transaction_count': 0,
            'transactions': []
        })

    vehicle_ids = [vehicle.id for vehicle in owner_vehicles]

    # Find all bookings for those vehicles
    bookings = Booking.query.filter(Booking.vehicle_id.in_(vehicle_ids)).all()

    total_earnings = 0
    this_month_earnings = 0
    last_month_earnings = 0
    this_week_earnings = 0
    transactions = []
    platform_commission = 0.15  # 15% commission
    
    now = datetime.utcnow()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    start_of_last_month = (start_of_month - timedelta(days=1)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    

    for booking in bookings:
        earning = booking.total_price * (1 - platform_commission)
        total_earnings += earning
        
        if booking.created_at >= start_of_month:
            this_month_earnings += earning
        
        if start_of_last_month <= booking.created_at < start_of_month:
            last_month_earnings += earning
            
        if booking.created_at >= start_of_week:
            this_week_earnings += earning
            
        transactions.append({
            'booking_id': booking.id,
            'vehicle_name': booking.vehicle.name,
            'customer_id': booking.customer_id,
            'total_price': booking.total_price,
            'earning': round(earning, 2),
            'date': booking.created_at.strftime('%Y-%m-%d')
        })

    return jsonify({
        'total_earnings': round(total_earnings, 2),
        'availableBalance': round(total_earnings, 2),  # Placeholder
        'thisMonthEarnings': round(this_month_earnings, 2),
        'lastMonthEarnings': round(last_month_earnings, 2),
        'thisWeekEarnings': round(this_week_earnings, 2),
        'pendingPayouts': 0,  # Placeholder
        'totalTrips': len(transactions),
        'averagePerTrip': round(total_earnings / len(transactions) if transactions else 0, 2),
        'commissionRate': 15,
        'nextPayoutDate': (now + timedelta(days=7)).strftime('%Y-%m-%d'),  # Placeholder
        'transactions': transactions,
        # Placeholder data for charts
        'monthlyData': [
            {"month": "Jan", "earnings": 12000, "trips": 15},
            {"month": "Feb", "earnings": 18000, "trips": 20},
            {"month": "Mar", "earnings": 15000, "trips": 18},
        ],
        'weeklyData': [
            {"week": "W1", "earnings": 3000, "trips": 5},
            {"week": "W2", "earnings": 4000, "trips": 7},
            {"week": "W3", "earnings": 3500, "trips": 6},
        ],
        'yearlyData': [
            {"year": "2023", "earnings": 150000, "trips": 200},
            {"year": "2024", "earnings": 200000, "trips": 250},
        ]
    })