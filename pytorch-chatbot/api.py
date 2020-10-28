import flask
from flask import request, jsonify
from flask_cors import CORS
from chat import respond
from nodeService import getNodesByIds, addNode

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
        if 'nodeId' in request.args:
            nodeId = int(request.args['nodeId'])
            response = getNodesByIds([nodeId])
        elif 'nodeIds' in request.args:
            castIdsArray = [int(numeric_string) for numeric_string in request.args.getlist('nodeIds')]
            response = getNodesByIds(castIdsArray)
        else:
            return "Please specify a nodeId!"
        return jsonify(response)
    elif request.method == 'POST':
        body = request.get_json()
        addNode(body)
        return jsonify(body)

app.run(host='0.0.0.0')