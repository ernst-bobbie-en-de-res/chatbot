import json

def getIntents():
    with open('intents.json', 'r') as f:
        return json.load(f)

def setIntents(intents):
    with open('intents.json', 'w') as f:
        json.dump(intents, f)