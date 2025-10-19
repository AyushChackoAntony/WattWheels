from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from .config import Config
from flask_jwt_extended import JWTManager 

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager() 

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app) 

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    from .api.auth.routes import auth_bp
    from .api.vehicles.routes import vehicles_bp
    from .api.bookings.routes import bookings_bp
    from .api.earnings.routes import earnings_bp
    from .api.availability.routes import availability_bp
    from .api.settings.routes import settings_bp 
    from .api.customer.routes import customer_bp 

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(vehicles_bp, url_prefix='/api/vehicles')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(earnings_bp, url_prefix='/api/earnings')
    app.register_blueprint(availability_bp, url_prefix='/api/availability')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(customer_bp, url_prefix='/api/customer')

    @app.route('/')
    def index():
        return "Welcome to the WattWheels Backend API!"

    return app