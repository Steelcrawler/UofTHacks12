import pymongo
import bcrypt
from typing import Optional, List, Dict
from google.oauth2 import id_token
from google.auth.transport import requests
from google_auth_oauthlib.flow import InstalledAppFlow
from pathlib import Path
from dotenv import load_dotenv
import os
import datetime
import certifi
from bson.objectid import ObjectId

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

# Load MongoDB configuration from environment variables
MONGODB_CONNECTION_STRING = os.getenv('MONGODB_CONNECTION_STRING')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME')
GOOGLE_AUTH_CLIENT_ID = os.getenv('GOOGLE_AUTH_CLIENT_ID')
GOOGLE_AUTH_CLIENT_SECRET = os.getenv('GOOGLE_AUTH_CLIENT_SECRET')

class MongoDBInterface:
    def __init__(self):
        if not MONGODB_CONNECTION_STRING or not MONGODB_DB_NAME:
            raise ValueError("MongoDB connection string and database name must be set in .env file")
            
        # Use certifi for SSL certificate verification
        self.client = pymongo.MongoClient(
            MONGODB_CONNECTION_STRING,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000
        )
        
        # Test the connection
        try:
            self.client.server_info()
        except pymongo.errors.ServerSelectionTimeoutError as err:
            raise ConnectionError(f"Failed to connect to MongoDB: {err}")
            
        self.db = self.client[MONGODB_DB_NAME]
        
        # Set up collections
        self.login_info = self.db.login_info
        self.chat_history = self.db.chat_history
        
        # Drop existing indexes if they exist
        try:
            self.login_info.drop_index("username_1")
            self.chat_history.drop_index("email_1")
        except:
            pass
            
        # Create indexes with partial filter expressions to exclude null values
        self.login_info.create_index(
            [("username", pymongo.ASCENDING)],
            unique=True,
            partialFilterExpression={"username": {"$type": "string"}}
        )
        self.chat_history.create_index(
            [("email", pymongo.ASCENDING)],
            unique=True,
            partialFilterExpression={"email": {"$type": "string"}}
        )

    def create_user(self, username: str, password: str) -> bool:
        if not username or not isinstance(username, str):
            print("Username must be a non-empty string.")
            return False
            
        if self.login_info.find_one({"username": username}):
            print("Username already exists.")
            return False
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user in login_info
        self.login_info.insert_one({
            "username": username,
            "password": hashed_password,
            "loginTime": datetime.datetime.now()
        })
        
        # Initialize empty chat history for the user
        self.chat_history.insert_one({
            "email": username,
            "chats": {}  # Empty dict to store chat_id -> messages mapping
        })
        
        print("User created successfully.")
        return True

    def verify_user(self, username: str, password: str) -> bool:
        user = self.login_info.find_one({"username": username})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            print("Login successful.")
            return True
        print("Invalid username or password.")
        return False

    def change_password(self, username: str, new_password: str) -> bool:
        user = self.login_info.find_one({"username": username})
        if user:
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            self.login_info.update_one({"username": username}, {"$set": {"password": hashed_password}})
            print("Password updated successfully.")
            return True
        print("User not found.")
        return False

    def create_new_chat(self, email: str, chat_id: str) -> bool:
        """
        Create a new chat for a user with empty message list.
        """
        result = self.chat_history.update_one(
            {"email": email},
            {"$set": {f"chats.{chat_id}": []}}
        )
        return result.modified_count > 0

    def add_message_to_chat(self, email: str, chat_id: str, message: str) -> bool:
        """
        Add a message to a specific chat.
        """
        result = self.chat_history.update_one(
            {"email": email},
            {"$push": {f"chats.{chat_id}": message}}
        )
        return result.modified_count > 0

    def get_chat_messages(self, email: str, chat_id: str) -> List[str]:
        """
        Get all messages from a specific chat.
        """
        user_chats = self.chat_history.find_one({"email": email})
        if user_chats and "chats" in user_chats and chat_id in user_chats["chats"]:
            return user_chats["chats"][chat_id]
        return []

    def get_all_chats(self, email: str) -> Dict[str, List[str]]:
        """
        Get all chats for a user.
        """
        user_chats = self.chat_history.find_one({"email": email})
        if user_chats and "chats" in user_chats:
            return user_chats["chats"]
        return {}

    def delete_chat(self, email: str, chat_id: str) -> bool:
        """
        Delete a specific chat.
        """
        result = self.chat_history.update_one(
            {"email": email},
            {"$unset": {f"chats.{chat_id}": ""}}
        )
        return result.modified_count > 0

    def delete_user(self, username: str) -> bool:
        """
        Delete a user and all their chat history.
        """
        if not self.login_info.find_one({"username": username}):
            print("User not found.")
            return False
            
        # Delete user and their chat history
        self.login_info.delete_one({"username": username})
        self.chat_history.delete_one({"email": username})
        print("User and associated chat history deleted successfully.")
        return True

    def google_login(self, token: str) -> bool:
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_AUTH_CLIENT_ID)
            if 'email' in idinfo:
                email = idinfo['email']
                user = self.login_info.find_one({"username": email})
                if not user:
                    # Create user in login_info
                    self.login_info.insert_one({
                        "username": email,
                        "google_id": idinfo['sub']
                    })
                    # Initialize empty chat history
                    self.chat_history.insert_one({
                        "email": email,
                        "chats": {}
                    })
                    print("User created successfully with Google login.")
                print("Google login successful.")
                return True
        except ValueError:
            print("Invalid token.")
        return False

    def google_auth_flow(self):
        flow = InstalledAppFlow.from_client_config(
            {
                "web": {
                    "client_id": GOOGLE_AUTH_CLIENT_ID,
                    "client_secret": GOOGLE_AUTH_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": ["http://localhost:8000/"]
                }
            },
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email']
        )
        credentials = flow.run_local_server(port=8000)
        return credentials.token

if __name__ == "__main__":
    # Example usage
    try:
        mongo_interface = MongoDBInterface()
        
        # Create a new user
        email = "test@example.com"
        mongo_interface.create_user(email, "testpassword")
        
        # Create a new chat
        chat_id = "chat1"
        mongo_interface.create_new_chat(email, chat_id)
        
        # Add messages to the chat
        mongo_interface.add_message_to_chat(email, chat_id, "Hello!")
        mongo_interface.add_message_to_chat(email, chat_id, "How are you?")
        
        # Create another chat
        chat_id2 = "chat2"
        mongo_interface.create_new_chat(email, chat_id2)
        mongo_interface.add_message_to_chat(email, chat_id2, "Different chat")
        
        # Get messages from first chat
        messages = mongo_interface.get_chat_messages(email, chat_id)
        print(f"Messages from {chat_id}:", messages)
        
        # Get all chats
        all_chats = mongo_interface.get_all_chats(email)
        print("All chats:", all_chats)
        
        # Delete the first chat
        # mongo_interface.delete_chat(email, chat_id)
        
        # # Delete user and all their chats
        # mongo_interface.delete_user(email)
        
    except Exception as e:
        print(f"An error occurred: {e}")