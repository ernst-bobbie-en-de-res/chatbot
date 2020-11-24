from store import retrieve
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

stop_words = retrieve('stop_words')
tfidf_vectorizer = TfidfVectorizer(preprocessor=None, stop_words=stop_words)
kmeans = KMeans(n_clusters=3)


def fit():
    nodes = retrieve('nodes')
    all_sentences = []
    for node in nodes:
        all_sentences.extend(node['patterns'])

    tfidf = tfidf_vectorizer.fit_transform(all_sentences)
    kmeans.fit(tfidf)


def predict(sentences):
    return kmeans.predict(tfidf_vectorizer.transform(sentences))
