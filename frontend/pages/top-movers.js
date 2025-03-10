import { useState, useEffect } from "react";
import { FaRegStar, FaStar, FaSort } from "react-icons/fa";
import Navbar from "../components/navbar";

export default function TopMovers() {
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState(null);
  const [stockDetails, setStockDetails] = useState({});
  const [hoveredStock, setHoveredStock] = useState({
    ticker: null,
    x: 0,
    y: 0,
  });
  const [sortCriteria, setSortCriteria] = useState("change");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch top gainers and losers
  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/top-movers`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setTopGainers(data.gainers);
        setTopLosers(data.losers);
      } catch (err) {
        setError("Failed to fetch top movers.");
      }
    };

    fetchTopMovers();
    if (autoRefresh) {
      const interval = setInterval(fetchTopMovers, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Loads watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(Array.isArray(savedWatchlist) ? savedWatchlist : []);
  }, []);

  useEffect(() => {
    const fetchWatchlistDetails = async () => {
      for (let ticker of watchlist) {
        if (!stockDetails[ticker]) {
          try {
            const response = await fetch(
              `http://127.0.0.1:8000/api/stock/${ticker}/1d`
            );
            const data = await response.json();
            setStockDetails((prev) => ({ ...prev, [ticker]: data }));
          } catch (err) {
            console.error(`Error fetching details for ${ticker}:`, err);
          }
        }
      }
    };

    if (watchlist.length > 0) {
      fetchWatchlistDetails();
    }
  }, [watchlist]);

  // Toggles watchlist
  const toggleWatchlist = async (ticker) => {
    let updatedWatchlist;

    if (watchlist.includes(ticker)) {
      // Remove from watchlist
      updatedWatchlist = watchlist.filter((stock) => stock !== ticker);
    } else {
      // Add to watchlist
      updatedWatchlist = [...watchlist, ticker];

      if (!stockDetails[ticker]) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/stock/${ticker}/1d`
          );
          const data = await response.json();
          setStockDetails((prev) => ({ ...prev, [ticker]: data }));
        } catch (err) {
          console.error(`Error fetching details for ${ticker}:`, err);
        }
      }
    }

    setWatchlist(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  };

  // Fetches stock details on hover
  const fetchStockDetails = async (ticker) => {
    if (!stockDetails[ticker]) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/stock/${ticker}/1d`
        );
        const data = await response.json();
        setStockDetails((prev) => ({ ...prev, [ticker]: data }));
      } catch (err) {
        console.error(`Error fetching details for ${ticker}:`, err);
      }
    }
  };

  // Sorting function
  const sortStocks = (stocks, isLoser = false) => {
    return [...stocks].sort((a, b) => {
      if (sortCriteria === "price") return b.price - a.price;
      if (sortCriteria === "change") {
        return isLoser ? a.change - b.change : b.change - a.change;
      }
      return a.ticker.localeCompare(b.ticker);
    });
  };

  // Filtering function
  const filterStocks = (stocks) => {
    return stocks.filter((stock) =>
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div style={{ textAlign: "center", color: "white", paddingBottom: "50px" }}>
      <Navbar />
      <h1 style={{ marginTop: "40px" }}> Top Moving Stocks & Watchlist</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search stocks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", marginBottom: "15px" }}
      />

      {/* Sorting Dropdown */}
      <select
        value={sortCriteria}
        onChange={(e) => setSortCriteria(e.target.value)}
        style={{ marginLeft: "10px", padding: "10px", fontSize: "16px" }}
      >
        <option value="change">Sort by Change (%)</option>
        <option value="price">Sort by Price</option>
        <option value="ticker">Sort by Ticker</option>
      </select>

      {/* Auto-Refresh Toggle */}
      <label style={{ marginLeft: "20px", fontSize: "16px" }}>
        <input
          type="checkbox"
          checked={autoRefresh}
          onChange={() => setAutoRefresh(!autoRefresh)}
          style={{ marginRight: "5px" }}
        />
        Auto-Refresh
      </label>

      {/* Top Gainers Section */}
      <h2 style={{ marginTop: "20px", color: "lightgreen" }}>Top 10 Gainers</h2>
      <table
        style={{
          width: "60%",
          margin: "auto",
          background: "#222",
          padding: "10px",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "25%" }}>Ticker</th>
            <th style={{ width: "25%" }}>Price</th>
            <th style={{ width: "25%" }}>Change (%)</th>
            <th style={{ width: "25%" }}>Watchlist</th>
          </tr>
        </thead>
        <tbody>
          {filterStocks(sortStocks(topGainers)).map((stock, index) => (
            <tr key={index}>
              <td
                onMouseEnter={(event) => {
                  fetchStockDetails(stock.ticker);

                  const tooltipHeight = 120;
                  const offsetY = 15;
                  const newY =
                    event.clientY + tooltipHeight > window.innerHeight
                      ? event.clientY - tooltipHeight - offsetY
                      : event.clientY + offsetY;

                  const newX =
                    event.clientX + 250 > window.innerWidth
                      ? event.clientX - 250
                      : event.clientX + 10;

                  setHoveredStock({
                    ticker: stock.ticker,
                    x: newX,
                    y: newY + window.scrollY,
                  });
                }}
                onMouseMove={(event) => {
                  setHoveredStock((prev) =>
                    prev?.ticker
                      ? {
                          ...prev,
                          x: event.clientX + 10,
                          y: event.clientY + window.scrollY + 10,
                        }
                      : prev
                  );
                }}
                onMouseLeave={() =>
                  setHoveredStock({ ticker: null, x: 0, y: 0 })
                }
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {stock.ticker}
              </td>

              <td>${stock.price.toFixed(2)}</td>
              <td style={{ color: "lightgreen" }}>
                +{stock.change.toFixed(2)}%
              </td>
              <td>
                <span
                  onClick={() => toggleWatchlist(stock.ticker)}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                >
                  {watchlist.includes(stock.ticker) ? (
                    <FaStar color="gold" />
                  ) : (
                    <FaRegStar color="gray" />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Top Losers Section */}
      <h2 style={{ marginTop: "20px", color: "red" }}>Top 10 Losers</h2>
      <table
        style={{
          width: "60%",
          margin: "auto",
          background: "#222",
          padding: "10px",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "25%" }}>Ticker</th>
            <th style={{ width: "25%" }}>Price</th>
            <th style={{ width: "25%" }}>Change (%)</th>
            <th style={{ width: "25%" }}>Watchlist</th>
          </tr>
        </thead>
        <tbody>
          {filterStocks(sortStocks(topLosers, true)).map((stock, index) => (
            <tr key={index}>
              <td
                onMouseEnter={(event) => {
                  fetchStockDetails(stock.ticker);

                  const tooltipHeight = 120;
                  const offsetY = 15;
                  const newY =
                    event.clientY + tooltipHeight > window.innerHeight
                      ? event.clientY - tooltipHeight - offsetY
                      : event.clientY + offsetY;

                  const newX =
                    event.clientX + 250 > window.innerWidth
                      ? event.clientX - 250
                      : event.clientX + 10;

                  setHoveredStock({
                    ticker: stock.ticker,
                    x: newX,
                    y: newY + window.scrollY,
                  });
                }}
                onMouseMove={(event) => {
                  setHoveredStock((prev) =>
                    prev?.ticker
                      ? {
                          ...prev,
                          x: event.clientX + 10,
                          y: event.clientY + window.scrollY + 10,
                        }
                      : prev
                  );
                }}
                onMouseLeave={() =>
                  setHoveredStock({ ticker: null, x: 0, y: 0 })
                }
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {stock.ticker}
              </td>
              <td>${stock.price.toFixed(2)}</td>
              <td style={{ color: "red" }}>{stock.change.toFixed(2)}%</td>
              <td>
                <span
                  onClick={() => toggleWatchlist(stock.ticker)}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                >
                  {watchlist.includes(stock.ticker) ? (
                    <FaStar color="gold" />
                  ) : (
                    <FaRegStar color="gray" />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Watchlist Section */}
      <h2 style={{ marginTop: "40px" }}>⭐ Your Watchlist</h2>
      <table
        style={{
          width: "80%",
          margin: "auto",
          background: "#222",
          padding: "10px",
        }}
      >
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Current Price</th>
            <th
              title="Percentage change since you added it"
              style={{ cursor: "help" }}
            >
              Change Since Added (%)
            </th>
            <th
              title="Highest price in the last 52 weeks"
              style={{ cursor: "help" }}
            >
              52W High
            </th>
            <th
              title="Lowest price in the last 52 weeks"
              style={{ cursor: "help" }}
            >
              52W Low
            </th>
            <th
              title="Current market trend: Uptrend or Downtrend"
              style={{ cursor: "help" }}
            >
              Market Trend
            </th>
            <th
              title="Next scheduled earnings report date"
              style={{ cursor: "help" }}
            >
              Next Earnings
            </th>
            <th
              title="Annual dividend yield as a percentage of stock price"
              style={{ cursor: "help" }}
            >
              Dividend Yield
            </th>
          </tr>
        </thead>

        <tbody>
          {watchlist.map((ticker, index) => {
            const stock = stockDetails[ticker] || {};
            const priceNow = stock.current_price || 0;
            const priceAtAdd = stockDetails[ticker]?.price_at_add || priceNow; // Default to current price
            const priceChange = (
              ((priceNow - priceAtAdd) / priceAtAdd) *
              100
            ).toFixed(2);

            return (
              <tr key={index}>
                <td>{ticker}</td>

                <td>${Number(priceNow || 0).toFixed(2)}</td>
                <td style={{ color: priceChange >= 0 ? "lightgreen" : "red" }}>
                  {priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`}
                </td>
                <td>${stock.high_52w?.toFixed(2) || "N/A"}</td>
                <td>${stock.low_52w?.toFixed(2) || "N/A"}</td>
                <td
                  style={{
                    color: stock.trend === "Uptrend" ? "lightgreen" : "red",
                  }}
                >
                  {stock.trend || "N/A"}
                </td>
                <td>{stock.earnings_date || "N/A"}</td>
                <td>
                  {stock.dividend_yield
                    ? `${Number(stock.dividend_yield).toFixed(2)}%`
                    : "N/A"}
                </td>
                <td>
                  <span
                    onClick={() => toggleWatchlist(ticker)}
                    style={{ cursor: "pointer", fontSize: "20px" }}
                  >
                    <FaStar color="gold" />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Stock Details Tooltip on Hover */}
      {hoveredStock?.ticker && stockDetails[hoveredStock.ticker] && (
        <div
          style={{
            position: "absolute",
            top: `${Math.min(
              hoveredStock.y,
              window.innerHeight + window.scrollY - 140
            )}px`,
            left: `${Math.min(
              hoveredStock.x,
              window.innerWidth + window.scrollX - 260
            )}px`,
            backgroundColor: "#333",
            padding: "12px",
            borderRadius: "8px",
            color: "white",
            boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.2)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 9999,
            maxWidth: "250px",
          }}
        >
          <h3>{hoveredStock.ticker} Details</h3>
          <p>
            📈 Price: $
            {Number(
              stockDetails[hoveredStock.ticker]?.current_price || 0
            ).toFixed(2)}
          </p>
          <p>
            📊 Market Cap: $
            {stockDetails[hoveredStock.ticker]?.market_cap?.toLocaleString() ||
              "N/A"}
          </p>
          <p>
            📦 Volume:{" "}
            {stockDetails[hoveredStock.ticker]?.volume?.toLocaleString() ||
              "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}