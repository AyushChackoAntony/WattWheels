from flask import Blueprint

# Define the blueprint
messages_bp = Blueprint('messages', __name__)

# Import routes at the end to avoid circular imports
from app.api.messages import routes