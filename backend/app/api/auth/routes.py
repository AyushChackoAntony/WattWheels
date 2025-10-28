# backend/app/api/auth/routes.py
from flask import request, jsonify, current_app # Added current_app for potential logging
from . import auth_bp
from app.models.user import User
from app import db
import re
import traceback
from datetime import datetime
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt # Added get_jwt

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
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email address already in use'}), 409
    try:
        new_user = User(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            phone=data['phone'],
            address=data['address'],
            user_type='customer'
        )
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'New customer created successfully!'}), 201
    except Exception as e:
        db.session.rollback()
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
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email address already in use'}), 409
    try:
        new_user = User(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            phone=data['phone'],
            address=data['address'],
            user_type='owner'
        )
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'New owner created successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating owner: {e}", exc_info=True)
        return jsonify({'error': 'An internal error occurred'}), 500

@auth_bp.route('/login/customer', methods=['POST'])
def customer_login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing email or password'}), 400
    user = User.query.filter_by(email=data['email'], user_type='customer').first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    additional_claims = {"user_type": user.user_type}
    access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
    return jsonify({
        'message': 'Customer logged in successfully',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name
        }
    })

@auth_bp.route('/login/owner', methods=['POST'])
def owner_login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing email or password'}), 400
    user = User.query.filter_by(email=data['email'], user_type='owner').first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    additional_claims = {"user_type": user.user_type}
    access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
    return jsonify({
        'message': 'Owner logged in successfully',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name
        }
    })

@auth_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    current_user_identity_str = get_jwt_identity()
    jwt_claims = get_jwt()
    current_user_type = jwt_claims.get("user_type")

    try:
        current_user_id = int(current_user_identity_str)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid user identity in token'}), 401

    if current_user_id != user_id:
         return jsonify({'error': 'Unauthorized access'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        # Check if get_profile_data exists before calling
        if hasattr(user, 'get_profile_data'):
             profile_data = user.get_profile_data()
             return jsonify(profile_data), 200
        else:
             # Fallback or simplified data if method doesn't exist
             current_app.logger.error(f"User model missing get_profile_data method for user {user_id}")
             # Return basic info as a fallback
             return jsonify({
                 'id': user.id,
                 'firstName': user.first_name,
                 'lastName': user.last_name,
                 'email': user.email,
                 # Add other known safe fields if necessary
             }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting profile for user {user_id}", exc_info=True)
        traceback.print_exc()
        return jsonify({'error': 'An internal error occurred while processing profile data'}), 500


@auth_bp.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user_profile(user_id):
    current_user_identity_str = get_jwt_identity()
    jwt_claims = get_jwt()
    current_user_type = jwt_claims.get("user_type")

    try:
        current_user_id = int(current_user_identity_str)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid user identity in token'}), 401

    if current_user_id != user_id:
         return jsonify({'error': 'Unauthorized access'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if not data:
         return jsonify({'error': 'Request must be JSON'}), 400

    try:
        user.first_name = data.get('firstName', user.first_name)
        user.last_name = data.get('lastName', user.last_name)

        new_email = data.get('email')
        if new_email and new_email != user.email:
             # Check if the new email is already taken by another user
             existing_user = User.query.filter(User.email == new_email, User.id != user_id).first()
             if existing_user:
                 return jsonify({'error': 'Email address already in use by another account'}), 409
             user.email = new_email
             user.email_verified = False # Require re-verification if email changes

        user.phone = data.get('phone', user.phone)
        user.address = data.get('address', user.address)
        user.bio = data.get('bio', user.bio)

        db.session.commit()

        # Check again if get_profile_data exists before calling
        if hasattr(user, 'get_profile_data'):
            updated_profile_data = user.get_profile_data()
        else:
            # Fallback data if method is missing
            updated_profile_data = {
                 'id': user.id,
                 'firstName': user.first_name,
                 'lastName': user.last_name,
                 'email': user.email,
             }

        return jsonify({
            'message': 'Profile updated successfully',
            'user': updated_profile_data
        }), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating profile for user {user_id}: {e}", exc_info=True)
        traceback.print_exc()
        return jsonify({'error': 'An internal error occurred during profile update'}), 500