import { useState, useEffect } from "react";
import Navbar from "../components/navbar";

export default function Trading() {
  const [balance, setBalance] = useState(100000);
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

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
      setStockPrice(Number(data.current_price));
      setError(null);
    } catch (err) {
      setError("Stock not found.");
      setStockPrice(null);
    }
  };

  const buyStock = () => {
    if (!stockPrice) return;
    const totalCost = stockPrice * quantity;
    if (balance >= totalCost) {
      setBalance(balance - totalCost);
      const existingStock = portfolio.find((stock) => stock.ticker === ticker);
      if (existingStock) {
        existingStock.quantity += quantity;
        existingStock.price =
          (existingStock.price * existingStock.quantity + totalCost) /
          (existingStock.quantity + quantity);
      } else {
        setPortfolio([...portfolio, { ticker, quantity, price: stockPrice }]);
      }
      setHistory([
        {
          action: "BUY",
          ticker,
          quantity,
          price: stockPrice,
          timestamp: new Date(),
        },
        ...history,
      ]);
    } else {
      setError("Not enough balance!");
    }
  };

  const sellStock = () => {
    const stockIndex = portfolio.findIndex((stock) => stock.ticker === ticker);
    if (stockIndex !== -1 && portfolio[stockIndex].quantity >= quantity) {
      const updatedPortfolio = [...portfolio];
      updatedPortfolio[stockIndex].quantity -= quantity;
      if (updatedPortfolio[stockIndex].quantity === 0) {
        updatedPortfolio.splice(stockIndex, 1);
      }
      setBalance(balance + stockPrice * quantity);
      setPortfolio(updatedPortfolio);
      setHistory([
        {
          action: "SELL",
          ticker,
          quantity,
          price: stockPrice,
          timestamp: new Date(),
        },
        ...history,
      ]);
    } else {
      setError("You don't own enough shares!");
    }
  };

  // Calculate total profit/loss
  const totalPL = portfolio
    .reduce((acc, stock) => {
      return acc + (stockPrice - stock.price) * stock.quantity;
    }, 0)
    .toFixed(2);

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <Navbar />
      <h1>Mock Trading</h1>
      <h2>Balance: ${balance.toLocaleString()}</h2>

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

      {stockPrice !== null && !isNaN(stockPrice) && (
        <h3>
          Current {ticker} Price: ${stockPrice.toFixed(2)}
        </h3>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Portfolio</h2>
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
          </tr>
        </thead>
        <tbody>
          {portfolio.map((stock, index) => {
            const profitLoss = (
              (stockPrice - stock.price) *
              stock.quantity
            ).toFixed(2);
            const totalValue = stockPrice
              ? (stockPrice * stock.quantity).toFixed(2)
              : "-";
            return (
              <tr key={index}>
                <td>{stock.ticker}</td>
                <td>{stock.quantity}</td>
                <td>${stock.price.toFixed(2)}</td>
                <td>${stockPrice ? stockPrice.toFixed(2) : "-"}</td>
                <td>${totalValue}</td>
                <td style={{ color: profitLoss >= 0 ? "lightgreen" : "red" }}>
                  {profitLoss >= 0 ? `+${profitLoss}` : profitLoss}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Total Portfolio P/L</h2>
      <h3 style={{ color: totalPL >= 0 ? "lightgreen" : "red" }}>
        {totalPL >= 0 ? `+${totalPL}` : totalPL} USD
      </h3>

      <h2>Transaction History</h2>
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
