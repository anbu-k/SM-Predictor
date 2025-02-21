import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "../components/navbar.js";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Predictor() {
    const [ticker, setTicker] = useState("");
    const [displayedTicker, setDisplayedTicker] = useState("");
    const [predictions, setPredictions] = useState([]);
    const [futureDates, setFutureDates] = useState([]);
    const [lastClose, setLastClose] = useState(null);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState("1d"); // Default prediction period
    const [selectedLabel, setSelectedLabel] = useState("Next 1 Day");

    const timeOptions = {
        "1d": "Next 1 Day",
        "1w": "Next 1 Week",
        "1m": "Next 1 Month",
    };

    const fetchPrediction = async (selectedPeriod = period) => {
        if (!ticker) {
            setError("Please enter a stock ticker.");
            return;
        }
        setError(null);
        setDisplayedTicker(ticker);
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/predict/${ticker}/${selectedPeriod}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
    
            setPredictions(data.predictions || []); // Ensure predictions is always an array
            setFutureDates(data.future_dates || []);
            setLastClose(data.last_close_price || null);
        } catch (err) {
            setError("Stock not found or model not trained.");
            setPredictions([]); // Set to an empty array to avoid undefined error
            setFutureDates([]);
            setLastClose(null);
        }
    };
    

    const handleTimeChange = async (newPeriod) => {
        setPeriod(newPeriod);
        setSelectedLabel(timeOptions[newPeriod]);
        await fetchPrediction(newPeriod);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "0px", color: "white" }}>
            <Navbar />
            <h1>Stock Price Predictions </h1>
            <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Enter a Stock Ticker "
                style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
            />
            <button onClick={() => fetchPrediction()} style={{ padding: "10px", fontSize: "16px" }}>
                Predict
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {predictions.length > 0 && (
                <div style={{ marginTop: "30px" }}>
                    <h2>{displayedTicker} Stock Prediction ({selectedLabel})</h2>
                    <Plot
                        data={[
                            {
                                x: futureDates,
                                y: predictions,
                                type: "scatter",
                                mode: "lines+markers",
                                line: { color: "red" },
                                marker: { color: "red", size: 6 },
                                name: "Predicted Trend",
                            },
                            {
                                x: [futureDates[0]], // First future date
                                y: [lastClose], // Last known price
                                type: "scatter",
                                mode: "markers",
                                marker: { color: "blue", size: 8 },
                                name: "Last Close Price",
                            }
                        ]}
                        layout={{
                            title: `${displayedTicker} Stock Prediction Trend`,
                            xaxis: { title: "Date", type: "date" },
                            yaxis: { title: "Stock Price (USD)" },
                            width: 900,
                            height: 500,
                        }}
                    />
                    
                    {/* Centered Time Range Dropdown */}
                    <div style={{ marginTop: "15px", textAlign: "center" }}>
                        <label htmlFor="timeRange">
                            <strong>Select Prediction Range:</strong>
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
        </div>
    );
}
