from app import create_app

app = create_app()

# Add this new route
@app.route('/')
def index():
    return "Welcome to the WattWheels Backend API!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)