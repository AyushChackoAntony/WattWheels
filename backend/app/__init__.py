from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # We will register our API blueprints here later
    from .api.auth.routes import auth_bp
    from .api.vehicles.routes import vehicles_bp
    from .api.bookings.routes import bookings_bp
    from .api.earnings.routes import earnings_bp
    from .api.availability.routes import availability_bp
    from . api.settings.routes import settings_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(vehicles_bp, url_prefix='/api/vehicles')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(earnings_bp, url_prefix='/api/earnings')
    app.register_blueprint(availability_bp, url_prefix='/api/availability')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    
    return app