from app import db

class OwnerSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    
    # Notification Settings
    email_notifications = db.Column(db.Boolean, default=True)
    sms_notifications = db.Column(db.Boolean, default=True)
    push_notifications = db.Column(db.Boolean, default=True)
    booking_confirmations = db.Column(db.Boolean, default=True)
    payment_notifications = db.Column(db.Boolean, default=True)
    maintenance_reminders = db.Column(db.Boolean, default=True)
    marketing_emails = db.Column(db.Boolean, default=False)
    weekly_reports = db.Column(db.Boolean, default=True)
    monthly_statements = db.Column(db.Boolean, default=True)
    security_alerts = db.Column(db.Boolean, default=True)
    
    # Payment Settings
    default_payment_method = db.Column(db.String(50), default='bank_transfer')
    auto_payouts = db.Column(db.Boolean, default=False)
    payout_threshold = db.Column(db.Integer, default=5000)
    payout_frequency = db.Column(db.String(50), default='weekly')
    tax_id = db.Column(db.String(50))
    gst_number = db.Column(db.String(50))
    
    # Vehicle Preferences
    auto_accept_bookings = db.Column(db.Boolean, default=False)
    minimum_booking_duration = db.Column(db.Integer, default=4) # in hours
    maximum_booking_duration = db.Column(db.Integer, default=168) # in hours
    buffer_time = db.Column(db.Integer, default=30) # in minutes
    
    owner = db.relationship('User', back_populates='settings')

    def to_dict(self):
        return {
            'notifications': {
                'emailNotifications': self.email_notifications,
                'smsNotifications': self.sms_notifications,
                'pushNotifications': self.push_notifications,
                'bookingConfirmations': self.booking_confirmations,
                'paymentNotifications': self.payment_notifications,
                'maintenanceReminders': self.maintenance_reminders,
                'marketingEmails': self.marketing_emails,
                'weeklyReports': self.weekly_reports,
                'monthlyStatements': self.monthly_statements,
                'securityAlerts': self.security_alerts,
            },
            'payment': {
                'defaultPaymentMethod': self.default_payment_method,
                'autoPayouts': self.auto_payouts,
                'payoutThreshold': self.payout_threshold,
                'payoutFrequency': self.payout_frequency,
                'taxId': self.tax_id,
                'gstNumber': self.gst_number,
            },
            'vehicles': {
                'autoAcceptBookings': self.auto_accept_bookings,
                'minimumBookingDuration': self.minimum_booking_duration,
                'maximumBookingDuration': self.maximum_booking_duration,
                'bufferTime': self.buffer_time,
            }
        }