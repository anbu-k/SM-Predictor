# Stock Predictor

Stock Predictor is a web application that allows users to **fetch stock market data, view historical trends, mock trade, analyze stock sentiment from news, and generate stock price predictions** using machine learning models. **Currently fetching from 47 of the top stock tickers.**

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
![image](https://github.com/user-attachments/assets/485e5009-c3e2-4ba8-a6d9-26886b585c72)

### Predictor 
![image](https://github.com/user-attachments/assets/5e20949d-e1fd-4213-83aa-a7be45e86c64)

### Mock Trader
![image](https://github.com/user-attachments/assets/e5b40395-961e-495c-ab6f-558ae104f14f)

### Movers/Watchlist
![image](https://github.com/user-attachments/assets/1412b40d-7221-4d90-a9e7-63b92e715036)
![image](https://github.com/user-attachments/assets/3b3888a7-56ad-4953-88fe-79249a79fd00)

### News 
![image](https://github.com/user-attachments/assets/002d9594-8258-40dc-8b65-14ba4b6b9dc6)
![image](https://github.com/user-attachments/assets/f3cb61cf-4d6b-4b2c-9ebb-b5945c146f76)

