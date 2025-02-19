import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib  # For saving/loading the model

class StockPredictor:
    def __init__(self):
        self.model = LinearRegression()

    def get_stock_data(self, ticker, period="6mo"):
        """Fetch stock data from yfinance and prepare for training"""
        stock = yf.Ticker(ticker)
        df = stock.history(period=period)
        df = df[['Close']].reset_index()
        df['Day'] = np.arange(len(df))  # Convert dates to numerical values
        return df

    def train_model(self, ticker):
        """Train the model on stock data"""
        df = self.get_stock_data(ticker)
        X = df[['Day']]
        y = df['Close']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)

        # Save model
        joblib.dump(self.model, f"data/processed_data/{ticker}_model.pkl")
        return mae

    def predict_price(self, ticker):
        """Load the trained model and predict the next day's price"""
        try:
            self.model = joblib.load(f"data/processed_data/{ticker}_model.pkl")
        except FileNotFoundError:
            return {"error": "Model not trained yet, please train first."}

        df = self.get_stock_data(ticker)
        next_day = np.array([[df['Day'].max() + 1]])
        predicted_price = self.model.predict(next_day)[0]

        return {"ticker": ticker, "predicted_price": round(predicted_price, 2)}

# Example usage:
# predictor = StockPredictor()
# predictor.train_model("AAPL")
# print(predictor.predict_price("AAPL"))
