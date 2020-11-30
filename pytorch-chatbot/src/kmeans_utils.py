from store import retrieve
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans


class KMeansUtils:
    def __init__(self, n_clusters, n_init):
        self.stop_words = retrieve('stop_words')
        self.tfidf_vectorizer = TfidfVectorizer(preprocessor=None, stop_words=self.stop_words)
        self.kmeans = KMeans(n_clusters=n_clusters, n_init=n_init)

    def fit(self):
        nodes = retrieve('nodes')
        corpus = []
        for node in nodes:
            corpus.extend(node['patterns'])

        tfidf = self.tfidf_vectorizer.fit_transform(corpus)
        self.kmeans.fit(tfidf)

    def predict(self, sentences):
        sentences = self.filter_sentences(sentences)
        return self.kmeans.predict(self.tfidf_vectorizer.transform(sentences))

    def filter_stop_words(self, sentences):
        return [" ".join([w for w in s.split() if not w in self.stop_words]) for s in sentences]

    def filter_symbols(self, sentences):
        return [" ".join([w.replace('?', '') for w in s.split()]) for s in sentences]
