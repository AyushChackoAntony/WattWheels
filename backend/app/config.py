import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv('MONGO_URI', "mongodb://localhost:27017/wattwheels")
    UPLOAD_FOLDER = 'static/uploads'
    JWT_SECRET_KEY = 'your-super-secret-key'