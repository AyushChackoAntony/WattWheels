from flask import request, jsonify
from . import auth_bp
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re

# --- Helper function for email validation ---
def is_valid_email(email):
    # A simple regex for email validation
    return re.match(r'[^@]+@[^@]+\.[^@]+', email)

@auth_bp.route('/signup/customer', methods=['POST'])
def customer_signup():
    data = request.get_json()

    # --- Enhanced Validation ---
    if not all(key in data for key in ['firstName', 'lastName', 'email', 'phone', 'password', 'address']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400

    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400

    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email address already in use'}), 409

    new_user = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        phone=data['phone'],
        address=data['address'],
        user_type='customer'
    )
    new_user.set_password(data['password']) # Use the method from the model

    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'New customer created successfully!'}), 201

@auth_bp.route('/signup/owner', methods=['POST'])
def owner_signup():
    data = request.get_json()

     # --- Enhanced Validation ---
    if not all(key in data for key in ['firstName', 'lastName', 'email', 'phone', 'password', 'address']):
        return jsonify({'error': 'Missing required fields'}), 400

    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400

    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email address already in use'}), 409

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


@auth_bp.route('/login/customer', methods=['POST'])
def customer_login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], user_type='customer').first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'message': 'Customer logged in successfully',
        'access_token': access_token,
        'user': { 'id': user.id, 'firstName': user.first_name }
        })


@auth_bp.route('/login/owner', methods=['POST'])
def owner_login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], user_type='owner').first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'message': 'Owner logged in successfully',
        'access_token': access_token,
        'user': { 'id': user.id, 'firstName': user.first_name }
        })
# --- NEW ROUTE FOR UPDATING USER PROFILE ---
@auth_bp.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user_profile(user_id):
    current_user = get_jwt_identity()
    if current_user['id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    
    # Update user fields
    user.first_name = data.get('firstName', user.first_name)
    user.last_name = data.get('lastName', user.last_name)
    user.email = data.get('email', user.email)
    user.phone = data.get('phone', user.phone)
    user.address = data.get('address', user.address)
    # Note: For security, password changes should have a separate, more secure endpoint.
    # We are not handling password changes here.

    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully',
        'user': {
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'email': user.email,
            'phone': user.phone,
            'address': user.address
        }
    }), 200
    
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "address": user.address,
        "user_type": user.user_type
    }), 200