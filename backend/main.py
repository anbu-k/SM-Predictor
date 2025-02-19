from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import predict
from backend.services.fetch_stock import get_stock_data

app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include API routes
app.include_router(predict.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Stock Prediction API"}

@app.get("/stock/{ticker}")
def fetch_stock_data(ticker: str):
    """Fetch stock historical data"""
    return get_stock_data(ticker)
