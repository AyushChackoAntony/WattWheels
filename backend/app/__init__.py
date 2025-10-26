from flask import Flask, jsonify # <<< Add jsonify import
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from .config import Config
from flask_jwt_extended import JWTManager
# Optional: Import logging if using the basic logger setup below
import logging
from logging.handlers import RotatingFileHandler
import os


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager() # Your existing JWTManager instance

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app) # Initialize JWT

    # <<< START: Add JWT Error Handlers >>>
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        app.logger.warning("Expired JWT token received.") # Log specific error
        return jsonify(error="Token has expired"), 401 # Use 401 for expired

    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        app.logger.warning(f"Invalid JWT token received: {error_string}") # Log specific error
        # Common invalid reasons include signature verification failure
        return jsonify(error=f"Invalid token: {error_string}"), 422 # Keep 422 for invalid

    @jwt.unauthorized_loader
    def missing_token_callback(error_string):
        app.logger.warning(f"Unauthorized access attempt (missing token): {error_string}") # Log specific error
        # Usually means missing Authorization header
        return jsonify(error=f"Missing Authorization Header"), 401 # Use 401 for missing

    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        app.logger.warning("Non-fresh JWT token received when fresh required.") # Log specific error
        return jsonify(error="Fresh token required"), 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        app.logger.warning("Revoked JWT token received.") # Log specific error
        return jsonify(error="Token has been revoked"), 401
    # <<< END: Add JWT Error Handlers >>>

    # Allow requests from your frontend development server
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    # Import Blueprints (Keep these as they are)
    from .api.auth.routes import auth_bp
    from .api.vehicles.routes import vehicles_bp
    from .api.bookings.routes import bookings_bp
    from .api.earnings.routes import earnings_bp
    from .api.availability.routes import availability_bp
    from .api.settings.routes import settings_bp
    from .api.customer.routes import customer_bp
    from .api.owner.routes import owner_bp

    # Register Blueprints (Keep these as they are)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(vehicles_bp, url_prefix='/api/vehicles')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(earnings_bp, url_prefix='/api/earnings')
    app.register_blueprint(availability_bp, url_prefix='/api/availability')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(customer_bp, url_prefix='/api/customer')
    app.register_blueprint(owner_bp, url_prefix='/api/owner')

    # Add a basic logger configuration if not in debug mode
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/wattwheels.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info('WattWheels backend startup')

    return app