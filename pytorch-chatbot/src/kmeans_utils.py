from store import retrieve
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans


class KMeansUtils:
    def __init__(self, n_clusters):
        self.stop_words = retrieve('stop_words')
        self.tfidf_vectorizer = TfidfVectorizer(preprocessor=None, stop_words=self.stop_words)
        self.kmeans = KMeans(n_clusters=n_clusters)

    def fit(self):
        nodes = retrieve('nodes')
        all_sentences = []
        for node in nodes:
            all_sentences.extend(node['patterns'])

        tfidf = self.tfidf_vectorizer.fit_transform(all_sentences)
        self.kmeans.fit(tfidf)

    def predict(self, sentences):
        sentences = self.filter_sentences(sentences)
        return self.kmeans.predict(self.tfidf_vectorizer.transform(sentences))

    def filter_sentences(self, sentences):
        return [" ".join([w for w in s.split() if not w in self.stop_words]) for s in sentences]


# stop_words = retrieve('stop_words')
# tfidf_vectorizer = TfidfVectorizer(preprocessor=None, stop_words=stop_words)
# kmeans = KMeans(n_clusters=3)


# def fit():
#     nodes = retrieve('nodes')
#     all_sentences = []
#     for node in nodes:
#         all_sentences.extend(node['patterns'])
#
#     tfidf = tfidf_vectorizer.fit_transform(all_sentences)
#     kmeans.fit(tfidf)

# def predict(sentences):
#     return kmeans.predict(tfidf_vectorizer.transform(sentences))
