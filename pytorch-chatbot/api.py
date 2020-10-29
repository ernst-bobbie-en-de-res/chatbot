import flask
from flask import request, jsonify
from flask_cors import CORS
from chat import respond
from nodeService import getNodes, setNodes

app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['CORS_HEADERS'] = 'application/json'
CORS(app)


@app.route('/api/v1/message', methods=['GET'])
def message():
    if 'message' in request.args:
        message = request.args['message']
    else:
        return "Please specify a message!" 
    response = respond(message)
    return jsonify(response)

@app.route('/api/v1/nodes', methods=['GET', 'POST'])
def node():
    if request.method == 'GET':
        response = getNodes()
        return jsonify(response)
    elif request.method == 'POST':
        body = request.get_json()
        setNodes(body)
        response = getNodes()
        return jsonify(response)

app.run(host='0.0.0.0')