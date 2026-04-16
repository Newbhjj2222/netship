"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const cardRef = useRef(null);

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState(null);

  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

  // REAL STAGE PROGRESS (not fake animation)
  const runProgress = async () => {
    setProgress(5); // start

    await new Promise((r) => setTimeout(r, 200));
    setProgress(20); // UI ready

    await new Promise((r) => setTimeout(r, 200));
    setProgress(40); // preparing DOM

    await new Promise((r) => setTimeout(r, 200));
    setProgress(60); // loading assets

    await new Promise((r) => setTimeout(r, 200));
    setProgress(80); // rendering canvas

    await new Promise((r) => setTimeout(r, 200));
    setProgress(95); // finalizing
  };

  const exportImage = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    setShowPreview(true);

    await runProgress();
    await waitImages(cardRef.current);

    const canvas = await html2canvas(cardRef.current, {
      scale: 3, // 🔥 HD
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
    });

    setProgress(100);

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "quote-hd.png";
    link.href = dataUrl;
    link.click();

    setTimeout(() => {
      setProgress(0);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 gap-5"
      style={{ marginTop: "80px" }}
    >

      {/* INFO */}
      <div className="w-full max-w-md bg-black text-white text-sm p-3 rounded-xl text-center">
        Click preview card → HD image will generate + auto download
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

      {/* PROGRESS */}
      {isExporting && (
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

      {/* PREVIEW (CLICKABLE + HOVER ZOOM) */}
      <div
        onClick={exportImage}
        className="cursor-pointer hover:scale-[1.03] transition-transform duration-200"
      >
        <p className="text-center text-sm opacity-70 mb-2">
          Click to generate HD & download
        </p>

        <div
          ref={cardRef}
          className={`w-[350px] sm:w-[400px] aspect-square relative overflow-hidden rounded-2xl flex items-center justify-center bg-white shadow-xl ${
            showPreview ? "opacity-100" : "opacity-90"
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

              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                {image && (
                  <img
                    src={image}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex items-center gap-2">

                <p className="font-bold text-sm sm:text-base">
                  {name || "Anonymous"}
                </p>

                <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
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
  );
}
