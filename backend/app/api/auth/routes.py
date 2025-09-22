from flask import request, jsonify
from . import auth_bp
from app.models.user import User
from app import db

@auth_bp.route('/signup/customer', methods=['POST'])
def customer_signup():
    data = request.get_json()

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

    # In a real app, you would return a JWT token here
    return jsonify({
        'message': 'Customer logged in successfully',
        'user': { 'id': user.id, 'firstName': user.first_name }
        })


@auth_bp.route('/login/owner', methods=['POST'])
def owner_login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], user_type='owner').first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    return jsonify({
        'message': 'Owner logged in successfully',
        'user': { 'id': user.id, 'firstName': user.first_name }
        })