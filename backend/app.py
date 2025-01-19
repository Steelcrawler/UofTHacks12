from flask import Flask, request, jsonify, session
from flask_cors import CORS
from mongodb_interface import MongoDBInterface
from gcp.gcpchatbotintegrated import ChatSessionManager
from flask_session import Session
import os
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)  # Generate a random secret key
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

CORS(app, supports_credentials=True)
mongo_interface = MongoDBInterface()
session_manager = ChatSessionManager()

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

@app.route('/api/save_chat', methods=['POST'])
def save_chat():
    data = request.get_json()
    if not 'data' or 'userEmail' not in data  \
        or 'chatId' not in data or 'message1' not in data or 'message2' not in data:
        return jsonify({"error": "Invalid request. UserEmail/chatId/message1/message2 are all required."}), 400

    user_email = data['userEmail']
    chat_id = data['chatId']
    message1 = data['message1']
    message2 = data['message2']

    success1 = mongo_interface.add_message_to_chat(user_email, chat_id, message1)
    success2 = mongo_interface.add_message_to_chat(user_email, chat_id, message2)

    if success1 and success2:
        return jsonify({"message": "2 pieces of chat successfully saved"}), 200
    else:
        return jsonify({"error": "Chat not saved"}), 200

@app.route('/api/create_new_chat', methods=['POST'])
def create_new_chat():
    data = request.get_json()
    if not data or 'userEmail' not in data:
        return jsonify({"error": "Invalid request. User email is required."}), 400

    user_email = data['userEmail']

    # Generate a random chat ID
    chat_id = str(uuid.uuid4())

    # Create a new chat using the MongoDB interface
    success = mongo_interface.create_new_chat(user_email, chat_id)

    if success:
        return jsonify({
            "message": "New chat created successfully",
            "chatId": chat_id
        }), 201
    else:
        return jsonify({"error": "Failed to create new chat"}), 500
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

    bot_response = session_manager.send_message(submitted_text)
    print(bot_response)
    return jsonify({"message": "Submission successful", "receivedText": submitted_text, "bot_response": bot_response}), 200


if __name__ == '__main__':
    app.run(debug=True)
