from flask import Flask, jsonify
from flask_cors import CORS # Import CORS

app = Flask(__name__)
CORS(app)

# Dummy data for charging stations
stations = [
    {
        "id": 1,
        "name": "City Center Charging",
        "location": "123 Main St, Downtown",
        "available_ports": 3
    },
    {
        "id": 2,
        "name": "North Mall Supercharger",
        "location": "456 Oak Ave, Northside",
        "available_ports": 5
    }
]

@app.route("/")
def home():
    return "Welcome to the WattWheels Backend!"

# Create an API endpoint to get all stations
@app.route("/api/stations", methods=['GET'])
def get_stations():
    return jsonify(stations) # jsonify converts the Python list/dict to JSON format

if __name__ == "__main__":
    app.run(debug=True)