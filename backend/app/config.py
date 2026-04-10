import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Use the MONGO_URI from .env, or a default local one
    MONGO_URI = os.getenv('MONGO_URI', "mongodb://localhost:27017/wattwheels_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False # No longer needed but safe to leave or remove
    UPLOAD_FOLDER = 'static/uploads'
    JWT_SECRET_KEY = 'your-super-secret-key'