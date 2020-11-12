import requests
import numpy as np

baseURI = 'https://api.figma.com'
projectKey = 'dhgc7xaRDnyMMrNglu69bW'
headers = {'X-Figma-Token': '140947-15117612-c0ab-4329-ba45-60f73442372f'}

def getSvg():
    requestURL = baseURI + '/v1/images/' + projectKey
    params = {'ids': '3:5,5:32', 'format': 'svg'}

    # Get SVGs in JSON
    images = requests.get(url=requestURL, params=params, headers=headers).json()['images']

    # Convert dict to array
    imgArr = list(images.values())

    return imgArr