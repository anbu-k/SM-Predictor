from fastapi import APIRouter
import yfinance as yf
import requests
import os

router = APIRouter()

SEC_API_KEY = "5e45e39243a73823cd12856472b96bd34a320b19abf53fca5f3969e1d690d25d"  
SEC_API_URL = "https://api.sec-api.io"

# Allowed time periods
TIME_PERIODS = {
    "ALL": "max",
    "5y": "5y",
    "1y": "1y",
    "1m": "1mo",
    "1w": "7d",
    "1d": "1d"
}

DEFAULT_PERIOD = "1y"  # Default to 1 year if no period is provided

def fetch_stock_data(ticker: str, period: str):
    """Fetch stock data from yfinance for a given ticker and period."""
    if period not in TIME_PERIODS:
        return {"error": "Invalid time period"}

    stock = yf.Ticker(ticker)
    data = stock.history(period=TIME_PERIODS[period])

    return {
        "ticker": ticker,
        "company_name": stock.info.get("longName", "N/A"),
        "current_price": stock.info.get("currentPrice", "N/A"),
        "market_cap": stock.info.get("marketCap", "N/A"),
        "volume": stock.info.get("volume", "N/A"),
        "open": data["Open"].tolist(),
        "high": data["High"].tolist(),
        "low": data["Low"].tolist(),
        "close": data["Close"].tolist(),
        "dates": data.index.strftime("%Y-%m-%d").tolist(),
        "price_at_add": stock.history(period="1d")["Close"].iloc[0], # Price when added to watchlist
        "high_52w": stock.info.get("fiftyTwoWeekHigh", "N/A"),
        "low_52w": stock.info.get("fiftyTwoWeekLow", "N/A"),
        "trend": "Uptrend" if stock.info.get("fiftyDayAverage", 0) > stock.info.get("twoHundredDayAverage", 0) else "Downtrend",
        "earnings_date": stock.calendar.get("Earnings Date", "N/A"),
        "dividend_yield": stock.info.get("dividendYield", 0) * 100 if stock.info.get("dividendYield") else "N/A",
        "insider_ownership": stock.info.get("heldPercentInsiders", 0) * 100,  # Insider ownership %
    }

@router.get("/stock/{ticker}")
def fetch_default_stock(ticker: str):
    """Fetch stock data for a ticker with a default time period (1 year)."""
    return fetch_stock_data(ticker, DEFAULT_PERIOD)

@router.get("/stock/{ticker}/{period}")
def fetch_stock_with_period(ticker: str, period: str):
    """Fetch stock data for a ticker with a specified time period."""
    return fetch_stock_data(ticker, period)

@router.get("/top-movers")
def get_top_movers():
    """Fetch top 5 gainers and top 5 losers for the day."""
    tickers = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META", "NVDA", "AMD", 
           "INTC", "CSCO", "JPM", "GS", "BAC", "C", "WFC", "AXP", "MS", "WMT", 
           "COST", "TGT", "HD", "LOW", "NKE", "PG", "KO", "PEP", "JNJ", "PFE", "MRNA", 
           "LLY", "UNH", "BMY", "CVS", "GILD", "XOM", "CVX", "GE", "BA", "CAT", "MMM", 
           "HON", "BTC-USD", "ETH-USD", "DOGE-USD", "SPY", "QQQ", "VTI"]  
    stocks = []

    for ticker in tickers:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")
        if not data.empty:
            price = data["Close"].iloc[-1]
            change = ((data["Close"].iloc[-1] - data["Open"].iloc[-1]) / data["Open"].iloc[-1]) * 100
            stocks.append({"ticker": ticker, "price": price, "change": change})

    top_gainers = sorted(stocks, key=lambda x: x["change"], reverse=True)[:10]
    top_losers = sorted(stocks, key=lambda x: x["change"])[:10]

    return {"gainers": top_gainers, "losers": top_losers}

@router.get("/insider/{ticker}")
def get_insider_trades(ticker: str):
    """Fetch recent insider trading activity for a given stock ticker from SEC API."""
    query_payload = {
        "query": f'ticker:"{ticker}" AND formType:("3", "4", "5")',
        "from": "0",
        "size": "10",  # Get the 10 most recent insider trades
        "sort": [{"filedAt": {"order": "desc"}}]
    }

    headers = {"Authorization": SEC_API_KEY}
    response = requests.post(SEC_API_URL, json=query_payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        transactions = data.get("filings", [])

        # Format data for frontend display
        formatted_trades = []
        for trade in transactions:
            formatted_trades.append({
                "ownerName": trade.get("entities", [{}])[0].get("companyName", "N/A"),  # Name of insider
                "transactionDate": trade.get("filedAt", "N/A"),  # Filing date
                "transactionType": trade.get("formType", "N/A"),  # Type of transaction (Form 3, 4, or 5)
                "linkToFiling": trade.get("linkToFilingDetails", "N/A"),  # SEC filing link
            })

        return {"ticker": ticker, "trades": formatted_trades}
    else:
        return {"error": "Failed to fetch insider trading data"}
