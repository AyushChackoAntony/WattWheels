# backend/app/api/owner/__init__.py
from flask import Blueprint

owner_bp = Blueprint('owner', __name__)

from . import routes