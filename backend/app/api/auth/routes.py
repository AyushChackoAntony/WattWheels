from flask import request, jsonify, current_app
from . import auth_bp
from app.models.user import User
from app import mongo # Import mongo instead of db
import re
import traceback
from bson import ObjectId # Required for MongoDB ID lookups
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

def is_valid_email(email):
    return re.match(r'[^@]+@[^@]+\.[^@]+', email)

@auth_bp.route('/signup/customer', methods=['POST'])
def customer_signup():
    data = request.get_json()
    required_fields = ['firstName', 'lastName', 'email', 'phone', 'password', 'address']
    
    if not all(key in data for key in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
    
    # MongoDB check for existing user
    if User.find_by_email(data['email']):
        return jsonify({'error': 'Email address already in use'}), 409
    
    try:
        # Prepare data for MongoDB
        new_user_data = {
            'first_name': data['firstName'],
            'last_name': data['lastName'],
            'email': data['email'],
            'phone': data['phone'],
            'address': data['address'],
            'user_type': 'customer'
        }
        # The User.create method hashes the password and saves the document
        user_id = User.create({**new_user_data, 'password': data['password']})
        
        return jsonify({'message': 'New customer created successfully!', 'id': user_id}), 201
    except Exception as e:
        current_app.logger.error(f"Error creating customer: {e}", exc_info=True)
        return jsonify({'error': 'An internal error occurred'}), 500

@auth_bp.route('/signup/owner', methods=['POST'])
def owner_signup():
    data = request.get_json()
    required_fields = ['firstName', 'lastName', 'email', 'phone', 'password', 'address']
    
    if not all(key in data for key in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
    
    if User.find_by_email(data['email']):
        return jsonify({'error': 'Email address already in use'}), 409
    
    try:
        user_id = User.create({
            'first_name': data['firstName'],
            'last_name': data['lastName'],
            'email': data['email'],
            'phone': data['phone'],
            'address': data['address'],
            'user_type': 'owner',
            'password': data['password']
        })
        return jsonify({'message': 'New owner created successfully!', 'id': user_id}), 201
    except Exception as e:
        current_app.logger.error(f"Error creating owner: {e}", exc_info=True)
        return jsonify({'error': 'An internal error occurred'}), 500

@auth_bp.route('/login/customer', methods=['POST'])
def customer_login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.find_by_email(data['email'])
    
    if not user or not User.check_password(user['password_hash'], data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    if user.get('user_type') != 'customer':
        return jsonify({'error': 'Unauthorized user type'}), 403

    additional_claims = {"user_type": user['user_type']}
    # MongoDB _id must be converted to string for the JWT identity
    access_token = create_access_token(identity=str(user['_id']), additional_claims=additional_claims)
    
    return jsonify({
        'message': 'Customer logged in successfully',
        'access_token': access_token,
        'user': User.to_dict(user)
    })

@auth_bp.route('/login/owner', methods=['POST'])
def owner_login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.find_by_email(data['email'])
    
    if not user or not User.check_password(user['password_hash'], data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    if user.get('user_type') != 'owner':
        return jsonify({'error': 'Unauthorized user type'}), 403

    additional_claims = {"user_type": user['user_type']}
    access_token = create_access_token(identity=str(user['_id']), additional_claims=additional_claims)
    
    return jsonify({
        'message': 'Owner logged in successfully',
        'access_token': access_token,
        'user': User.to_dict(user)
    })

@auth_bp.route('/user/<string:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    current_user_id = get_jwt_identity()
    
    if current_user_id != user_id:
         return jsonify({'error': 'Unauthorized access'}), 403

    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        return jsonify(User.to_dict(user)), 200
    except Exception as e:
        current_app.logger.error(f"Error getting profile for user {user_id}", exc_info=True)
        return jsonify({'error': 'An internal error occurred'}), 500

@auth_bp.route('/user/<string:user_id>', methods=['PUT'])
@jwt_required()
def update_user_profile(user_id):
    current_user_id = get_jwt_identity()

    if current_user_id != user_id:
         return jsonify({'error': 'Unauthorized access'}), 403

    data = request.get_json()
    if not data:
         return jsonify({'error': 'Request must be JSON'}), 400

    try:
        # Find existing user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        update_fields = {
            'first_name': data.get('firstName', user.get('first_name')),
            'last_name': data.get('lastName', user.get('last_name')),
            'phone': data.get('phone', user.get('phone')),
            'address': data.get('address', user.get('address')),
            'bio': data.get('bio', user.get('bio'))
        }

        new_email = data.get('email')
        if new_email and new_email != user.get('email'):
             if User.find_by_email(new_email):
                 return jsonify({'error': 'Email address already in use'}), 409
             update_fields['email'] = new_email
             update_fields['email_verified'] = False

        # MongoDB Update
        mongo.db.users.update_one({'_id': ObjectId(user_id)}, {'$set': update_fields})
        
        updated_user = User.find_by_id(user_id)
        return jsonify({
            'message': 'Profile updated successfully',
            'user': User.to_dict(updated_user)
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error updating profile for user {user_id}: {e}", exc_info=True)
        return jsonify({'error': 'An internal error occurred'}), 500