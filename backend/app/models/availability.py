from app import db
import datetime

class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    is_available = db.Column(db.Boolean, default=True, nullable=False)
    reason = db.Column(db.String(100)) # Optional reason for unavailability, e.g., "Maintenance"
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    vehicle = db.relationship('Vehicle', backref=db.backref('availabilities', lazy=True, cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            'id': self.id,
            'vehicle_id': self.vehicle_id,
            'start_date': self.start_date.strftime('%Y-%m-%d'),
            'end_date': self.end_date.strftime('%Y-%m-%d'),
            'is_available': self.is_available,
            'reason': self.reason
        }