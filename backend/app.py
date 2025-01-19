from flask import Flask, request, jsonify
from flask_cors import CORS
from mongodb_interface import MongoDBInterface
from gcp.gcpchatbotintegrated import ChatSessionManager

app = Flask(__name__)
CORS(app)


# Initialize MongoDBInterface
mongo_interface = MongoDBInterface()
# session_manager = ChatSessionManager()

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Call create_user method to register the user
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    
    if mongo_interface.create_user(email, password):
        return jsonify({"message": "User created successfully"}), 200
    else:
        return jsonify({"message": "Email already exists or invalid email"}), 400


@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Call verify_user method to check credentials
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    if mongo_interface.verify_user(email, password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

@app.route('/')
def home():
    return "Hello, Flask!"
@app.route('/endpointj', methods=['POST'])
def handle_submission():
    data = request.get_json()

    if not data or 'submittedText' not in data:
        return jsonify({"error": "Invalid data"}), 400
    
    submitted_text = data['submittedText']
    
    print(f"Received text: {submitted_text}")
    # bot_response = session_manager.send_message(submitted_text)
    
    return jsonify({"message": "Submission successful", "receivedText": submitted_text}), 200

if __name__ == '__main__':
    app.run(debug=True)
