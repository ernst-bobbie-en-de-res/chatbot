import json


def retrieve(name):
    with open(name + '.json', 'r') as f:
        return json.load(f)


def save(name, value):
    with open(name + '.json', 'w') as f:
        json.dump(value, f)


def append(name, value):
    list = retrieve(name)
    list.append(value)
    save(name, list)
