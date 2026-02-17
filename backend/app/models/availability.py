from app import mongo
from bson import ObjectId
from datetime import datetime

class Availability:
    @staticmethod
    def to_dict(availability_data):
        """
        Transforms a raw MongoDB availability document into a frontend-friendly dictionary.
        """
        if not availability_data:
            return None

        # Format dates (MongoDB stores them as datetime objects)
        start_date = availability_data.get('start_date')
        end_date = availability_data.get('end_date')

        return {
            'id': str(availability_data.get('_id')),
            'vehicle_id': str(availability_data.get('vehicle_id')), # Store as string for frontend
            'start_date': start_date.strftime('%Y-%m-%d') if isinstance(start_date, datetime) else start_date,
            'end_date': end_date.strftime('%Y-%m-%d') if isinstance(end_date, datetime) else end_date,
            'is_available': availability_data.get('is_available', True),
            'reason': availability_data.get('reason', '')
        }

    @staticmethod
    def create(data):
        """
        Helper method to insert an availability record into MongoDB.
        """
        # Ensure dates are stored as datetime objects for proper querying
        if isinstance(data.get('start_date'), str):
            data['start_date'] = datetime.strptime(data['start_date'], '%Y-%m-%d')
        if isinstance(data.get('end_date'), str):
            data['end_date'] = datetime.strptime(data['end_date'], '%Y-%m-%d')
            
        data['created_at'] = datetime.utcnow()
        result = mongo.db.availability.insert_one(data)
        return str(result.inserted_id)