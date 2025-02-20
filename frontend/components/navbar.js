import Link from "next/link";

export default function Navbar() {
    return (
        <nav style={{ background: "#333", padding: "10px", color: "white", textAlign: "left" }}>
            <h2 style={{marginTop: "0px"}}>Stock Predictor 📈📊</h2>
            <Link href="/" style={{ marginRight: "20px", color: "white", textDecoration: "none" }}>
                Home
            </Link>
            <Link href="/predictor" style={{ color: "white", textDecoration: "none" }}>
                Predictor
            </Link>
        </nav>
    );
}
