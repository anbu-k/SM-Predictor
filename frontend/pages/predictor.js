import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "../components/navbar.js";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Predictor() {
    const [ticker, setTicker] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [predictionDate, setPredictionDate] = useState("");
    const [lastClose, setLastClose] = useState(null);

    const fetchPrediction = async () => {
        if (!ticker) {
            setError("Please enter a stock ticker.");
            return;
        }
        setError(null);

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/predict/${ticker}`);
            const data = await response.json();

            if (!data.predicted_price) {
                throw new Error("Prediction data is missing.");
            }

            setPrediction(data.predicted_price);
            setLastClose(data.last_close_price || "N/A");
            setPredictionDate(data.prediction_date || "Next Trading Day");
        } catch (err) {
            setError("Stock not found or model not trained.");
            setPrediction(null); 
            setLastClose(null);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "0px", color: "white" }}>
            <Navbar />
            <h1>Stock Price Predictions </h1>
            <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Enter stock ticker (e.g., AAPL)"
                style={{ padding: "10px", fontSize: "16px" }}
            />
            <button onClick={fetchPrediction} style={{ marginLeft: "10px", padding: "10px", fontSize: "16px" }}>
                Predict
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {prediction !== null && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <h2>Predicted Price for {predictionDate}: ${prediction ? prediction.toFixed(2) : "N/A"}</h2>
                    <p>Last Close Price: ${lastClose}</p>
                </div>
            )}

            {prediction !== null && (
                <div style={{ marginTop: "30px" }}>
                    <h2>Stock Prediction Trend</h2>
                    <Plot
                        data={[
                            {
                                x: [predictionDate],
                                y: [lastClose],  // Last known price
                                type: "scatter",
                                mode: "markers",
                                marker: { color: "blue", size: 8 },
                                name: "Last Close Price",
                            },
                            {
                                x: [predictionDate],
                                y: [prediction],
                                type: "scatter",
                                mode: "markers",
                                marker: { color: "red", size: 10 },
                                name: "Predicted Price",
                            },
                        ]}
                        layout={{
                            title: `${ticker} Stock Prediction`,
                            xaxis: { title: "Date", type: "date" },
                            yaxis: { title: "Stock Price (USD)" },
                            width: 900,
                            height: 500,
                        }}
                    />
                </div>
            )}
        </div>
    );
}
