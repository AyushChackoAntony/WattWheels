from app import mongo
from bson import ObjectId
from datetime import datetime

class Booking:
    @staticmethod
    def to_dict(booking_data):
        """
        Transforms a raw MongoDB booking document into a detailed dictionary.
        Performs manual lookups for related Vehicle, Owner, and Customer data.
        """
        if not booking_data:
            return None

        # Helper to convert MongoDB fields
        booking_id_str = str(booking_data.get('_id'))
        vehicle_id = booking_data.get('vehicle_id')
        customer_id = booking_data.get('customer_id')

        # --- Manual Lookups (Simulating SQL Relationships) ---
        vehicle_doc = mongo.db.vehicles.find_one({"_id": ObjectId(vehicle_id)}) if vehicle_id else None
        customer_doc = mongo.db.users.find_one({"_id": ObjectId(customer_id)}) if customer_id else None
        
        vehicle_data = None
        owner_data = None
        customer_data = None
        features_list = []
        cancellation_policy_text = "Standard Policy"

        if vehicle_doc:
            vehicle_data = {
                'id': str(vehicle_doc['_id']),
                'name': vehicle_doc.get('name'),
                'image': vehicle_doc.get('image_url'),
                'location': vehicle_doc.get('location'),
                'licensePlate': vehicle_doc.get('license_plate'),
                'batteryRange': vehicle_doc.get('battery_range'),
            }
            
            features_raw = vehicle_doc.get('features', '')
            if features_raw:
                features_list = [f.strip() for f in features_raw.split(',') if f.strip()]

            policy_map = {
                'flexible': 'Free cancellation up to 24 hours before pickup.',
                'moderate': 'Free cancellation up to 5 days, then 50% refund.',
                'strict': 'Free cancellation up to 7 days, then no refund.'
            }
            cancellation_policy_text = policy_map.get(vehicle_doc.get('cancellation_policy'), "Standard Policy")

            # Look up the Owner (who is also a User)
            owner_id = vehicle_doc.get('owner_id')
            owner_doc = mongo.db.users.find_one({"_id": ObjectId(owner_id)}) if owner_id else None
            if owner_doc:
                owner_data = {
                    'name': f"{owner_doc.get('first_name')} {owner_doc.get('last_name')}",
                    'phone': owner_doc.get('phone'),
                    'rating': owner_doc.get('owner_rating')
                }

        if customer_doc:
             customer_data = {
                 'id': str(customer_doc['_id']),
                 'firstName': customer_doc.get('first_name'),
                 'lastName': customer_doc.get('last_name'),
                 'phone': customer_doc.get('phone')
             }

        # Handle Date Formatting
        start_date = booking_data.get('start_date')
        end_date = booking_data.get('end_date')
        created_at = booking_data.get('created_at', datetime.utcnow())

        return {
            'id': booking_id_str,
            'customerId': customer_id,
            'vehicleId': vehicle_id,
            'pickupDate': start_date.strftime('%Y-%m-%d') if start_date else None,
            'dropoffDate': end_date.strftime('%Y-%m-%d') if end_date else None,
            'pickupTime': start_date.strftime('%I:%M %p') if start_date else None,
            'dropoffTime': end_date.strftime('%I:%M %p') if end_date else None,
            'totalPrice': booking_data.get('total_price'),
            'status': booking_data.get('status', 'upcoming'),
            'bookingDate': created_at.strftime('%Y-%m-%d'),
            'location': vehicle_data.get('location', "Unknown Location") if vehicle_data else "Unknown Location",
            'destination': booking_data.get('destination') or "Not Specified",
            'licensePlate': vehicle_data.get('licensePlate', "N/A") if vehicle_data else "N/A",
            'batteryRange': vehicle_data.get('batteryRange', "N/A") if vehicle_data else "N/A",
            'owner': owner_data.get('name', "Unknown Owner") if owner_data else "Unknown Owner",
            'ownerPhone': owner_data.get('phone', "N/A") if owner_data else "N/A",
            'ownerRating': owner_data.get('rating', None) if owner_data else None,
            'features': features_list,
            'cancellationPolicy': cancellation_policy_text,
            'vehicleName': vehicle_data.get('name', "Unknown Vehicle") if vehicle_data else "Unknown Vehicle",
            'vehicleImage': vehicle_data.get('image') if vehicle_data else None,
            'vehicle': vehicle_data,
            'customer': customer_data
        }