"use client";

import { useRef, useState } from "react";

export default function Home() {
  const cardRef = useRef(null);

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  // 👇 wait images fully load (IMPORTANT FIX)
  const waitForImages = async (element) => {
    const images = element.querySelectorAll("img");

    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((res) => {
          img.onload = img.onerror = res;
        });
      })
    );
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;

    const domtoimage = (await import("dom-to-image-more")).default;

    // 🔥 wait for layout stability
    await waitForImages(cardRef.current);

    const dataUrl = await domtoimage.toPng(cardRef.current, {
      cacheBust: true,
      bgcolor: null,
      style: {
        transform: "scale(1)",
      },
    });

    const link = document.createElement("a");
    link.download = "quote-card.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">

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
        className="w-[400px] aspect-square relative overflow-hidden rounded-2xl flex items-center justify-center bg-white"
      >

        {/* BACKGROUND */}
        <img
          src="/logo.png"
          alt="bg"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        {/* CONTENT */}
        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-4 w-[85%] z-10">

          {/* HEADER */}
          <div className="flex items-center gap-3">

            {/* PROFILE PIC */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              {image && (
                <img
                  src={image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* NAME + BADGE (FIXED ALIGNMENT) */}
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm">
                {name || "Anonymous"}
              </p>

              {/* VERIFIED BADGE ALWAYS INSIDE FLOW */}
              <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                ✔
              </span>
            </div>
          </div>

          {/* QUOTE */}
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-line">
            {quote || "Andika quote yawe hano..."}
          </p>

        </div>
      </div>
    </div>
  );
}
