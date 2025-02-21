import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

class StockPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        
    def get_stock_data(self, ticker, period="1y"):
        """Fetch stock data and create technical indicators"""
        stock = yf.Ticker(ticker)
        df = stock.history(period=period)
        
        # Calculate technical indicators
        df['MA5'] = df['Close'].rolling(window=5).mean()
        df['MA20'] = df['Close'].rolling(window=20).mean()
        df['RSI'] = self.calculate_rsi(df['Close'])
        df['MACD'] = self.calculate_macd(df['Close'])
        df['Volatility'] = df['Close'].rolling(window=20).std()
        df['Price_Change'] = df['Close'].pct_change()
        
        # Create target variable (next day's price)
        df['Target'] = df['Close'].shift(-1)
        
        # Drop any rows with NaN values
        df = df.dropna()
        
        return df
    
    def calculate_rsi(self, prices, period=14):
        """Calculate Relative Strength Index"""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs))
    
    def calculate_macd(self, prices, fast=12, slow=26):
        """Calculate MACD (Moving Average Convergence Divergence)"""
        exp1 = prices.ewm(span=fast, adjust=False).mean()
        exp2 = prices.ewm(span=slow, adjust=False).mean()
        return exp1 - exp2
        
    def prepare_features(self, df):
        """Prepare feature matrix for training"""
        features = ['MA5', 'MA20', 'RSI', 'MACD', 'Volatility', 'Price_Change', 'Close']
        X = df[features]
        y = df['Target']
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        return X_scaled, y
    
    def train_model(self, ticker):
        """Train model with technical indicators"""
        df = self.get_stock_data(ticker)
        
        if len(df) < 60:  # Need enough data for meaningful technical indicators
            return {"error": "Insufficient historical data"}
            
        X_scaled, y = self.prepare_features(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Train model
        self.model.fit(X_train, y_train)
        
        # Calculate accuracy
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        
        # Save model and scaler
        joblib.dump((self.model, self.scaler), f"data/processed_data/{ticker}_model.pkl")
        
        return {"mae": mae}
    
    def predict_price(self, ticker, days_ahead=30):
        """Make predictions for multiple days ahead"""
        try:
            self.model, self.scaler = joblib.load(f"data/processed_data/{ticker}_model.pkl")
        except FileNotFoundError:
            return {"error": "Model not trained yet"}
            
        # Get recent data
        df = self.get_stock_data(ticker, period="6mo")
        
        predictions = []
        last_data = df.iloc[-1:]  # Start with most recent day
        
        # Make sequential predictions
        for _ in range(days_ahead):
            # Prepare features
            features = ['MA5', 'MA20', 'RSI', 'MACD', 'Volatility', 'Price_Change', 'Close']
            X = last_data[features]
            X_scaled = self.scaler.transform(X)
            
            # Predict next day
            pred = self.model.predict(X_scaled)[0]
            predictions.append(pred)
            
            # Update last_data for next prediction
            new_row = last_data.copy()
            new_row['Close'] = pred
            # Update technical indicators for next prediction
            # (simplified for demonstration)
            new_row['Price_Change'] = (pred - last_data['Close'].iloc[0]) / last_data['Close'].iloc[0]
            new_row['MA5'] = pred  # Simplified
            new_row['MA20'] = pred  # Simplified
            new_row['RSI'] = last_data['RSI'].iloc[0]  # Simplified
            new_row['MACD'] = last_data['MACD'].iloc[0]  # Simplified
            new_row['Volatility'] = last_data['Volatility'].iloc[0]  # Simplified
            
            last_data = new_row
            
        return {
            "ticker": ticker,
            "predictions": predictions,
            "last_close": df['Close'].iloc[-1]
        }