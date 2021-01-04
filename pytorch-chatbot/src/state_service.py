from store import save, retrieve


class StateService:
    def get_state(self):
        return retrieve('state')

    def set_state(self, state):
        # filter out empty patterns
        for node in state['nodes']:
            for pattern in state['nodes'][node]['properties']['patterns'][:]:
                if not pattern:
                    state['nodes'][node]['properties']['patterns'].remove(pattern)
        return save('state', state)
