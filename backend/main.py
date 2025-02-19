from fastapi import FastAPI
from backend.api import predict
from backend.services.fetch_stock import get_stock_data

app = FastAPI()

# Include the prediction routes
app.include_router(predict.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Stock Prediction API"}

@app.get("/stock/{ticker}")
def fetch_stock_data(ticker: str):
    """Fetch stock historical data"""
    return get_stock_data(ticker)
