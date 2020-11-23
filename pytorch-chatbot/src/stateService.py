from store import save, retrieve

def getState():
    return retrieve('state')

def setState(state):
    return save('state', state)