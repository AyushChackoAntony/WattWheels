from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object('config.Config')
    db.init_app(app)

    from app.routes.main import main_bp
    app.register_blueprint(main_bp)

    return app