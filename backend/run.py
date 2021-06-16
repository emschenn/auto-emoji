# -*- coding: utf-8 -*

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
@cross_origin()
def index():
    return "hello"


@app.route('/predict', methods=['POST'])
@cross_origin()
def postPredict():
    insertValues = request.get_json()
    return jsonify({
        'emotionOption': ['🤣', '😘', '🧡', '🥳', '🎉'],
        'contentOption': [
            '🐶',
            '🦄',
            '🐼',
            '💩',
        ]
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
