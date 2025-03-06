import { useState, useEffect } from "react";
import Navbar from "../components/navbar";

export default function InsiderTrading() {
  const [ticker, setTicker] = useState(""); 
  const [insiderTrades, setInsiderTrades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInsiderTrades = async () => {
    if (!ticker) {
      setError("Please enter a valid stock ticker.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/insider/${ticker}`
      );
      const data = await response.json();

      if (data.error || !data.trades.length) {
        throw new Error("No recent insider trading data found.");
      }

      setInsiderTrades(data.trades);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", color: "white", paddingBottom: "50px" }}>
      <Navbar />
      <h1>Insider Filing Tracker</h1>

      {/* Ticker Input */}
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value.toUpperCase())}
        placeholder="Enter a Stock Ticker"
        style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
      />
      <button
        onClick={fetchInsiderTrades}
        style={{ padding: "10px", fontSize: "16px" }}
      >
        Fetch Insider Data
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && <p>Loading insider transactions...</p>}

      {/* Insider Trading Table */}
      {insiderTrades.length > 0 && (
        <table
          style={{
            width: "80%",
            margin: "auto",
            background: "#222",
            padding: "10px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "3px solid white" }}>
              <th>Insider Name</th>
              <th>Transaction Date</th>
              <th>Form Type</th>
              <th>Filing Link</th>
            </tr>
          </thead>
          <tbody>
            {insiderTrades.map((trade, index) => (
              <tr key={index}>
                <td>{trade.ownerName}</td>
                <td>{new Date(trade.transactionDate).toLocaleDateString()}</td>
                <td>{trade.transactionType}</td>
                <td>
                  {trade.linkToFiling ? (
                    <a
                      href={
                        trade.linkToFiling.startsWith("https")
                          ? trade.linkToFiling
                          : `https://www.sec.gov/Archives/${trade.linkToFiling}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "lightblue" }}
                    >
                      View Filing
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
