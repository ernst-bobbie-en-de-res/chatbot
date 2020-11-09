import json

def getFeedback():
    with open('unanswered.json', 'r') as f:
        return json.load(f)

def setFeedback(unanswered):
    with open('unanswered.json', 'w') as f:
        json.dump(unanswered, f)