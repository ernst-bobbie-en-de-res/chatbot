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

import sys

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
    n_clusters = request.args['nClusters']
    sentences = request.get_json()
    try:
        kmeans_utils = KMeansUtils(n_clusters=int(n_clusters))
        kmeans_utils.fit()
        prediction = kmeans_utils.predict(sentences)
        return jsonify(prediction.tolist())
    except Exception as e:
        return jsonify(success=False)


app.run(host='0.0.0.0')
