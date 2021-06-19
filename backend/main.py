# -*- coding: utf-8 -*

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from content_based import ContentBased

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
content_based = ContentBased()


@app.route('/')
@cross_origin()
def index():
    return "This is the backend of auto-emoji project 😉"


@app.route('/predict', methods=['POST'])
@cross_origin()
def postPredict():
    insert_values = request.get_json()["input"][:-1]
    print(insert_values)
    content_option = content_based.predict(insert_values, K=5)
    return jsonify({
        'emotionOption': ['😉',	'👌', '😁', '💪', '😃'],
        'contentOption': content_option,
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
#     app.run(host='0.0.0.0', port=3000, debug=True, use_reloader=False)
