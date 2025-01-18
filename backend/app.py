from flask import Flask
from flask_cors import CORS
from datetime import datetime
from typing import Dict, List, Optional

app = Flask(__name__)
CORS(app)

# Update Depending on logic of storing conversations 
conversation_store: Dict[str, List[Dict[str, str]]] = {}

# Helper functions section
def format_conversation_history(history: List[Dict[str, str]]) -> str:
    """
    Formats the conversation history into a string that can be used as context.
    This will be useful when you implement the RAG model to maintain conversation context.
    
    Args:
        history: List of conversation turns with 'role' and 'content'
        
    Returns:
        A formatted string containing the conversation history
    """
    formatted_history = []
    for message in history:
        role = message['role'].capitalize()
        content = message['content']
        formatted_history.append(f"{role}: {content}")
    return "\n".join(formatted_history)

def log_interaction(conversation_id: str, message: str, response: str):
    """
    Logs interactions for debugging and development purposes.
    During hackathon development, seeing these logs can help debug issues quickly.
    
    Args:
        conversation_id: Unique identifier for the conversation
        message: User's input message
        response: System's response
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n=== Interaction Log [{timestamp}] ===")
    print(f"Conversation ID: {conversation_id}")
    print(f"User Message: {message}")
    print(f"System Response: {response}")
    print("=" * 50)

# Main chat endpoint
@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Main endpoint for the chat functionality.
    
    Expected request format:
    {
        "message": "user's message",
        "conversation_id": "optional_id"
    }
    
    Returns:
        JSON response containing the chatbot's reply
    """
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        conversation_id = data.get('conversation_id', str(datetime.now().timestamp()))

        if not user_message:
            return jsonify({
                'status': 'error',
                'message': 'Message cannot be empty'
            }), 400

        # Get or initialize conversation history
        history = conversation_store.get(conversation_id, [])
        
        # Add user message to history
        history.append({
            'role': 'user',
            'content': user_message
        })

        # TODO: This is where you'll integrate your RAG model
        # For now, we'll return a placeholder response
        bot_response = "This is a placeholder response. RAG model integration pending."

        # Add bot response to history
        history.append({
            'role': 'assistant',
            'content': bot_response
        })

        # Update conversation store
        conversation_store[conversation_id] = history

        # Log the interaction
        log_interaction(conversation_id, user_message, bot_response)

        return jsonify({
            'status': 'success',
            'response': bot_response,
            'conversation_id': conversation_id
        })

    except Exception as e:
        print(f"Error processing request: {str(e)}")  # Helpful during development
        return jsonify({
            'status': 'error',
            'message': 'Failed to process request',
            'debug': str(e)  # Include debug info during development
        }), 500

# Development helper endpoint
@app.route('/api/debug/conversation/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    """
    Debugging endpoint to view conversation history.
    Very useful during development to verify conversation state.
    
    Args:
        conversation_id: ID of the conversation to retrieve
        
    Returns:
        JSON containing the conversation history
    """
    history = conversation_store.get(conversation_id, [])
    return jsonify({
        'conversation_id': conversation_id,
        'history': history
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)
