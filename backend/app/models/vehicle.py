from app import db
from datetime import datetime, timedelta
from sqlalchemy import func, Text
from app.models.booking import Booking

class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(50), nullable=False)
    license_plate = db.Column(db.String(20), unique=True, nullable=False)
    battery_range = db.Column(db.String(50), nullable=True)
    acceleration = db.Column(db.String(50), nullable=True)
    price_per_day = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='active')
    image_url = db.Column(db.String(200), nullable=True)
    features = db.Column(Text, nullable=True)
    cancellation_policy = db.Column(db.String(50), default='flexible')

    owner = db.relationship('User', backref=db.backref('vehicles', lazy=True))

    def to_dict(self):
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)

        monthly_stats = db.session.query(
            func.sum(Booking.total_price * 0.85),
            func.count(Booking.id)
        ).filter(
            Booking.vehicle_id == self.id,
            Booking.created_at >= thirty_days_ago,
            Booking.status == 'completed'
        ).first()

        monthly_earnings = monthly_stats[0] if monthly_stats[0] is not None else 0
        monthly_bookings = monthly_stats[1] if monthly_stats[1] is not None else 0

        features_list = []
        if self.features:
             features_list = [f.strip() for f in self.features.split(',') if f.strip()]

        return {
            'id': self.id,
            'ownerId': self.owner_id,
            'name': self.name,
            'type': self.type,
            'year': self.year,
            'color': self.color,
            'licensePlate': self.license_plate,
            'batteryRange': self.battery_range,
            'acceleration': self.acceleration,
            'pricePerDay': self.price_per_day,
            'location': self.location,
            'status': self.status,
            'image': self.image_url,
            'features': features_list,
            'cancellationPolicy': self.cancellation_policy,
            'monthlyEarnings': round(monthly_earnings, 2),
            'monthlyBookings': monthly_bookings,
            'rating': 4.5,
            'availability': 80
        }