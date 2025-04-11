# SM Predictor

SM Predictor is a web application that allows users to **fetch stock market data, view historical trends, mock trade, analyze stock sentiment from news, and generate stock price predictions** using a trained Random Forest Regression model. **Currently fetching from 125 of the top stock tickers.**

## Usage

### **Backend Setup**

**Activate Virtual Environment**  
 - venv\scripts\activate
   
**Train the Machine Learning Model**
 - python -m backend.models.train

**Run the Backend Server**
 - cd backend
 - uvicorn backend.main:app --reload
 - The API will be accessible at: http://127.0.0.1:8000/

### **Frontend Setup**
**Start the Frontend**
 - npm run dev
 - The web application will be accessible at: http://localhost:3000/  


##  Features

### Historical & Current Stock Data
- Fetch and display **real-time & historical stock price data**.
- Select different time ranges: **All Time, 5 Years, 1 Year, 1 Month, 1 Week, 1 Day**.
- Interactive **Plotly candlestick charts** for visualization.

### Stock Price Prediction
- Uses a **trained Random Forest Regression model** to forecast stock prices.
- Analyzes **historical data & technical indicators** such as:
  - **Moving Averages (MA5, MA20)**
  - **RSI (Relative Strength Index)**
  - **MACD (Moving Average Convergence Divergence)**
  - **Volatility indicators**
- Supports multiple prediction timeframes:
  - **Next 1 Day**
  - **Next 1 Week**
  - **Next 1 Month**
- Visualizes trends using **Plotly interactive charts**.

### Mock Trading Simulator
- **Trade with $100,000 in virtual money** and simulate the stock market.
- **Buy and sell stocks** using real-time stock prices.
- **Track your portfolio** with:
  - **Stock holdings, profit/loss calculations, and total portfolio value.**
- **"Sell All" option** to liquidate holdings instantly.
- **Transaction History** logs every trade:
  - Buy/Sell transactions are recorded with timestamps.
- **Balance updates dynamically** based on executed trades.
- **Live stock price updates** ensure realistic market conditions.

### Trending
- Tracks the **Top 10 gainers and Top 10 losers** in the stock market.
- Provides **real-time percentage changes** for the biggest market movers
- **Sortable list** to analyze daily trends and fluctuations.
- Interactive watchlist integration-click to add/remove stocks from the watchlist
- Watchlist **saves your favorite stocks** to track their performance over time.
- The watchlist displays **key financial metrics** for each stock:
  - Current price
  - 52-Week High & Low
  - Market Trend (Uptrend/Downtrend)
  - Next Earnings Report Date
  - Dividend Yield
- Auto updates stock prices & key financial data

### Stock Market News & Sentiment Analysis
- Pulls **relevant financial news articles** for a given stock.
- Performs **sentiment analysis** (**Positive / Negative / Neutral**) using NLP.
- Displays **Top Market Stories** from Yahoo Finance.

### Insider Trade Tracking
- Fetches **SEC Form 3, 4, and 5 filings** to track insider transactions.
- Displays recent **insider buys & sells** for a selected stock.

##  Pages

### Home 
![image](https://github.com/user-attachments/assets/bec85a3d-3e9d-4be1-b02d-4d6f2735f0ef)

### Predictor 
![image](https://github.com/user-attachments/assets/857045aa-12ce-4322-9a9a-12f6d964b67d)

### Mock Trader
![image](https://github.com/user-attachments/assets/c3e7ea9d-031c-4cfb-a2a9-b84e3df63181)

### Trending
![image](https://github.com/user-attachments/assets/8a80509f-ac24-49fb-8c40-b98cb4030ca5)
![image](https://github.com/user-attachments/assets/674b8559-0d7c-4db0-8bc4-a5ddc0bc62e5)

### News 
![image](https://github.com/user-attachments/assets/50e32f70-df16-4dcb-9fcf-3e39f9e7b6bd)
![image](https://github.com/user-attachments/assets/fee59e6b-4041-4e23-838f-7e596d8c4186)

### Insider Tracking
![image](https://github.com/user-attachments/assets/925c2319-500e-4134-bb08-b2fdf483c775)



