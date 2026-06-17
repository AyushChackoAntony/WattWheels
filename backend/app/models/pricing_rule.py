from app import mongo
from bson import ObjectId
from datetime import datetime

class PricingRule:
    @staticmethod
    def to_dict(rule_data):
        """Transforms MongoDB document into a frontend-friendly dictionary."""
        if not rule_data:
            return None

        # Handle date formatting if the rule is date-specific
        start_date = rule_data.get('start_date')
        end_date = rule_data.get('end_date')

        return {
            'id': str(rule_data.get('_id')),
            'vehicleId': str(rule_data.get('vehicle_id')),
            'ownerId': str(rule_data.get('owner_id')),
            'ruleType': rule_data.get('rule_type'), # e.g., 'weekend', 'date_range'
            'adjustmentType': rule_data.get('adjustment_type'), # 'multiplier', 'fixed_price', 'flat_add'
            'value': float(rule_data.get('value', 0.0)),
            'startDate': start_date.strftime('%Y-%m-%d') if start_date else None,
            'endDate': end_date.strftime('%Y-%m-%d') if end_date else None,
            'isActive': rule_data.get('is_active', True),
            'createdAt': rule_data.get('created_at').strftime('%Y-%m-%d %H:%M:%S') if rule_data.get('created_at') else None
        }