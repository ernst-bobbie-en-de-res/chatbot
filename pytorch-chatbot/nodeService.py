import json

def getNodesByIds(nodeIds):
    with open('nodes.json', 'r') as f:
        nodes = json.load(f)
        matchedNodes = []
        for node in nodes['nodes']:
            if node['id'] in nodeIds:
                matchedNodes.append(node)
        return matchedNodes

def getAllNodes():
    with open('nodes.json', 'r') as f:
        nodes = json.load(f)
        return nodes['nodes']

def addNode(node):
    with open('nodes.json', 'w') as f:
        json.dump(node, f)