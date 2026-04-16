"use client";

import { useRef, useState } from "react";

export default function Home() {
  const cardRef = useRef(null);

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;

    // 👇 dynamic import to avoid Vercel SSR crash
    const domtoimage = (await import("dom-to-image-more")).default;

    const dataUrl = await domtoimage.toPng(cardRef.current, {
      cacheBust: true,
      bgcolor: null,
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
          type="text"
          placeholder="Andika izina..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border rounded-xl"
        />

        <textarea
          placeholder="Andika quote..."
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="p-3 border rounded-xl h-24"
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <button
          onClick={downloadImage}
          className="p-3 bg-black text-white rounded-xl"
        >
          Download Image
        </button>
      </div>

      {/* CARD */}
      <div
        ref={cardRef}
        className="w-full max-w-md aspect-square relative overflow-hidden rounded-2xl flex items-center justify-center"
      >
        {/* BACKGROUND */}
        <img
          src="/logo.png"
          alt="bg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* CONTENT */}
        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-4 w-[85%]">

          {/* HEADER */}
          <div className="flex items-center gap-3">

            {/* PROFILE IMAGE */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              {image && (
                <img
                  src={image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* NAME + BADGE */}
            <div className="flex items-center gap-2">

              <p className="font-bold text-sm sm:text-base">
                {name || "Anonymous"}
              </p>

              {/* VERIFICATION BADGE */}
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs">✔</span>
              </div>

            </div>
          </div>

          {/* QUOTE */}
          <p className="mt-4 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {quote || "Andika quote yawe hano..."}
          </p>

        </div>
      </div>
    </div>
  );
}
