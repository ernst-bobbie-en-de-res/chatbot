import json

def getFeedback():
    with open('unanswered.json', 'r') as f:
        return json.load(f)

def addFeedback(feedback):
    with open('unanswered.json', 'r') as f:
        obj = json.load(f)
        obj.append(feedback);
        setFeedback(obj)

def setFeedback(unanswered):
    with open('unanswered.json', 'w') as f:
        json.dump(unanswered, f)