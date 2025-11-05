from flask import jsonify, current_app
from . import earnings_bp
from app.models.booking import Booking
from app.models.user import User
from datetime import datetime, timedelta
from sqlalchemy import func, extract
from app import db
# --- ADDED: Imports for authorization ---
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

# This route will get all earnings for a specific owner
@earnings_bp.route('/<int:owner_id>', methods=['GET'])
@jwt_required() # --- ADDED: Protect the route ---
def get_owner_earnings(owner_id):
    
    # --- ADDED: Authorization Check ---
    try:
        current_user_id_str = get_jwt_identity()
        current_user_id = int(current_user_id_str)
        jwt_claims = get_jwt()
        current_user_type = jwt_claims.get("user_type")
    except (ValueError, TypeError):
         current_app.logger.warning(f"Invalid token identity received for earnings route.")
         return jsonify({'error': 'Invalid token identity'}), 401

    if current_user_id != owner_id or current_user_type != 'owner':
        current_app.logger.warning(f"Unauthorized attempt to access earnings for owner {owner_id} by user {current_user_id}.")
        return jsonify({'error': 'Unauthorized access'}), 403
    # --- END: Authorization Check ---

    current_app.logger.info(f"--- Received earnings request for owner_id: {owner_id} ---")
    owner = User.query.get(owner_id)
    
    if not owner: # No need to check user_type, already verified by token
        current_app.logger.error(f"Authenticated owner {owner_id} not found in database.")
        return jsonify({'error': 'Owner not found'}), 404

    owner_vehicles = owner.vehicles
    if not owner_vehicles:
        current_app.logger.info(f"Owner {owner_id} has no vehicles. Returning zero earnings.")
        return jsonify({
            'total_earnings': 0,
            'availableBalance': 0,
            'thisMonthEarnings': 0,
            'lastMonthEarnings': 0,
            'thisWeekEarnings': 0,
            'pendingPayouts': 0,
            'totalTrips': 0,
            'averagePerTrip': 0,
            'commissionRate': 15, # Commission rate can be a default
            'nextPayoutDate': (datetime.utcnow() + timedelta(days=7)).strftime('%Y-%m-%d'),
            'transactions': [],
            'monthlyData': [],
            'weeklyData': [],
            'yearlyData': []
        })
        

    vehicle_ids = [vehicle.id for vehicle in owner_vehicles]
    current_app.logger.info(f"Owner {owner_id} vehicle IDs: {vehicle_ids}")

    bookings = Booking.query.filter(
        Booking.vehicle_id.in_(vehicle_ids),
        Booking.status == 'completed' # --- IMPORTANT: Only count completed bookings for earnings ---
    ).all()
    
    current_app.logger.info(f"Found {len(bookings)} completed bookings for owner {owner_id}.")

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
    
    # Use booking.created_at or booking.end_date? Let's use end_date for when payment is finalized.
    for booking in bookings:
        # Ensure booking.end_date is not None
        if not booking.end_date:
            continue
            
        earning = booking.total_price * (1 - platform_commission)
        total_earnings += earning
        
        if booking.end_date >= start_of_month:
            this_month_earnings += earning
        
        if start_of_last_month <= booking.end_date < start_of_month:
            last_month_earnings += earning
            
        if booking.end_date >= start_of_week:
            this_week_earnings += earning
            
        transactions.append({
            'booking_id': booking.id,
            'vehicle_name': booking.vehicle.name if booking.vehicle else 'Unknown Vehicle',
            'customer_id': booking.customer_id,
            'total_price': booking.total_price,
            'earning': round(earning, 2),
            'date': booking.end_date.strftime('%Y-%m-%d') # Use end_date
        })
        
    # --- DYNAMIC CHART DATA ---
    # Query completed bookings
    base_query = db.session.query(
        func.sum(Booking.total_price * (1 - platform_commission)).label('earnings'),
        func.count(Booking.id).label('trips')
    ).filter(
        Booking.vehicle_id.in_(vehicle_ids),
        Booking.status == 'completed'
    )
    
    # Monthly Data (last 6 months)
    monthly_data_query = base_query.filter(
        Booking.end_date >= (now - timedelta(days=180))
    ).group_by(
        extract('year', Booking.end_date),
        extract('month', Booking.end_date)
    ).order_by(
        extract('year', Booking.end_date),
        extract('month', Booking.end_date)
    )
    
    monthlyData = []
    for r in monthly_data_query.all():
        # Re-query to get year/month as SQLAlchemy 1.x func.sum() doesn't play nice with extract() in the same select
        date_q = db.session.query(
            extract('year', Booking.end_date), extract('month', Booking.end_date)
        ).filter(
            Booking.vehicle_id.in_(vehicle_ids),
            Booking.status == 'completed',
            Booking.end_date >= (now - timedelta(days=180)),
            func.sum(Booking.total_price * (1 - platform_commission)) == r.earnings
        ).first()
        
        if date_q:
            year, month = date_q
            monthlyData.append({
                'month': datetime(int(year), int(month), 1).strftime('%b %y'), 
                'earnings': round(float(r.earnings or 0), 2), 
                'trips': int(r.trips or 0)
            })

    # Weekly Data (last 8 weeks)
    weekly_data_query = base_query.filter(
        Booking.end_date >= (now - timedelta(weeks=8))
    ).group_by(
        extract('year', Booking.end_date),
        extract('week', Booking.end_date)
    ).order_by(
        extract('year', Booking.end_date),
        extract('week', Booking.end_date)
    )

    weeklyData = []
    for r in weekly_data_query.all():
        date_q = db.session.query(
            extract('year', Booking.end_date), extract('week', Booking.end_date)
        ).filter(
            Booking.vehicle_id.in_(vehicle_ids),
            Booking.status == 'completed',
            Booking.end_date >= (now - timedelta(weeks=8)),
            func.sum(Booking.total_price * (1 - platform_commission)) == r.earnings
        ).first()
        
        if date_q:
            year, week = date_q
            weeklyData.append({
                'week': f"W{int(week)} '{int(year) % 100}", 
                'earnings': round(float(r.earnings or 0), 2), 
                'trips': int(r.trips or 0)
            })

    # Yearly Data
    yearly_data_query = base_query.group_by(
        extract('year', Booking.end_date)
    ).order_by(
        extract('year', Booking.end_date)
    )
    
    yearlyData = []
    for r in yearly_data_query.all():
        date_q = db.session.query(
            extract('year', Booking.end_date)
        ).filter(
            Booking.vehicle_id.in_(vehicle_ids),
            Booking.status == 'completed',
            func.sum(Booking.total_price * (1 - platform_commission)) == r.earnings
        ).first()
        
        if date_q:
            year = date_q[0]
            yearlyData.append({
                'year': int(year), 
                'earnings': round(float(r.earnings or 0), 2), 
                'trips': int(r.trips or 0)
            })

    return jsonify({
        'total_earnings': round(total_earnings, 2),
        'availableBalance': round(total_earnings, 2),  # Placeholder: Needs real calculation
        'thisMonthEarnings': round(this_month_earnings, 2),
        'lastMonthEarnings': round(last_month_earnings, 2),
        'thisWeekEarnings': round(this_week_earnings, 2),
        'pendingPayouts': 0,  # Placeholder: Needs real calculation
        'totalTrips': len(transactions),
        'averagePerTrip': round(total_earnings / len(transactions) if transactions else 0, 2),
        'commissionRate': 15, # This can be static
        'nextPayoutDate': (now + timedelta(days=7)).strftime('%Y-%m-%d'),  # Placeholder
        'transactions': transactions,
        'monthlyData': monthlyData,
        'weeklyData': weeklyData,
        'yearlyData': yearlyData
    })
