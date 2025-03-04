import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#0D1117",
        padding: "15px",
        color: "white",
        textAlign: "left",
      }}
    >
      <h2 style={{ marginTop: "0px", fontSize: "28px" }}>
        Stock Predictor 📈📊
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
        href="/news"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        News
      </Link>
      <Link
        href="/trading"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        Trading
      </Link>
      <Link
        href="/disclaimer"
        style={{ marginRight: "20px", color: "white", textDecoration: "none" }}
      >
        Disclaimer
      </Link>
    </nav>
  );
}
