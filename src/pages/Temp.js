"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const cardRef = useRef(null);

  const [name, setName] = useState("Anonymous");
  const [quote, setQuote] = useState("Write something powerful...");
  const [profilePic, setProfilePic] = useState(null);
  const [bgImage, setBgImage] = useState(null);

  const [template, setTemplate] = useState("default");

  // PROFILE PIC
  const handleProfile = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // BACKGROUND IMAGE
  const handleBgImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setBgImage(URL.createObjectURL(file));
  };

  // DOWNLOAD FUNCTION (FIXED 100%)
  const downloadImage = async () => {
    const html2canvasLib = (await import("html2canvas")).default;

    const canvas = await html2canvasLib(cardRef.current, {
      useCORS: true,
      allowTaint: false,
      scale: 3,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = "design.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 gap-4" style={{ marginTop: "80px" }}>

      {/* INPUTS */}
      <div className="w-full max-w-md flex flex-col gap-3">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-3 border rounded-xl"
        />

        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Quote..."
          className="p-3 border rounded-xl h-24"
        />

        {/* PROFILE PIC */}
        <input type="file" accept="image/*" onChange={handleProfile} />

        {/* BACKGROUND IMAGE */}
        <input type="file" accept="image/*" onChange={handleBgImage} />

        {/* TEMPLATE COLORS */}
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="p-3 border rounded-xl"
        >
          <option value="default">Default</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="dark">Dark</option>
          <option value="gradient">Gradient</option>
        </select>

        <button
          onClick={downloadImage}
          className="bg-black text-white p-3 rounded-xl"
        >
          Download Image
        </button>
      </div>

      {/* CARD */}
      <div
        ref={cardRef}
        className="w-[400px] aspect-square relative overflow-hidden rounded-2xl flex items-center justify-center"
        style={{
          background:
            template === "blue"
              ? "#3b82f6"
              : template === "green"
              ? "#22c55e"
              : template === "dark"
              ? "#111827"
              : template === "gradient"
              ? "linear-gradient(135deg,#667eea,#764ba2)"
              : "#ffffff",
        }}
      >
        {/* BACKGROUND IMAGE (optional override) */}
        {bgImage && (
          <img
            src={bgImage}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* CONTENT CARD */}
        <div className="relative z-10 bg-white/90 rounded-2xl p-4 w-[85%]">

          {/* HEADER */}
          <div className="flex items-center gap-3">

            {/* PROFILE PIC */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
              {profilePic && (
                <img
                  src={profilePic}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* NAME + BADGE */}
            <div className="flex items-center gap-2">
              <p className="font-bold">{name}</p>

              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✔</span>
              </div>
            </div>
          </div>

          {/* QUOTE */}
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-line">
            {quote}
          </p>

        </div>
      </div>
    </div>
  );
}
