import flask
from flask import request, jsonify
from flask_cors import CORS
from chat import respond
from nodeService import getNodes, setNodes
from intentService import getIntents, setIntents
from stateService import getState, setState
from trainService import train

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

@app.route('/api/v1/intents', methods=['GET', 'POST'])
def intent():
    if request.method == 'GET':
        response = getIntents()
        return jsonify(response)
    elif request.method == 'POST':
        body = request.get_json()
        setIntents(body)
        response = getIntents()
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

@app.route('/api/v1/state', methods=['GET', 'POST'])
def state():
    if request.method == 'GET':
        return jsonify(getState())
    elif request.method == 'POST':
        setState(request.get_json())
        return jsonify(getState())

@app.route('/api/v1/train', methods=['GET'])
def trainBot():
    try:
        train()
        return jsonify(success=True)
    except:
        return jsonify(success=False)

app.run(host='0.0.0.0')