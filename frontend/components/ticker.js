import { useState, useEffect } from "react";

export default function StockTicker() {
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // Track if data has loaded

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/top-movers");
        const data = await response.json();

        if (!data.gainers || !data.losers) {
          throw new Error("Failed to load stock data.");
        }

        const stocks = [...data.gainers, ...data.losers];

        const formattedStocks = stocks.map((stock) => (
          <span key={stock.ticker} className="ticker-item">
            {stock.ticker}: ${stock.price.toFixed(2)}{" "}
            <span className={stock.change >= 0 ? "green-arrow" : "red-arrow"}>
              {stock.change >= 0 ? "▲" : "▼"}
            </span>
            {Math.abs(stock.change).toFixed(2)}%
          </span>
        ));

        setStockData(formattedStocks);
        setIsLoaded(true); // Mark data as loaded
      } catch (err) {
        setError("Failed to fetch stock ticker data.");
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker-container">
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className={`ticker-wrapper ${isLoaded ? "start-scroll" : ""}`}>
          <div className="ticker">{stockData}</div>
        </div>
      )}
    </div>
  );
}
