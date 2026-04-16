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

  // ✅ wait images fully loaded
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

  const downloadImage = async () => {
    if (!cardRef.current) return;

    const domtoimage = (await import("dom-to-image-more")).default;

    await waitImages(cardRef.current);

    const scale = 3; // 🔥 HD EXPORT

    const dataUrl = await domtoimage.toPng(cardRef.current, {
      cacheBust: true,
      bgcolor: null,
      width: cardRef.current.offsetWidth * scale,
      height: cardRef.current.offsetHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: cardRef.current.offsetWidth + "px",
        height: cardRef.current.offsetHeight + "px",
      },
    });

    const link = document.createElement("a");
    link.download = "quote-hd.png";
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
          Download HD Image
        </button>
      </div>

      {/* CARD (IMPORTANT: fixed design = no responsive chaos) */}
      <div
        ref={cardRef}
        className="w-[400px] h-[400px] relative overflow-hidden bg-white rounded-2xl flex items-center justify-center"
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
        <div className="relative z-10 bg-white/90 rounded-2xl p-4 w-[85%]">

          {/* HEADER */}
          <div className="flex items-center gap-3">

            {/* PROFILE */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              {image && (
                <img
                  src={image}
                  alt="profile"
                  className="w-full h-full object-cover border-0 outline-none"
                />
              )}
            </div>

            {/* NAME + BADGE */}
            <div className="flex items-center gap-2">

              <p className="font-bold text-sm border-0 outline-none">
                {name || "Anonymous"}
              </p>

              {/* FIXED BADGE (NO BORDER ARTIFACTS) */}
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs border-0 shadow-none">
                ✔
              </span>
            </div>
          </div>

          {/* QUOTE */}
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-line border-0">
            {quote || "Andika quote yawe hano..."}
          </p>

        </div>
      </div>
    </div>
  );
}
