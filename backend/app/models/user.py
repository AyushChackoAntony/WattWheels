# backend/app/models/user.py
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    address = db.Column(db.Text, nullable=False)
    user_type = db.Column(db.String(20), nullable=False)
    owner_rating = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow) # Default is set
    bio = db.Column(db.Text, nullable=True)

    email_verified = db.Column(db.Boolean, default=False)
    phone_verified = db.Column(db.Boolean, default=False)
    identity_verified = db.Column(db.Boolean, default=False)

    settings = db.relationship('OwnerSettings', back_populates='owner', uselist=False, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_profile_data(self):
        # *** MODIFIED THIS LINE ***
        # Check if self.created_at exists AND is a datetime object before formatting
        join_date_str = self.created_at.strftime('%B %d, %Y') if self.created_at and isinstance(self.created_at, datetime) else 'N/A'
        # **************************

        # Determine overall 'verified' status based on owner requirements (e.g., ID verified)
        # You might want to adjust this logic depending on what 'verified' should mean for an owner
        is_verified = self.identity_verified # For now, let's base it on identity verification

        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'bio': self.bio or '', # Use getattr or provide default if bio can be None
            'joinDate': join_date_str, # Use the safely formatted string
            'verified': is_verified, # Use the determined overall status
            'emailVerified': self.email_verified,
            'phoneVerified': self.phone_verified,
            'identityVerified': self.identity_verified,
            'userType': self.user_type,
            'ownerRating': self.owner_rating if self.user_type == 'owner' else None
        }