import requests
from bs4 import BeautifulSoup
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download("vader_lexicon")
sia = SentimentIntensityAnalyzer()

def get_news_sentiment(ticker):
    """Fetch latest news headlines and analyze sentiment"""
    url = f"https://finance.yahoo.com/quote/{ticker}/news"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    headlines = [h.get_text() for h in soup.find_all("h3")]
    sentiments = {headline: sia.polarity_scores(headline) for headline in headlines}

    return sentiments

# Example usage:
# print(get_news_sentiment("AAPL"))
