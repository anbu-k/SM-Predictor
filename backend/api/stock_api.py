from fastapi import APIRouter
import yfinance as yf

router = APIRouter()

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
    }

@router.get("/stock/{ticker}")
def fetch_default_stock(ticker: str):
    """Fetch stock data for a ticker with a default time period (1 year)."""
    return fetch_stock_data(ticker, DEFAULT_PERIOD)

@router.get("/stock/{ticker}/{period}")
def fetch_stock_with_period(ticker: str, period: str):
    """Fetch stock data for a ticker with a specified time period."""
    return fetch_stock_data(ticker, period)
