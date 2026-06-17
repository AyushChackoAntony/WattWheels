from app import mongo
from bson import ObjectId
from datetime import datetime

class Review:
    @staticmethod
    def to_dict(review_data):
        if not review_data:
            return None
        
        return {
            'id': str(review_data.get('_id')),
            'bookingId': str(review_data.get('booking_id')),
            'reviewerId': str(review_data.get('reviewer_id')),
            'revieweeId': str(review_data.get('reviewee_id')),
            'targetType': review_data.get('target_type'), # 'vehicle' or 'customer'
            'rating': review_data.get('rating'),
            'comment': review_data.get('comment'),
            'createdAt': review_data.get('created_at').isoformat() if review_data.get('created_at') else None
        }