import flask
from flask import request, jsonify
from flask_cors import CORS
from chat import respond, load
from node_service import NodeService
from state_service import StateService
from feedback_service import FeedbackService
from trainService import train
from figma_service import FigmaService
from conversation_service import ConversationService
import os

# initialize flask
app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['CORS_HEADERS'] = 'application/json'
CORS(app)

# initialize services
conversation_service = ConversationService()
figma_service = FigmaService()
node_service = NodeService()
state_service = StateService()
feedback_service = FeedbackService()

@app.route('/message', methods=['GET'])
def message():
    return jsonify(respond(request.args['message'], request.args['messageType']))


@app.route('/nodes', methods=['GET', 'POST'])
def node():
    if request.method == 'POST':
        node_service.set_nodes(request.get_json())
    return jsonify(node_service.get_nodes())


@app.route('/state', methods=['GET', 'POST'])
def state():
    if request.method == 'POST':
        state_service.set_state(request.get_json())
    return jsonify(state_service.get_state())


@app.route('/train', methods=['GET'])
def train_bot():
    train()
    load()
    return jsonify(success=True)


@app.route('/feedback', methods=['GET', 'POST'])
def feedback():
    if request.method == 'POST':
        feedback_service.add_feedback(request.get_json())
    return jsonify(feedback_service.get_feedback())


@app.route('/images/<key>', methods=['GET'])
def get_image(key):
    return jsonify(figma_service.get_svg(key))


@app.route('/images/components', methods=['GET'])
def get_image_components():
    return jsonify(figma_service.get_components())


@app.route('/images/render', methods=['GET'])
def render_images():
    return jsonify(figma_service.render_components())


@app.route('/maps-api-key', methods=['GET'])
def maps_api_key():
    return jsonify(os.getenv('MAPS_API_KEY'))


@app.route('/conversations', methods=['GET', 'PUT', 'POST'])
def conversations():
    if request.method == 'POST':
        return jsonify(conversation_service.new_conversation())
    if request.method == 'PUT':
        conversation_service.upsert_conversation(request.get_json())
    return jsonify(conversation_service.get_conversations())


app.run(host='0.0.0.0')
