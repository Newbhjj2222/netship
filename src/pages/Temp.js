"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const cardRef = useRef(null);

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  // wait images fully load
  const waitImages = async (el) => {
    const imgs = el.querySelectorAll("img");
    await Promise.all(
      [...imgs].map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            })
      )
    );
  };

  const simulateProgress = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 120);

    return interval;
  };

  const handlePreviewAndDownload = async () => {
    if (!cardRef.current) return;

    setLoading(true);
    setShowPreview(true);

    const interval = simulateProgress();

    await new Promise((r) => setTimeout(r, 300));
    await waitImages(cardRef.current);

    const canvas = await html2canvas(cardRef.current, {
      scale: 3, // 🔥 HD QUALITY
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
    });

    clearInterval(interval);
    setProgress(100);

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "quote-hd.png";
    link.href = dataUrl;
    link.click();

    setLoading(false);
    setTimeout(() => setProgress(0), 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 gap-5" style={{ marginTop: "80px" }}>

      {/* HEADER INFO */}
      <div className="w-full max-w-md bg-black text-white p-3 rounded-xl text-center text-sm">
        Click preview area → HD image izahita ikore download + progress %
      </div>

      {/* INPUTS */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Andika izina..."
          className="p-3 border rounded-xl"
        />

        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Andika quote..."
          className="p-3 border rounded-xl h-24"
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* PROGRESS BAR */}
      {loading && (
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm mt-1">{progress}%</p>
        </div>
      )}

      {/* PREVIEW BUTTON AREA (CLICKABLE + HOVER EFFECT) */}
      <div
        className="w-full flex justify-center"
      >
        <div
          onClick={handlePreviewAndDownload}
          className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
        >
          <p className="text-center text-sm mb-2 opacity-70">
            Click preview to generate HD image
          </p>

          {/* PREVIEW CARD */}
          <div
            ref={cardRef}
            className={`w-[350px] sm:w-[400px] aspect-square relative overflow-hidden rounded-2xl flex items-center justify-center bg-white shadow-xl transition-all duration-300 ${
              showPreview ? "opacity-100" : "opacity-0"
            }`}
          >

            {/* BACKGROUND */}
            <img
              src="/logo.png"
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />

            <div className="absolute inset-0 bg-black/40" />

            {/* CONTENT */}
            <div className="relative z-10 bg-white/90 rounded-2xl p-4 w-[85%]">

              {/* HEADER */}
              <div className="flex items-center gap-3">

                {/* PROFILE PIC */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                  {image && (
                    <img
                      src={image}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* NAME + BADGE */}
                <div className="flex items-center gap-2">

                  <p className="font-bold text-sm sm:text-base">
                    {name || "Anonymous"}
                  </p>

                  <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    ✔
                  </span>

                </div>
              </div>

              {/* QUOTE */}
              <p className="mt-4 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {quote || "Andika quote yawe hano..."}
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
