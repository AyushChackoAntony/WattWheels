from app import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from bson import ObjectId

class User:
    @staticmethod
    def create(data):
        """Hash password and insert a new user document."""
        if 'password' in data:
            data['password_hash'] = generate_password_hash(data['password'], method='pbkdf2:sha256')
            del data['password']
        
        data['created_at'] = datetime.utcnow()
        # Default verification statuses
        data.setdefault('email_verified', False)
        data.setdefault('phone_verified', False)
        data.setdefault('identity_verified', False)
        
        result = mongo.db.users.insert_one(data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        """Retrieve a user by email."""
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def find_by_id(user_id):
        """Retrieve a user by their MongoDB ObjectId."""
        return mongo.db.users.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def check_password(password_hash, password):
        """Verify the hashed password."""
        return check_password_hash(password_hash, password)

    @staticmethod
    def to_dict(user_data):
        """Format MongoDB document for the frontend."""
        if not user_data:
            return None
            
        # Convert ObjectId and datetime for JSON compatibility
        user_data['id'] = str(user_data['_id'])
        join_date = user_data.get('created_at')
        user_data['joinDate'] = join_date.strftime('%B %d, %Y') if isinstance(join_date, datetime) else 'N/A'
        
        return {
            'id': user_data['id'],
            'firstName': user_data.get('first_name'),
            'lastName': user_data.get('last_name'),
            'email': user_data.get('email'),
            'userType': user_data.get('user_type'),
            'verified': user_data.get('identity_verified', False),
            'joinDate': user_data['joinDate']
        }