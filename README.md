# SM Predictor

SM Predictor is a web application that allows users to **fetch stock market data, view historical trends, mock trade, analyze stock sentiment from news, and generate stock price predictions** using machine learning models. **Currently fetching from 47 of the top stock tickers.**

## Usage

### **Backend Setup**

**Activate Virtual Environment**  
 - venv\scripts\activate
   
**Train the Machine Learning Model**
 - python -m backend.models.train

**Run the Backend Server**
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

### Stock Market News & Sentiment Analysis
- Pulls **relevant financial news articles** for a given stock.
- Performs **sentiment analysis** (**Positive / Negative / Neutral**) using NLP.
- Displays **Top Market Stories** from Yahoo Finance.


##  Pages

### Home 
![image](https://github.com/user-attachments/assets/457a03a3-ac88-4733-b12d-065953b49ddd)

### Predictor 
![image](https://github.com/user-attachments/assets/63c182f4-2af0-4176-9b2d-c78314652ab6)

### Mock Trader
![image](https://github.com/user-attachments/assets/a8b4f324-d350-4c6b-a2fa-bd9d8912ea4f)

### Movers/Watchlist
![image](https://github.com/user-attachments/assets/a47750df-c2d8-4028-965f-c9d87a4efea5)
![image](https://github.com/user-attachments/assets/77b77d79-3be4-462c-a9c9-6320d772162b)

### News 
![image](https://github.com/user-attachments/assets/f1dfa976-8a61-4a83-9e62-18c1167bff0a)
![image](https://github.com/user-attachments/assets/d84a5af4-c228-4be3-982d-57c7e1020af7)

### Insider Tracking
![image](https://github.com/user-attachments/assets/df930fe6-d9ea-4db1-8a7f-7a62af792367)


