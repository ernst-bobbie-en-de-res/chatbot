from store import save, retrieve, append

def getFeedback():
    return retrieve('unanswered')

def addFeedback(feedback):
    return append('unanswered', feedback)


def setFeedback(unanswered):
    return save('unanswered', unanswered)
