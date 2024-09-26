# flask_app.py

from flask import Flask, request, jsonify
from nlp_processor import get_response

app = Flask(__name__)

@app.route('/process_message', methods=['POST'])
def process_message():
    data = request.get_json()
    message = data.get('message', '')
    response = get_response(message)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(port=5001)