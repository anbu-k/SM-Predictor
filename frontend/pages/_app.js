import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        // Hide scrollbar on Home, Predictor, and Disclaimer pages
        if (["/", "/predictor", "/disclaimer"].includes(router.pathname)) {
            document.documentElement.classList.add("no-scroll");
        } else {
            document.documentElement.classList.remove("no-scroll");
        }
    }, [router.pathname]);

    return <Component {...pageProps} />;
}
