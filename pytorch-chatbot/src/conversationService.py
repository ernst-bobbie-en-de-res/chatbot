from store import retrieve, upsert


def upsertConversation(conversation):
    return upsert('conversations', conversation)


def getConversations():
    return retrieve('conversations')
