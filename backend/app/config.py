import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    # Replace the old SQLALCHEMY_DATABASE_URI with this:
    MONGO_URI = os.getenv('MONGO_URI', "mongodb://localhost:27017/wattwheels")
    UPLOAD_FOLDER = 'static/uploads'
    JWT_SECRET_KEY = 'your-super-secret-key'

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:' # Use an in-memory SQLite database for tests
    JWT_SECRET_KEY = 'test-secret-key'