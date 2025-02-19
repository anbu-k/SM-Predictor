from backend.models.sk_model import StockPredictor

tickers = ["AAPL", "GOOGL", "MSFT", "TSLA"]  # List of stocks to train on
predictor = StockPredictor()

for ticker in tickers:
    mae = predictor.train_model(ticker)
    print(f"Trained model for {ticker} - MAE: {mae:.2f}")
