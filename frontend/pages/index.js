import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "../components/navbar.js";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Home() {
  const [ticker, setTicker] = useState("");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("1y");
  const [selectedLabel, setSelectedLabel] = useState("Last 1 Year");
  const [loading, setLoading] = useState(false);

  const timeOptions = {
    ALL: "All Time",
    "5y": "Last 5 Years",
    "1y": "Last 1 Year",
    "1m": "Last 1 Month",
    "1w": "Last 1 Week",
    "1d": "Last 1 Day",
  };

  const handleTimeChange = async (newPeriod) => {
    setPeriod(newPeriod);
    setSelectedLabel(timeOptions[newPeriod]);

    await fetchStockData(newPeriod);
  };

  const fetchStockData = async (selectedPeriod = period) => {
    if (!ticker) {
      setError("Please enter a stock ticker.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/stock/${ticker}/${selectedPeriod}`
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Update ALL stock data fields, not just the chart data
      setStockData({
        company_name: data.company_name,
        ticker: data.ticker,
        market_cap: data.market_cap,
        current_price: data.current_price,
        volume: data.volume,
        dates: data.dates,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
      });
    } catch (err) {
      setError("Stock not found or invalid time period.");
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "0px",
        color: "white",
        overflowy: "hidden",
      }}
    >
      <Navbar /> {}
      <h1>Historical & Current Stock Info.</h1>
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value.toUpperCase())}
        placeholder="Enter a Stock Ticker"
        style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
      />
      <button
        onClick={() => fetchStockData()}
        style={{ padding: "10px", fontSize: "16px" }}
      >
        Fetch Data
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stockData && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h2 style={{ marginBottom: "5px" }}>
            {stockData.company_name} ({stockData.ticker})
          </h2>

          <p style={{ margin: "3px 0", fontSize: "15px" }}>
            <strong>Market Cap:</strong> $
            {stockData.market_cap?.toLocaleString()}
          </p>
          <p style={{ margin: "3px 0", fontSize: "15px" }}>
            <strong>Current Price:</strong> ${stockData.current_price}
          </p>
          <p
            style={{ margin: "3px 0", fontSize: "15px", marginBottom: "20px" }}
          >
            <strong>Volume:</strong> {stockData.volume.toLocaleString()}
          </p>

          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Plot
              data={[
                {
                  x: stockData.dates,
                  open: stockData.open,
                  high: stockData.high,
                  low: stockData.low,
                  close: stockData.close,
                  type: "candlestick",
                  name: stockData.ticker,
                },
              ]}
              layout={{
                title: `${stockData.ticker} Stock Price (${selectedLabel})`,
                xaxis: {
                  type: "date",
                  tickformat: "%Y-%m-%d",
                },
                yaxis: { title: "Stock Price (USD)" },
                width: 900,
                height: 500,
              }}
            />
          </div>

          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <label htmlFor="timeRange">
              <strong>Select Time Range:</strong>
            </label>
            <br />
            <select
              id="timeRange"
              value={period}
              onChange={(e) => handleTimeChange(e.target.value)}
              style={{
                padding: "10px",
                fontSize: "16px",
                marginTop: "5px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              {Object.entries(timeOptions).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {loading ? (
        <div style={{ minHeight: "30px" }}>
          <p>Loading stock data...</p>
        </div>
      ) : null}
    </div>
  );
}
