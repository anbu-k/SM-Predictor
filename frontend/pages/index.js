import { useState } from "react";

export default function Home() {
    const [ticker, setTicker] = useState("");
    const [prediction, setPrediction] = useState(null);

    const fetchPrediction = async () => {
        const response = await fetch(`http://127.0.0.1:8000/api/predict/${ticker}`);
        const data = await response.json();
        setPrediction(data.predicted_price);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Stock Market Predictor 📈</h1>
            <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Enter stock ticker (e.g., AAPL)"
            />
            <button onClick={fetchPrediction}>Predict</button>

            {prediction && (
                <h2>Predicted Price: ${prediction}</h2>
            )}
        </div>
    );
}
