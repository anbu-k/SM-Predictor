from fastapi import APIRouter
import numpy as np
import pandas as pd
import joblib
from backend.models.sk_model import StockPredictor

router = APIRouter()
predictor = StockPredictor()

@router.get("/predict/{ticker}/{period}")
def predict_price(ticker: str, period: str = "1d"):
    """Predict stock prices for the next day, week, or month"""

    try:
        predictor.model = joblib.load(f"data/processed_data/{ticker}_model.pkl")
    except FileNotFoundError:
        return {"error": "Model not trained yet, please train first."}

    df = predictor.get_stock_data(ticker)

    if len(df) < 2:
        return {"error": "Not enough historical data for accurate prediction."}

    # Get last day in dataset
    last_day = df["Day"].max()
    last_close = df["Close"].iloc[-1]

    # Define number of days to predict
    days_to_predict = {"1d": 1, "1w": 7, "1m": 30}.get(period, 1)
    
    future_days = np.arange(last_day + 1, last_day + days_to_predict + 1).reshape(-1, 1)
    predictions = predictor.model.predict(future_days)

    # Adjust predictions based on last close price
    predictions = [(p + last_close) / 2 for p in predictions]
    
    # Generate future dates
    future_dates = pd.date_range(df["Date"].iloc[-1] + pd.Timedelta(days=1), periods=days_to_predict)

    return {
        "ticker": ticker,
        "predictions": [round(p, 2) for p in predictions],
        "future_dates": [str(d) for d in future_dates],
        "last_close_price": round(last_close, 2),
        "period": period
    }
