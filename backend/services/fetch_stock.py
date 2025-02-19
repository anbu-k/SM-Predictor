import yfinance as yf

def get_stock_data(ticker, period="6mo"):
    """Fetch stock historical data"""
    stock = yf.Ticker(ticker)
    df = stock.history(period=period)
    return df.to_dict()
