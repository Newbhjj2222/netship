"use client";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const cardRef = useRef();
  const [quote, setQuote] = useState("Andika amagambo yawe hano...");
  const [name, setName] = useState("Izina ryawe");

  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement("a");
    link.download = "quote.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Quote Generator</h2>

      {/* Inputs */}
      <input
        type="text"
        placeholder="Andika quote..."
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 10 }}
      />

      <input
        type="text"
        placeholder="Izina..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 20, padding: 10 }}
      />

      <button onClick={downloadImage} style={{ padding: 10 }}>
        Download Image
      </button>

      {/* Template */}
      <div
        ref={cardRef}
        style={{
          width: 400,
          height: 400,
          marginTop: 30,
          background: "linear-gradient(to top, #1e3c72, #2a5298)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 20,
            width: "85%",
          }}
        >
          <p style={{ fontSize: 18 }}>{quote}</p>
          <p style={{ marginTop: 20, fontWeight: "bold" }}>
            — {name}
          </p>
        </div>
      </div>
    </div>
  );
}
