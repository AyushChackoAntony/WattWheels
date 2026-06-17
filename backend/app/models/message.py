from app import mongo
from datetime import datetime

class Message:
    @staticmethod
    def to_dict(msg_data):
        if not msg_data:
            return None
        return {
            'id': str(msg_data.get('_id')),
            'bookingId': str(msg_data.get('booking_id')),
            'senderId': str(msg_data.get('sender_id')),
            'content': msg_data.get('content'),
            'timestamp': msg_data.get('timestamp').isoformat() if msg_data.get('timestamp') else None
        }