from fastapi import APIRouter
from backend.services.fetch_stock import get_stock_data

router = APIRouter()

@router.get("/stock/{ticker}")
def fetch_stock(ticker: str):
    """Fetch historical stock data for a given ticker"""
    data = get_stock_data(ticker)
    return {"ticker": ticker, "data": data}
