from flask import jsonify
from . import earnings_bp
from app.models.booking import Booking
from app.models.user import User
from datetime import datetime, timedelta
from sqlalchemy import func, extract
from app import db

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
        
    # --- DYNAMIC CHART DATA ---
    # Monthly Data (last 6 months)
    monthly_data = db.session.query(
        extract('year', Booking.created_at).label('year'),
        extract('month', Booking.created_at).label('month'),
        func.sum(Booking.total_price * (1 - platform_commission)).label('earnings'),
        func.count(Booking.id).label('trips')
    ).filter(
        Booking.vehicle_id.in_(vehicle_ids),
        Booking.created_at >= (now - timedelta(days=180))
    ).group_by('year', 'month').order_by('year', 'month').all()

    monthlyData = [{'month': datetime(r.year, r.month, 1).strftime('%b'), 'earnings': round(r.earnings, 2), 'trips': r.trips} for r in monthly_data]

    # Weekly Data (last 8 weeks)
    weekly_data = db.session.query(
        extract('year', Booking.created_at).label('year'),
        extract('week', Booking.created_at).label('week'),
        func.sum(Booking.total_price * (1 - platform_commission)).label('earnings'),
        func.count(Booking.id).label('trips')
    ).filter(
        Booking.vehicle_id.in_(vehicle_ids),
        Booking.created_at >= (now - timedelta(weeks=8))
    ).group_by('year', 'week').order_by('year', 'week').all()

    weeklyData = [{'week': f"W{r.week}", 'earnings': round(r.earnings, 2), 'trips': r.trips} for r in weekly_data]

    # Yearly Data
    yearly_data = db.session.query(
        extract('year', Booking.created_at).label('year'),
        func.sum(Booking.total_price * (1 - platform_commission)).label('earnings'),
        func.count(Booking.id).label('trips')
    ).filter(
        Booking.vehicle_id.in_(vehicle_ids)
    ).group_by('year').order_by('year').all()

    yearlyData = [{'year': r.year, 'earnings': round(r.earnings, 2), 'trips': r.trips} for r in yearly_data]



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
        'monthlyData': monthlyData,
        'weeklyData': weeklyData,
        'yearlyData': yearlyData
    })