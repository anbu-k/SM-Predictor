from fastapi import APIRouter
import numpy as np
import pandas as pd
import joblib
from backend.models.sk_model import StockPredictor

router = APIRouter()
predictor = StockPredictor()

@router.post("/train/{ticker}")
def train_stock_model(ticker: str):
    """Train model for a given stock ticker"""
    mae = predictor.train_model(ticker)
    return {"message": f"Model trained for {ticker}", "mae": mae}

@router.get("/predict/{ticker}")
def predict_price(ticker: str):
    """Predict the next day's stock price for the given ticker"""
    try:
        predictor.model = joblib.load(f"data/processed_data/{ticker}_model.pkl")
    except FileNotFoundError:
        return {"error": "Model not trained yet, please train first."}

    df = predictor.get_stock_data(ticker)

    if len(df) < 2:  # Ensure there's enough data to predict
        return {"error": "Not enough historical data for accurate prediction."}

    next_day = np.array([[df['Day'].max() + 1]])
    predicted_price = predictor.model.predict(next_day)[0]

    # Add a correction factor based on recent trends
    last_close = df['Close'].iloc[-1]
    predicted_price = (predicted_price + last_close) / 2  # Averaging with last close price

    return {
        "ticker": ticker,
        "predicted_price": round(predicted_price, 2),
        "last_close_price": round(last_close, 2),
        "prediction_date": str(df["Date"].iloc[-1] + pd.Timedelta(days=1))  # Convert date to string
    }
