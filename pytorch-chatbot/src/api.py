import flask
from flask import request, jsonify
from flask_cors import CORS
from chat import respond, load
from nodeService import getNodes, setNodes
from stateService import getState, setState
from feedbackService import getFeedback, setFeedback, addFeedback
from trainService import train
from figmaService import getSvg

app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['CORS_HEADERS'] = 'application/json'
CORS(app)


@app.route('/message', methods=['GET'])
def message():
    return jsonify(respond(request.args['message']))


@app.route('/nodes', methods=['GET', 'POST'])
def node():
    if request.method == 'POST':
        setNodes(request.get_json())
    return jsonify(getNodes())


@app.route('/state', methods=['GET', 'POST'])
def state():
    if request.method == 'POST':
        setState(request.get_json())
    return jsonify(getState())


@app.route('/train', methods=['GET'])
def train_bot():
    train()
    load()
    return jsonify(success=True)

@app.route('/feedback', methods=['GET', 'POST'])
def feedback():
    if request.method == 'POST':
        addFeedback(request.get_json())
    return jsonify(getFeedback())

@app.route('/svg', methods=['GET'])
def svg():
    return jsonify(getSvg())

app.run(host='0.0.0.0')