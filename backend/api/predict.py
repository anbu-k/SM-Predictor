from fastapi import APIRouter
from backend.models.sk_model import StockPredictor

router = APIRouter()
predictor = StockPredictor()

@router.post("/train/{ticker}")
def train_stock_model(ticker: str):
    """Train model for a given stock ticker"""
    mae = predictor.train_model(ticker)
    return {"message": f"Model trained for {ticker}", "mae": mae}

@router.get("/predict/{ticker}")
def predict_stock_price(ticker: str):
    """Predict the next day's stock price for the given ticker"""
    result = predictor.predict_price(ticker)
    return result
