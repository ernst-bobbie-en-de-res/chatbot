from store import save, retrieve, append


class FeedbackService:
    def get_feedback(self):
        return retrieve('unanswered')

    def add_feedback(self, feedback):
        return append('unanswered', feedback)

    def set_feedback(self, unanswered):
        return save('unanswered', unanswered)
