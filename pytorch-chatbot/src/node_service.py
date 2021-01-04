from store import save, retrieve


class NodeService:
    def get_nodes(self):
        return retrieve('nodes')

    def set_nodes(self, nodes):
        save('nodes', nodes)
