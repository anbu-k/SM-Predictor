import { useState, useEffect } from "react";
import Navbar from "../components/navbar";

export default function Trading() {
  const [balance, setBalance] = useState(100000);
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [stockPrices, setStockPrices] = useState({});
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // only starts an interval if portfolio has stocks
    if (portfolio.length === 0) return;

    // fetches prices for all stocks in portfolio
    const fetchAllStockPrices = async () => {
      const pricePromises = portfolio.map(async (stock) => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/stock/${stock.ticker}/1d`
          );
          const data = await response.json();
          return { ticker: stock.ticker, price: Number(data.current_price) };
        } catch (err) {
          console.error(`Error fetching price for ${stock.ticker}:`, err);
          return null;
        }
      });

      try {
        const results = await Promise.all(pricePromises);
        const validResults = results.filter(result => result !== null);
        
        // Updates stockPrices with new prices
        setStockPrices(prev => {
          const newPrices = {...prev};
          validResults.forEach(result => {
            newPrices[result.ticker] = result.price;
          });
          return newPrices;
        });
      } catch (err) {
        console.error("Error updating stock prices:", err);
      }
    };

    // The initial fetch
    fetchAllStockPrices();

    // Set up interval to fetch prices every 5 seconds
    const interval = setInterval(fetchAllStockPrices, 5000);

    // Cleans interval when component unmounts or portfolio becomes empty
    return () => clearInterval(interval);
  }, [portfolio]);

  useEffect(() => {
    if (!ticker) return;
    fetchStockPrice();
    const interval = setInterval(fetchStockPrice, 5000);
    return () => clearInterval(interval);
  }, [ticker]);

  const fetchStockPrice = async () => {
    if (!ticker) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/stock/${ticker}/1d`
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setStockPrices((prev) => ({
        ...prev,
        [ticker]: Number(data.current_price),
      }));
      setError(null);
    } catch (err) {
      setError("Stock not found.");
      setStockPrices((prev) => {
        const updated = { ...prev };
        delete updated[ticker];
        return updated;
      });
    }
  };

  const buyStock = () => {
    const currentStockPrice = stockPrices[ticker];
    if (!currentStockPrice) return;

    const totalCost = currentStockPrice * quantity;
    if (balance >= totalCost) {
      setBalance(balance - totalCost);
      const existingStock = portfolio.find((stock) => stock.ticker === ticker);
      if (existingStock) {
        const updatedPortfolio = portfolio.map((stock) =>
          stock.ticker === ticker
            ? {
                ...stock,
                quantity: stock.quantity + quantity,
                price:
                  (stock.price * stock.quantity + totalCost) /
                  (stock.quantity + quantity),
              }
            : stock
        );
        setPortfolio(updatedPortfolio);
      } else {
        setPortfolio([
          ...portfolio,
          { ticker, quantity, price: currentStockPrice },
        ]);
      }
      setHistory([
        {
          action: "BUY",
          ticker,
          quantity,
          price: currentStockPrice,
          timestamp: new Date(),
        },
        ...history,
      ]);
    } else {
      setError("Not enough balance!");
    }
  };

  const sellStock = () => {
    const currentStockPrice = stockPrices[ticker];
    const stockIndex = portfolio.findIndex((stock) => stock.ticker === ticker);

    if (stockIndex !== -1 && portfolio[stockIndex].quantity >= quantity) {
      const updatedPortfolio = [...portfolio];
      updatedPortfolio[stockIndex].quantity -= quantity;
      if (updatedPortfolio[stockIndex].quantity === 0) {
        updatedPortfolio.splice(stockIndex, 1);
      }
      setBalance(balance + currentStockPrice * quantity);
      setPortfolio(updatedPortfolio);
      setHistory([
        {
          action: "SELL",
          ticker,
          quantity,
          price: currentStockPrice,
          timestamp: new Date(),
        },
        ...history,
      ]);
    } else {
      setError("You don't own enough shares!");
    }
  };

  const sellAllStock = (ticker) => {
    const stockIndex = portfolio.findIndex((stock) => stock.ticker === ticker);
    if (stockIndex !== -1) {
      const stockToSell = portfolio[stockIndex];
      const currentStockPrice = stockPrices[ticker] || stockToSell.price;
      const totalSellValue = currentStockPrice * stockToSell.quantity;

      setBalance(balance + totalSellValue);
      setPortfolio(portfolio.filter((stock) => stock.ticker !== ticker));

      setHistory([
        {
          action: "SELL ALL",
          ticker,
          quantity: stockToSell.quantity,
          price: currentStockPrice,
          timestamp: new Date(),
        },
        ...history,
      ]);
    } else {
      setError("You don't own this stock!");
    }
  };

  const totalPL = portfolio
    .reduce((acc, stock) => {
      const currentPrice = stockPrices[stock.ticker] || stock.price;
      return acc + (currentPrice - stock.price) * stock.quantity;
    }, 0)
    .toFixed(2);

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <Navbar />
      <h1>Mock Trade</h1>
      <h2 style={{ marginTop: "80px" }}>
        Your Balance:&nbsp;
        <span style={{ color: "lightgreen" }}>${balance.toLocaleString()}</span>
      </h2>

      <input
        type="text"
        placeholder="Enter Stock Ticker"
        value={ticker}
        onChange={(e) => setTicker(e.target.value.toUpperCase())}
        style={{ marginRight: "10px", padding: "10px" }}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ marginRight: "10px", padding: "10px" }}
        min="1"
      />
      <button
        onClick={buyStock}
        style={{ padding: "10px", marginRight: "5px" }}
      >
        Buy
      </button>
      <button onClick={sellStock} style={{ padding: "10px" }}>
        Sell
      </button>

      {stockPrices[ticker] !== undefined && !isNaN(stockPrices[ticker]) && (
        <h3>
          Current {ticker} Price:&nbsp;
          <span style={{ color: "lightgreen" }}>
            ${stockPrices[ticker].toFixed(2)}
          </span>
        </h3>
      )}

      <h2 style={{ marginTop: "80px" }}>Total Portfolio P/L</h2>
      <h3 style={{ color: totalPL >= 0 ? "lightgreen" : "red" }}>
        {totalPL >= 0 ? `+${totalPL}` : totalPL} USD
      </h3>

      <table
        style={{
          width: "50%",
          margin: "auto",
          borderCollapse: "collapse",
          background: "#222",
          padding: "10px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid white" }}>
            <th>Ticker</th>
            <th>Quantity</th>
            <th>Avg. Buy Price</th>
            <th>Current Price</th>
            <th>Total Value</th>
            <th>P/L</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((stock, index) => {
            const currentPrice = stockPrices[stock.ticker] || stock.price;
            const profitLoss = (
              (currentPrice - stock.price) *
              stock.quantity
            ).toFixed(2);
            const totalValue = (currentPrice * stock.quantity).toFixed(2);

            return (
              <tr key={index}>
                <td>{stock.ticker}</td>
                <td>{stock.quantity}</td>
                <td>${stock.price.toFixed(2)}</td>
                <td>${currentPrice.toFixed(2)}</td>
                <td>${totalValue}</td>
                <td style={{ color: profitLoss >= 0 ? "lightgreen" : "red" }}>
                  {profitLoss >= 0 ? `+${profitLoss}` : profitLoss}
                </td>
                <td>
                  <button
                    onClick={() => sellAllStock(stock.ticker)}
                    style={{
                      padding: "5px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Sell All
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{ marginTop: "80px" }}>Transaction History</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {history.slice(0, 5).map((entry, index) => (
          <li
            key={index}
            style={{
              background: entry.action === "BUY" ? "green" : "red",
              padding: "5px",
              margin: "5px",
              borderRadius: "5px",
              color: "white",
            }}
          >
            {entry.action} {entry.quantity} shares of {entry.ticker} @ $
            {entry.price.toFixed(2)} (
            {new Date(entry.timestamp).toLocaleTimeString()})
          </li>
        ))}
      </ul>
    </div>
  );
}