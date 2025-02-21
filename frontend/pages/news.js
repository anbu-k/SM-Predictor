import { useState, useEffect } from "react";
import Navbar from "../components/navbar.js";

export default function News() {
  const [ticker, setTicker] = useState("");
  const [news, setNews] = useState([]);
  const [topStories, setTopStories] = useState([]);
  const [error, setError] = useState(null);

  // Fetch top stories on page load
  useEffect(() => {
    fetchTopStories();
  }, []);

  const fetchTopStories = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/news/SPY`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setTopStories(data.news);
    } catch (err) {
      setError("Failed to fetch top stories.");
    }
  };

  const fetchStockNews = async () => {
    if (!ticker) {
      setError("Please enter a stock ticker.");
      return;
    }

    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/news/${ticker}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setNews(data.news);
    } catch (err) {
      setError("News not found for this stock.");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        color: "white",
        padding: "0px",
        marginTop: "0px",
        overflowY: "auto",
      }}
    >
      <Navbar />
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          paddingTop: "20px",
        }}
      >
        {/* Top Stories Section */}
        <div
          style={{
            background: "#222",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <h2>📢 Top Market Stories</h2>
          {topStories.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "15px",
                padding: "10px",
              }}
            >
              {topStories.map((article, index) => (
                <div
                  key={index}
                  style={{
                    background: "#444",
                    padding: "15px",
                    borderRadius: "10px",
                    width: "250px",
                    height: "350px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#FFFFFF",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      display: "block",
                      height: "50px" /* Fixed height for uniformity */,
                    }}
                  >
                    {article.title}
                  </a>
                  {article.image && (
                    <img
                      src={article.image}
                      alt="News thumbnail"
                      style={{
                        width: "100%",
                        height: "120px",
                        borderRadius: "5px",
                        objectFit: "contain",
                        display: "block",
                        margin: "auto",
                        marginTop: "50px",
                      }}
                    />
                  )}
                  <p style={{ color: "#ccc", fontSize: "14px" }}>
                    Sentiment:{" "}
                    <strong>
                      {article.sentiment.compound > 0
                        ? "😊 Positive"
                        : article.sentiment.compound < 0
                        ? "😡 Negative"
                        : "😐 Neutral"}
                    </strong>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading top stories...</p>
          )}
        </div>

        {}
        <div
          style={{
            background: "#222",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <h2>🔍 Search Individual Stock News</h2>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter stock ticker (e.g., AAPL)"
            style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
          />
          <button
            onClick={fetchStockNews}
            style={{ padding: "10px", fontSize: "16px" }}
          >
            Fetch News
          </button>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

          {news.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                padding: "10px",
              }}
            >
              <h2>{ticker} News</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "15px",
                  padding: "10px",
                }}
              >
                {news.map((article, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#444",
                      padding: "15px",
                      borderRadius: "10px",
                      width: "250px",
                      height: "350px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#FFFFFF",
                        fontSize: "16px",
                        fontWeight: "bold",
                        textDecoration: "underline",
                        height: "50px",
                      }}
                    >
                      {article.title}
                    </a>
                    {article.image && (
                      <img
                        src={article.image}
                        alt="News thumbnail"
                        style={{
                          width: "100%",
                          height: "120px",
                          borderRadius: "5px",
                          objectFit: "contain",
                          display: "block",
                          margin: "auto",
                          marginTop: "50px",
                        }}
                      />
                    )}
                    <p style={{ color: "#ccc", fontSize: "14px" }}>
                      Sentiment:{" "}
                      <strong>
                        {article.sentiment.compound > 0
                          ? "😊 Positive"
                          : article.sentiment.compound < 0
                          ? "😡 Negative"
                          : "😐 Neutral"}
                      </strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
