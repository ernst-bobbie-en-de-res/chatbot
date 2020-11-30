from store import save, retrieve


def getState():
    return retrieve('state')


def setState(state):
    # filter out empty patterns
    for node in state['nodes']:
        for pattern in state['nodes'][node]['properties']['patterns'][:]:
            if not pattern:
                state['nodes'][node]['properties']['patterns'].remove(pattern)

    return save('state', state)
