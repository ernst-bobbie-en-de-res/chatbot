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


def upsert(name, value):
    list = retrieve(name)
    if len(list) > 0:
        target = [item for item in list if item['id'] == value['id']]
        if len(target) == 0:
            append(name, value)
        else:
            for idx, item in enumerate(list):
                if item['id'] == value['id']:
                    list[idx] = value
            save(name, list)
    else:
        list = [value]
        save(name, list)
