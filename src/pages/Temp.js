"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const cardRef = useRef(null);

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const handlePreview = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);

    // show preview area first (hidden -> visible)
    setShowPreview(true);

    // wait render + images
    await new Promise((r) => setTimeout(r, 300));
    await waitImages(cardRef.current);

    const canvas = await html2canvas(cardRef.current, {
      scale: 3, // 🔥 HD+
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
    });

    const dataUrl = canvas.toDataURL("image/png");

    // auto download after preview render
    const link = document.createElement("a");
    link.download = "quote-hd.png";
    link.href = dataUrl;
    link.click();

    setIsExporting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 gap-4">

      {/* INSTRUCTIONS */}
      <div className="w-full max-w-md bg-black text-white p-3 rounded-xl text-sm text-center">
        Click PREVIEW → then image will generate in HD and auto-download.
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

        {/* ONLY PREVIEW BUTTON */}
        <button
          onClick={handlePreview}
          disabled={isExporting}
          className="p-3 bg-black text-white rounded-xl disabled:opacity-50"
        >
          {isExporting ? "Generating HD..." : "Preview & Download"}
        </button>
      </div>

      {/* PREVIEW AREA (HIDDEN UNTIL CLICK) */}
      <div
        className={`w-full flex justify-center transition-all duration-300 ${
          showPreview ? "opacity-100" : "opacity-0 pointer-events-none h-0"
        }`}
      >
        <div
          ref={cardRef}
          className="w-[350px] sm:w-[400px] aspect-square relative overflow-hidden rounded-2xl flex items-center justify-center bg-white"
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

              {/* PROFILE */}
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

                {/* VERIFIED BADGE */}
                <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                  ✔
                </span>

              </div>
            </div>

            {/* QUOTE */}
            <p className="mt-4 text-sm sm:text-base whitespace-pre-line leading-relaxed">
              {quote || "Andika quote yawe hano..."}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
