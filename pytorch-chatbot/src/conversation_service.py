import uuid
import json
from store import retrieve, upsert, append


class Conversation:
    def __init__(self):
        self.id = uuid.uuid4().hex
        self.contextVariables = {}
        self.messages = []


class Message:
    def __init__(self, source, messageType, value, forContextVariable):
        self.source = source
        self.messageType = messageType
        self.value = value
        self.forContextVariable = forContextVariable


class ConversationService:
    def __init__(self):
        self.fileName = 'conversations'

    '''
        Instantiates a new conversation and saves this to all conversations
    '''
    def new_conversation(self):
        conversation = Conversation().__dict__
        introduction_message = Message('system', 'informational', 'Hallo ik ben Dorès, de virtuele assistent van de RES!🖐 Je kan bij mij terecht voor vragen over de Regionale Energie Strategie of ik kan je begeleiden bij het vinden van RES-gerelateerde informatie.', None)
        conversation['messages'].append(introduction_message.__dict__)
        append(self.fileName, conversation)
        return conversation

    '''
        Updates the context of the given conversation.
        If the given conversation exists it will be updated.
        If the given conversation doesn't exist it will be saved.
    '''
    def upsert_conversation(self, conversation):
        self.updateContext(conversation)
        return upsert(self.fileName, conversation)

    '''
        Gets all conversations.
    '''
    def get_conversations(self):
        return retrieve(self.fileName)

    '''
        Scans the messages in the conversation in order to update the conversational context. 
        A user message that comes after a contextual system message will contain a value for the context.
    '''
    def update_context(self, conversation):
        if hasattr(conversation, 'messages') and len(conversation['messages']) > 0:
            for idx, message in enumerate(conversation['messages']):
                if hasattr(message, 'forContextVariable') is True and message['forContextVariable'] is not None and \
                        message['source'] == 'user':
                    conversation['contextVariables'][message['forContextVariable']] = message['value']
        return conversation
