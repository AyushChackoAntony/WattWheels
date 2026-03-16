from app import mongo
from datetime import datetime, timedelta
from bson import ObjectId

class Vehicle:
    @staticmethod
    def find_by_id(vehicle_id):
        """Retrieve a single vehicle document by its ObjectId."""
        return mongo.db.vehicles.find_one({"_id": ObjectId(vehicle_id)})

    @staticmethod
    def to_dict(vehicle_data):
        """
        Transforms MongoDB document into a frontend-friendly dictionary.
        Includes dynamic calculation of monthly earnings and bookings.
        Updated for Phase 1: Hourly Rentals & Payments.
        """
        if not vehicle_data:
            return None

        vehicle_id_str = str(vehicle_data.get('_id'))
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)

        # --- MongoDB Aggregation for Monthly Stats ---
        pipeline = [
            {
                "$match": {
                    "vehicle_id": vehicle_id_str,
                    "status": "completed",
                    "created_at": {"$gte": thirty_days_ago}
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total_earnings": {"$sum": {"$multiply": ["$total_price", 0.85]}},
                    "booking_count": {"$sum": 1}
                }
            }
        ]
        
        stats_result = list(mongo.db.bookings.aggregate(pipeline))
        stats = stats_result[0] if stats_result else {"total_earnings": 0, "booking_count": 0}

        # Process features string into a list
        features_raw = vehicle_data.get('features', '')
        features_list = [f.strip() for f in features_raw.split(',') if f.strip()] if features_raw else []

        # --- Phase 1 Additions: Hourly Pricing Logic ---
        price_per_day = float(vehicle_data.get('price_per_day', 0.0))
        # Use existing price_per_hour or calculate a default (daily / 24)
        price_per_hour = float(vehicle_data.get('price_per_hour', round(price_per_day / 24, 2)))

        return {
            'id': vehicle_id_str,
            'ownerId': str(vehicle_data.get('owner_id')), # Ensure string for frontend
            'name': vehicle_data.get('name'),
            'type': vehicle_data.get('type'),
            'year': vehicle_data.get('year'),
            'color': vehicle_data.get('color'),
            'licensePlate': vehicle_data.get('license_plate'),
            'batteryRange': vehicle_data.get('battery_range'),
            'acceleration': vehicle_data.get('acceleration'),
            'pricePerDay': price_per_day,
            'pricePerHour': price_per_hour, # Added for Hourly Rentals
            'location': vehicle_data.get('location'),
            'status': vehicle_data.get('status', 'active'),
            'image': vehicle_data.get('image_url'),
            'features': features_list,
            'cancellationPolicy': vehicle_data.get('cancellation_policy', 'flexible'),
            'monthlyEarnings': round(stats.get('total_earnings', 0), 2),
            'monthlyBookings': stats.get('booking_count', 0),
            'rating': vehicle_data.get('rating', 4.5), 
            'availability': vehicle_data.get('availability', 80)
        }