import Link from "next/link";
import StockTicker from "./ticker";

export default function Navbar() {
  return (
    <div style={{ background: "#0D1117" }}>
    <nav
      style={{
        background: "#0D1117",
        padding: "15px",
        color: "white",
        textAlign: "left",
      }}
    >
      <h2 style={{ marginTop: "0px", fontSize: "28px" }}>
        SM Predictor 📈📊
      </h2>
      <Link
        href="/"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        Home
      </Link>
      <Link
        href="/predictor"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        Predictor
      </Link>
      <Link
        href="/trading"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        Trading
      </Link>
      <Link
        href="/top-movers"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        Trending
      </Link>
      <Link
        href="/news"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        News
      </Link>
      <Link
        href="/insider"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        Insider Trades
      </Link>
      <Link
        href="/disclaimer"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        Disclaimer
      </Link>
    </nav>
    <StockTicker />
    </div>
  );
}
