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
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    customer = db.relationship('User', backref=db.backref('bookings', lazy=True))
    vehicle = db.relationship('Vehicle', backref=db.backref('bookings', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'customerId': self.customer_id,
            'vehicleId': self.vehicle_id,
            'startDate': self.start_date.strftime('%Y-%m-%d'),
            'endDate': self.end_date.strftime('%Y-%m-%d'),
            'totalPrice': self.total_price,
            'status': self.status,
            'createdAt': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'customer': {
                'id': self.customer.id,
                'firstName': self.customer.first_name,
                'lastName': self.customer.last_name,
                'phone': self.customer.phone
            },
            'vehicle': {
                'id': self.vehicle.id,
                'name': self.vehicle.name,
                'image': self.vehicle.image_url,
                'location': self.vehicle.location
            }
        }