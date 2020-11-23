import json

def getNodes():
    return retrieve('nodes')


def setNodes(nodes):
    save('nodes', nodes)