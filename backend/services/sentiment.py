import requests
from bs4 import BeautifulSoup
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from fastapi import APIRouter

router = APIRouter()

# Download NLTK's VADER lexicon
nltk.download("vader_lexicon", quiet=True)
sia = SentimentIntensityAnalyzer()

def fetch_news(ticker):
    """Fetch latest stock news headlines from Yahoo Finance"""
    url = f"https://finance.yahoo.com/quote/{ticker}/news"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return {"error": f"Failed to fetch news. HTTP Status: {response.status_code}"}

    soup = BeautifulSoup(response.text, "html.parser")

    news_items = []
    seen_titles = set()  # To remove duplicate headlines

    for article in soup.find_all("li"):
        headline_tag = article.find("h3")  # Get the title of the news article
        link_tag = article.find("a")  # Find the hyperlink to the article
        img_tag = article.find("img")  # Find image in the article

        if headline_tag and link_tag:
            title = headline_tag.get_text(strip=True)
            link = link_tag.get("href")
            
            # Convert relative URLs to full links
            if link and link.startswith("/"):
                full_url = f"https://finance.yahoo.com{link}"
            else:
                full_url = link

            # Extract image URL
            img_url = img_tag["src"] if img_tag and img_tag.get("src") else None

            # Filter out generic categories
            irrelevant_keywords = ["news", "entertainment", "finance", "life", "sports", "new on yahoo"]
            if any(keyword.lower() == title.lower() for keyword in irrelevant_keywords):
                continue  # Skip non-news items

            # Avoid duplicate titles and missing URLs
            if title and full_url and title not in seen_titles:
                seen_titles.add(title)
                news_items.append({"title": title, "url": full_url, "image": img_url})

    return news_items[:10]  # Return top 10 filtered stock news articles

def analyze_sentiment(news_items):
    """Analyze sentiment for each news headline"""
    for article in news_items:
        sentiment = sia.polarity_scores(article["title"])
        article["sentiment"] = sentiment
    return news_items

@router.get("/news/{ticker}")
def get_news_sentiment(ticker: str):
    """Fetch latest news headlines and analyze sentiment"""
    news = fetch_news(ticker)
    
    if "error" in news:
        return news
    
    sentiment_news = analyze_sentiment(news)
    
    return {"ticker": ticker, "news": sentiment_news}
