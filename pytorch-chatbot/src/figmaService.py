import requests
import json
from store import save, retrieve

# Required global values
baseURI = 'https://api.figma.com'
projectKey = 'dhgc7xaRDnyMMrNglu69bW'
headers = {'X-Figma-Token': '140947-15117612-c0ab-4329-ba45-60f73442372f'}


def get_svg(key):
    images = retrieve('images')

    return {'key': key, 'url': json.load(images)[key]}


def render_components():
    images = requests.get(url=baseURI + '/v1/images/' + projectKey,
                          params={'format': 'svg', 'ids': ','.join(list(get_components().keys()))},
                          headers=headers).json()['images']

    return save('images', images)


def get_components():
    return requests.get(url=baseURI + '/v1/files/' + projectKey, headers=headers).json()['components']
