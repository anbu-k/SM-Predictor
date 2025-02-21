from backend.models.sk_model import StockPredictor
import os

# Ensure the processed_data directory exists
os.makedirs("data/processed_data", exist_ok=True)

tickers = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META", "NVDA", "AMD", 
           "INTC", "CSCO", "JPM", "GS", "BAC", "C", "WFC", "AXP", "MS", "WMT", 
           "COST", "TGT", "HD", "LOW", "NKE", "PG", "KO", "PEP", "JNJ", "PFE", "MRNA", 
           "LLY", "UNH", "BMY", "CVS", "GILD", "XOM", "CVX", "GE", "BA", "CAT", "MMM", 
           "HON", "BTC-USD", "ETH-USD", "DOGE-USD", "SPY", "QQQ", "VTI"]  

predictor = StockPredictor()

print("Starting model training for all tickers...")
print("-" * 50)

successful_models = 0
failed_models = 0

for ticker in tickers:
    print(f"\nTraining model for {ticker}...")
    try:
        result = predictor.train_model(ticker)
        
        if isinstance(result, dict):
            if "error" in result:
                print(f"⚠ Error training {ticker}: {result['error']}")
                failed_models += 1
            elif "mae" in result:
                print(f"✓ Successfully trained {ticker} - MAE: {result['mae']:.4f}")
                successful_models += 1
        else:
            print(f"⚠ Unexpected result format for {ticker}")
            failed_models += 1
            
    except Exception as e:
        print(f"❌ Failed to train {ticker}: {str(e)}")
        failed_models += 1

print("\n" + "=" * 50)
print(f"Training Complete!")
print(f"Successfully trained: {successful_models} models")
print(f"Failed to train: {failed_models} models")
print("=" * 50)