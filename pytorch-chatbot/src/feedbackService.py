import json
from store import save, retrieve, add

def getFeedback():
    return retrieve('unanswered')

def addFeedback(feedback):
    return add('unanswered', feedback)


def setFeedback(unanswered):
    return save('unanswered')
