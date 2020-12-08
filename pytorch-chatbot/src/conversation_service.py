from store import retrieve, upsert


class ConversationService:
    def __init__(self):
        self.fileName = 'conversations'

    '''
        Updates the context of the given conversation.
        If the given conversation exists it will be updated.
        If the given conversation doesn't exist it will be saved.
    '''
    def upsertConversation(self, conversation):
        self.updateContext(conversation)
        return upsert(self.fileName, conversation)

    '''
        Gets all conversations.
    '''
    def getConversations(self):
        return retrieve(self.fileName)

    '''
        Scans the messages in the conversation in order to update the conversational context. 
        A user message that comes after a contextual system message will contain a value for the context.
    '''
    def updateContext(self, conversation):
        if len(conversation['messages']) > 0:
            for idx, message in enumerate(conversation['messages']):
                if message['source'] == 'system' and message['messageType'] == 'contextual':
                    conversation['contextVariables'][message['forContextVariable']] = conversation['messages'][idx + 1]['value']
        return conversation
