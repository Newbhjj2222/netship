// pages/_app.js
import "@/styles/globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function App({ Component, pageProps }) {

  useEffect(() => {
    const bg = Cookies.get("bg") || "#ffffff";
    const color = Cookies.get("color") || "#000000";
    const font = Cookies.get("font") || "sans";

    document.documentElement.style.setProperty("--background", bg);
    document.documentElement.style.setProperty("--foreground", color);

    document.body.style.fontFamily =
      font === "sans"
        ? "Arial, Helvetica, sans-serif"
        : font === "mono"
        ? "Courier New, monospace"
        : "Georgia, serif";
  }, []);

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer /> {/* 🔥 THIS IS THE MAGIC */}
    </>
  );
}
