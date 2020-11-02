import json

def getState():
    with open('state.json', 'r') as f:
        return json.load(f)

def setState(state):
    with open('state.json', 'w') as f:
        json.dump(state, f)