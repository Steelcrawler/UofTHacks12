from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
    
    return jsonify({"message": "Submission successful", "receivedText": submitted_text}), 200

if __name__ == '__main__':
    app.run(debug=True)
