import pymongo
import bcrypt
from typing import Optional
from google.oauth2 import id_token
from google.auth.transport import requests
from google_auth_oauthlib.flow import InstalledAppFlow
from pathlib import Path
from dotenv import load_dotenv
import os
import datetime
import certifi

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

# Load MongoDB configuration from environment variables
MONGODB_CONNECTION_STRING = os.getenv('MONGODB_CONNECTION_STRING')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME')
GOOGLE_AUTH_CLIENT_ID = os.getenv('GOOGLE_AUTH_CLIENT_ID')
GOOGLE_AUTH_CLIENT_SECRET = os.getenv('GOOGLE_AUTH_CLIENT_SECRET')

import re

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
        self.login_info = self.db.login_info

    def create_user(self, email: str, password: str) -> bool:
        # Validate email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            print("Invalid email format.")
            return False
        
        if self.login_info.find_one({"email": email}):
            print("Email already exists.")
            return False
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.login_info.insert_one({
            "email": email,
            "password": hashed_password,
            "loginTime": datetime.datetime.now()
        })
        print("User created successfully.")
        return True

    def verify_user(self, email: str, password: str) -> bool:
        user = self.login_info.find_one({"email": email})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            print("Login successful.")
            return True
        print("Invalid email or password.")
        return False

    def change_password(self, email: str, new_password: str) -> bool:
        user = self.login_info.find_one({"email": email})
        if user:
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            self.login_info.update_one({"email": email}, {"$set": {"password": hashed_password}})
            print("Password updated successfully.")
            return True
        print("User not found.")
        return False

    def google_login(self, token: str) -> bool:
        try:
            print(f"Received token: {token}")
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_AUTH_CLIENT_ID)
            print(f"ID Info: {idinfo}")
            if 'email' in idinfo:
                email = idinfo['email']
                user = self.login_info.find_one({"email": email})
                if not user:
                    self.login_info.insert_one({
                        "email": email,
                        "google_id": idinfo['sub'],
                        "loginTime": datetime.datetime.now()
                    })
                    print("User created successfully with Google login.")
                print("Google login successful.")
                return True
        except ValueError as e:
            print(f"Invalid token: {e}")
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
        print(f"Obtained credentials: {credentials}")
        id_token = credentials.id_token
        print(f"ID Token: {id_token}")
        return id_token

if __name__ == "__main__":
    # Example usage
    try:
        mongo_interface = MongoDBInterface()
        
        # Create a new user
        mongo_interface.create_user("testuser@example.com", "testpassword")
        
        # Verify user login
        mongo_interface.verify_user("testuser@example.com", "testpassword")
        
        # Change user password
        mongo_interface.change_password("testuser@example.com", "newpassword")
        
        # Verify user login with new password
        mongo_interface.verify_user("testuser@example.com", "newpassword")
        
        # Google login
        google_token = mongo_interface.google_auth_flow()
        mongo_interface.google_login(google_token)
    
    except Exception as e:
        print(f"An error occurred: {e}")