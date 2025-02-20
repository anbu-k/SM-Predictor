from backend.models.sk_model import StockPredictor

tickers = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META", "NVDA", "AMD", 
           "INTC", "CSCO", "JPM", "GS", "BAC", "C", "WFC", "AXP", "MS", "WMT", 
           "COST", "TGT", "HD", "LOW", "NKE", "PG", "KO", "PEP", "JNJ", "PFE", "MRNA", 
           "LLY", "UNH", "BMY", "CVS", "GILD", "XOM", "CVX", "GE", "BA", "CAT", "MMM", 
           "HON", "BTC-USD", "ETH-USD", "DOGE-USD", "SPY", "QQQ", "VTI"]  

predictor = StockPredictor()

for ticker in tickers:
    mae = predictor.train_model(ticker)

    if mae is not None:
        print(f"Trained model for {ticker} - MAE: {mae:.2f}")  
    else:
        print(f"⚠ Skipped training for {ticker} due to NaN values.")
