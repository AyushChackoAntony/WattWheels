from flask import Blueprint, jsonify, request
from app import db
from app.models import Vehicle

main_bp = Blueprint('main', __name__)

@main_bp.route('/vehicles', methods=['GET'])
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([v.to_dict() for v in vehicles])

@main_bp.route('/vehicles', methods=['POST'])
def add_vehicle():
    data = request.get_json()
    vehicle = Vehicle(
        name=data['name'],
        brand=data['brand'],
        battery_capacity=data['battery_capacity']
    )
    db.session.add(vehicle)
    db.session.commit()
    return jsonify({"message": "Vehicle added successfully"}), 201