from app import db
import datetime

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='upcoming')
    destination = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    customer = db.relationship('User', backref=db.backref('bookings_as_customer', lazy=True))
    vehicle = db.relationship('Vehicle', backref=db.backref('bookings', lazy=True))

    def to_dict(self):
        vehicle_data = None
        owner_data = None
        customer_data = None
        features_list = []
        cancellation_policy_text = "Standard Policy"

        if self.vehicle:
            vehicle_data = {
                'id': self.vehicle.id,
                'name': self.vehicle.name,
                'image': self.vehicle.image_url,
                'location': self.vehicle.location,
                'licensePlate': self.vehicle.license_plate,
                'batteryRange': self.vehicle.battery_range,
            }
            if self.vehicle.features:
                features_list = [f.strip() for f in self.vehicle.features.split(',') if f.strip()]

            policy_map = {
                'flexible': 'Free cancellation up to 24 hours before pickup.',
                'moderate': 'Free cancellation up to 5 days, then 50% refund.',
                'strict': 'Free cancellation up to 7 days, then no refund.'
            }
            cancellation_policy_text = policy_map.get(self.vehicle.cancellation_policy, "Standard Policy")

            if self.vehicle.owner:
                owner_data = {
                    'name': f"{self.vehicle.owner.first_name} {self.vehicle.owner.last_name}",
                    'phone': self.vehicle.owner.phone,
                    'rating': self.vehicle.owner.owner_rating
                }

        if self.customer:
             customer_data = {
                 'id': self.customer.id,
                 'firstName': self.customer.first_name,
                 'lastName': self.customer.last_name,
                 'phone': self.customer.phone
             }

        return {
            'id': self.id,
            'customerId': self.customer_id,
            'vehicleId': self.vehicle_id,
            'pickupDate': self.start_date.strftime('%Y-%m-%d'),
            'dropoffDate': self.end_date.strftime('%Y-%m-%d'),
            'pickupTime': self.start_date.strftime('%I:%M %p'),
            'dropoffTime': self.end_date.strftime('%I:%M %p'),
            'totalPrice': self.total_price,
            'status': self.status,
            'bookingDate': self.created_at.strftime('%Y-%m-%d'),
            'location': vehicle_data.get('location', "Unknown Location") if vehicle_data else "Unknown Location",
            'destination': self.destination or "Not Specified",
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