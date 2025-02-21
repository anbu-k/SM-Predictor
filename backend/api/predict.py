from fastapi import APIRouter
import numpy as np
import pandas as pd
import joblib
from datetime import datetime, timedelta
from backend.models.sk_model import StockPredictor

router = APIRouter()
predictor = StockPredictor()

@router.get("/train/{ticker}")
def train_model(ticker: str):
    """Train a new model for the given stock ticker"""
    try:
        result = predictor.train_model(ticker)
        if isinstance(result, dict) and "error" in result:
            return result
        return {"message": f"Successfully trained model for {ticker}", "mae": result}
    except Exception as e:
        return {"error": f"Training failed: {str(e)}"}

@router.get("/predict/{ticker}/{period}")
def predict_price(ticker: str, period: str = "1d"):
    """Predict stock prices for the next day, week, or month"""
    
    try:
        # Load the saved model
        try:
            saved_data = joblib.load(f"data/processed_data/{ticker}_model.pkl")
            # Handle both old and new model formats
            if isinstance(saved_data, tuple):
                predictor.model, predictor.scaler = saved_data
            else:
                # If it's an old model file, we need to retrain
                return {
                    "error": "Please retrain the model using the new version",
                    "action_required": "Call /train/{ticker} endpoint first"
                }
                
        except FileNotFoundError:
            return {
                "error": "Model not found",
                "action_required": "Call /train/{ticker} endpoint first"
            }

        # Define number of days to predict
        days_to_predict = {"1d": 1, "1w": 7, "1m": 30}.get(period, 1)
        
        # Get predictions
        result = predictor.predict_price(ticker, days_to_predict)
        
        if "error" in result:
            return result
            
        # Generate future dates
        today = datetime.now()
        future_dates = [
            (today + timedelta(days=x)).strftime("%Y-%m-%d") 
            for x in range(1, days_to_predict + 1)
        ]
        
        return {
            "ticker": ticker,
            "predictions": [round(p, 2) for p in result["predictions"]],
            "future_dates": future_dates,
            "last_close_price": round(result["last_close"], 2),
            "period": period
        }
        
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}