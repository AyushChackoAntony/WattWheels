from flask import Blueprint

availability_bp = Blueprint('availability', __name__)

from . import routes