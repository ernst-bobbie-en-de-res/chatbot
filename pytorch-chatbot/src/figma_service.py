import requests
import json
from store import save, retrieve


class FigmaService:
    def __init__(self):
        self.baseURI = 'https://api.figma.com'
        self.projectKey = 'dhgc7xaRDnyMMrNglu69bW'
        self.headers = {'X-Figma-Token': '140947-15117612-c0ab-4329-ba45-60f73442372f'}

    def get_svg(self, key):
        images = retrieve('images')
        return {'key': key, 'url': images[key]}

    def render_components(self):
        images = requests.get(url=self.baseURI + '/v1/images/' + self.projectKey,
                              params={'format': 'svg', 'ids': ','.join(list(self.get_components().keys()))},
                              headers=self.headers).json()['images']
        return save('images', images)

    def get_components(self):
        return requests.get(url=self.baseURI + '/v1/files/' + self.projectKey, headers=self.headers).json()[
            'components']
