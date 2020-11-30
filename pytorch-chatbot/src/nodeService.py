from store import save, retrieve


def getNodes():
    return retrieve('nodes')


def setNodes(nodes):
    save('nodes', nodes)