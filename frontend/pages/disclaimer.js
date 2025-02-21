import Navbar from "../components/navbar.js";

export default function Disclaimer() {
    return (
        <div style={{ textAlign: "center", color: "white", padding: "0px" }}>
            <Navbar />
            <div style={{
                maxWidth: "800px",
                margin: "50px auto",
                padding: "20px",
                background: "#222",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                textAlign: "left",
                lineHeight: "1.6"
            }}>
                <h2 style={{ color: "#FFD700", textAlign: "center", marginBottom: "10px" }}>
                    ⚠️ Disclaimer
                </h2>
                <p>
                    The information provided by <strong>Stock Predictor</strong> is for educational and informational purposes only.
                    It is not intended as financial, investment, or trading advice.
                </p>
                <p>
                    Stock prices and predictions displayed on this platform are based on publicly available data and algorithms,
                    which may not always be accurate or up-to-date.
                </p>
                <p>
                    <strong>We do not guarantee any financial gains, and past performance does not indicate future results.</strong>
                    Always conduct your own research and consult with a certified financial advisor before making any investment decisions.
                </p>
                <p style={{ fontStyle: "italic", color: "#BBB", textAlign: "center", marginTop: "15px" }}>
                    "Investing involves risks, including the potential loss of principal."
                </p>
            </div>
        </div>
    );
}
