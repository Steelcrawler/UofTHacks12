from flask import Flask, request, jsonify, session, send_from_directory
from mongodb_interface import MongoDBInterface
from gcp.gcpchatbotintegrated import ChatSessionManager
import os

# Initialize Flask app
app = Flask(__name__, 
    static_folder='../frontend-new/build/static',
    template_folder='../frontend-new/build')


# Initialize interfaces
mongo_interface = MongoDBInterface()
session_manager = ChatSessionManager()

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.template_folder, 'index.html')

# API Routes
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

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

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    if mongo_interface.verify_user(email, password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

@app.route('/api/google-login', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({"message": "Token is required"}), 400

    if mongo_interface.google_login(token):
        return jsonify({"message": "Google login successful"}), 200
    else:
        return jsonify({"message": "Invalid token"}), 401

@app.route('/api/logout', methods=['POST'])
def logout_user():
    session.pop('user', None)
    return jsonify({"message": "Logout successful"}), 200

@app.route('/api/check_session', methods=['GET'])
def check_session():
    if 'user' in session:
        return jsonify({"logged_in": True, "user": session['user']}), 200
    else:
        return jsonify({"logged_in": False}), 200

@app.route('/api/chat', methods=['POST'])
def handle_submission():
    data = request.get_json()

    if not data or 'submittedText' not in data:
        return jsonify({"error": "Invalid data"}), 400

    submitted_text = data['submittedText']
    print(f"Received text: {submitted_text}")

    bot_response = session_manager.send_message(submitted_text)
    print(bot_response)
    return jsonify({
        "message": "Submission successful", 
        "receivedText": submitted_text, 
        "bot_response": bot_response
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
