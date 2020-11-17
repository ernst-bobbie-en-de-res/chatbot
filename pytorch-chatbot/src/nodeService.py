import json


def getNodes():
    with open('nodes.json', 'r') as f:
        return json.load(f)


def setNodes(nodes):
    with open('nodes.json', 'w') as f:
        json.dump(nodes, f)
