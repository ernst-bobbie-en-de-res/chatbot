from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

# setup experiment data
corpus = ["Wat is de Regionale Energie Strategie (RES)?", "Wat is het doel en de focus van de RES?",
          "Wat is de meerwaarde van de RES?", "Van wie komt de opdracht voor de RES en wie geeft er uitvoering aan?",
          "Hoe zijn de RES-regio’s ingedeeld?", "Wat is de Handreiking RES en voor wie is die bedoeld?",
          "Kunnen niet gewoon alle windmolens op zee?", "Wie neemt de regie in een RES-regio?",
          "Wat zijn de minimale vereisten aan het RES-proces?", "Wat is de doorlooptijd van de RES?",
          "Wat staat er globaal in de concept RES?",
          "Hoe kijkt het NP RES naar de optellingen van de TWh uit de concept-RES’en?",
          "Hoe zit het met de Nationale Omgevingsvisie (NOVI?) ", "Hoe zit het met de RES en de Omgevingswet? ",
          "Is er ook informatie voor volksvertegenwoordigers?", "Wat houdt de energietransitie in?",
          "Wat is 1 TWh (Terrawattuur)?", "Wat houdt het klimaatakkoord in", "Wat is Route35?",
          "Waar richt de RES zich niet op?", "Waar vind ik alle informatie over de RES?",
          "Is de concept-RES Achterhoek in te zien?", "Wat betekent de RES voor lokale initiatieven?",
          "Is zonne-energie een onderdeel van de RES?", "Welke rol speelt zonne energie in de energietransitie?",
          "Wat is windenergie?", "Hoeveel geluid maakt een windmolen?", "Is windenergie onderdeel van de RES?",
          "Waarom een RES?", "Wie betaalt de RES?", "Tellen zonnepanelen op particuliere daken ook mee?",
          "Hoe zit het met kernenergie?", "Wat is de rol van het Rijk?", "Wat is de rol van de regio?",
          "Wat is de rol van de gemeente?", "Welke regio's zijn er?", "Hoe kan ik als inwoner meedoen aan de RES?",
          "Wat is restwarmte?", "Staat straks onze regio vol met windmolens, zonnevelden en elektriciteitsmasten?",
          "Waarom hebben we duurzame energie en warmte nodig?"]
stop_words = ["de", "en", "van", "ik", "te", "dat", "die", "in", "een", "hij", "het", "niet", "zijn", "is", "was", "op",
              "aan", "met", "als", "voor", "had", "er", "maar", "om", "hem", "dan", "zou", "of", "wat", "mijn", "men",
              "dit", "zo", "door", "over", "ze", "zich", "bij", "ook", "tot", "je", "mij", "uit", "der", "daar", "haar",
              "naar", "heb", "hoe", "heeft", "hebben", "deze", "u", "want", "nog", "zal", "me", "zij", "nu", "ge",
              "geen", "omdat", "iets", "worden", "toch", "al", "waren", "veel", "meer", "doen", "toen", "moet", "ben",
              "zonder", "kan", "hun", "dus", "alles", "onder", "ja", "eens", "hier", "wie", "werd", "altijd", "doch",
              "wordt", "wezen", "kunnen", "ons", "zelf", "tegen", "na", "reeds", "wil", "kon", "niets", "uw", "iemand",
              "geweest", "andere", "waar", "waarom", "welke", "komt", "zit"]
user_input = ["Moet ik meebetalen aan de res?", "Kan ik ook meedoen in de energietransitie?"]

# clean corpus and user input from symbols
corpus = [" ".join([w for w in s.split() if not w.lower() in stop_words]) for s in corpus]
corpus = [" ".join([w.replace('?', '') for w in s.split()]) for s in corpus]
corpus = [" ".join([w.replace("'s", 's') for w in s.split()]) for s in corpus]

user_input = [" ".join([w.replace('?', '') for w in s.split()]) for s in user_input]

# initialize vectorizer with stop words and without prepocessing
tfidf_vectorizer = TfidfVectorizer(preprocessor=None, stop_words=stop_words)

# assign weight to corpus and assign weights
tfidf = tfidf_vectorizer.fit_transform(corpus)

# initialize kmeans
n_clusters = 5
n_init = 25
kmeans = KMeans(n_clusters=n_clusters, n_init=n_init)

# calculate parameters with weighted corpus
kmeans.fit(tfidf)

order_centroids = kmeans.cluster_centers_.argsort()[:, ::-1]
terms = tfidf_vectorizer.get_feature_names()

for i in range(n_clusters):
    print('Cluster %d:' % i),
    for ind in order_centroids[i, :10]:
        print(' %s' % terms[ind])

# filter stop words from user input
user_input = [" ".join([w for w in s.split() if not w.lower() in stop_words]) for s in user_input]

# categorize data points
prediction = kmeans.predict(tfidf_vectorizer.transform(user_input))

print(prediction)