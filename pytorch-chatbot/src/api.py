import flask
from flask import request, jsonify
from flask_cors import CORS
from chat import respond, load
from nodeService import getNodes, setNodes
from stateService import getState, setState
from feedbackService import getFeedback, setFeedback, addFeedback
from trainService import train
from figmaService import get_svg, get_components, render_components
from kmeans_utils import KMeansUtils
from conversationService import getConversations, upsertConversation
import os

app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['CORS_HEADERS'] = 'application/json'
CORS(app)

kmeans_utils = KMeansUtils(n_clusters=5, n_init=25)
kmeans_utils.fit()


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


@app.route('/images/<key>', methods=['GET'])
def get_image(key):
    return jsonify(get_svg(key))


@app.route('/images/components', methods=['GET'])
def get_image_components():
    return jsonify(get_components())


@app.route('/images/render', methods=['GET'])
def render_images():
    return jsonify(render_components())


@app.route('/categorize', methods=['GET'])
def categorize():
    try:
        sentences = request.get_json()
        prediction = kmeans_utils.predict(sentences)
        return jsonify(prediction.tolist())
    except Exception as e:
        return jsonify(success=False)


@app.route('/maps-api-key', methods=['GET'])
def maps_api_key():
    return jsonify(os.getenv('MAPS_API_KEY'))


@app.route('/conversations', methods=['GET', 'PUT'])
def conversations():
    if request.method == 'PUT':
        upsertConversation(request.get_json())
    return jsonify(getConversations())


app.run(host='0.0.0.0')