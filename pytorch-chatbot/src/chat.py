import json

import torch
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load():
    global all_words, ids, model, nodes
    with open('nodes.json', 'r') as json_data:
        nodes = json.load(json_data)

    data = torch.load("data.pth")

    all_words = data['all_words']
    ids = data['ids']

    model = NeuralNet(data["input_size"],  data["hidden_size"], data["output_size"]).to(device)
    model.load_state_dict(data["model_state"])
    model.eval()

def respond(input_value):
    global all_words, ids, model, nodes

    input_value = tokenize(input_value)
    X = bag_of_words(input_value, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    id = ids[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        matched_nodes = []
        for node in nodes:
            if id == node['id']:
                matched_nodes.append(node)
        return matched_nodes
    else:
        response = dict()
        response['text'] = "Ik begrijp niet wat ik moet doen.. :("
        return [response]

load()