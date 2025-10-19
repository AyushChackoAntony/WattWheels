from flask import request, jsonify
from . import auth_bp
from app.models.user import User
from app import db
import re

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
        print(f"Error creating customer: {e}")
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
        print(f"Error creating owner: {e}")
        return jsonify({'error': 'An internal error occurred'}), 500

@auth_bp.route('/login/customer', methods=['POST'])
def customer_login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing email or password'}), 400
    user = User.query.filter_by(email=data['email'], user_type='customer').first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    return jsonify({
        'message': 'Customer logged in successfully',
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
    return jsonify({
        'message': 'Owner logged in successfully',
        'user': {
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name
        }
    })

@auth_bp.route('/user/<int:user_id>', methods=['PUT'])
def update_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    if not data:
         return jsonify({'error': 'Request must be JSON'}), 400
    try:
        user.first_name = data.get('firstName', user.first_name)
        user.last_name = data.get('lastName', user.last_name)
        user.email = data.get('email', user.email)
        user.phone = data.get('phone', user.phone)
        user.address = data.get('address', user.address)
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
    except Exception as e:
        db.session.rollback()
        print(f"Error updating profile: {e}")
        return jsonify({'error': 'An internal error occurred'}), 500