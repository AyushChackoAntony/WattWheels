import math
from datetime import datetime

def calculate_dynamic_price(vehicle, start_date, end_date, mongo):
    """
    Calculates total price based on hourly duration and active pricing rules.
    """
    # 1. Basic Duration Math
    duration_seconds = (end_date - start_date).total_seconds()
    duration_hours = math.ceil(duration_seconds / 3600)
    
    # 2. Base Rate Fallback
    daily_rate = vehicle.get('price_per_day', 0)
    base_hourly_rate = vehicle.get('price_per_hour', round(daily_rate / 24, 2))
    
    # 3. Fetch Rules for this Vehicle
    rules = list(mongo.db.pricing_rules.find({"vehicle_id": str(vehicle['_id'])}))
    
    applied_multiplier = 1.0
    fixed_price = None

    for rule in rules:
        rule_applies = False
        
        # Weekend Rule (Sat=5, Sun=6)
        if rule['rule_type'] == 'weekend':
            if start_date.weekday() >= 5 or end_date.weekday() >= 5:
                rule_applies = True
        
        # Custom Range Rule (Holidays)
        elif rule['rule_type'] == 'custom_range':
            if rule['start_date'] <= start_date <= rule['end_date']:
                rule_applies = True

        if rule_applies:
            if rule['adjustment_type'] == 'multiplier':
                applied_multiplier = max(applied_multiplier, float(rule['value']))
            elif rule['adjustment_type'] == 'fixed':
                fixed_price = float(rule['value'])

    if fixed_price:
        return round(fixed_price, 2)
    
    return round(duration_hours * base_hourly_rate * applied_multiplier, 2)