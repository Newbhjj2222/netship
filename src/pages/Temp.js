"use client";
import { useRef, useState } from "react";

export default function Home() {
  const cardRef = useRef(null);

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState(null);

  const downloadImage = async () => {
    if (!cardRef.current) return;

    // 👇 import ONLY in browser
    const domtoimage = (await import("dom-to-image-more")).default;

    const dataUrl = await domtoimage.toPng(cardRef.current, {
      cacheBust: true,
      bgcolor: null,
    });

    const link = document.createElement("a");
    link.download = "quote.png";
    link.href = dataUrl;
    link.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">

      <div className="w-full max-w-md flex flex-col gap-3">
        <input
          placeholder="Andika izina..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border rounded"
        />

        <textarea
          placeholder="Quote..."
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="p-3 border rounded h-24"
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <button onClick={downloadImage} className="bg-black text-white p-3 rounded">
          Download
        </button>
      </div>

      <div
        ref={cardRef}
        className="w-full max-w-md aspect-square relative rounded-2xl overflow-hidden flex items-center justify-center"
      >
        <img src="/logo.png" className="absolute w-full h-full object-cover" />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative bg-white/90 p-4 rounded-xl w-[85%]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
              {image && <img src={image} className="w-full h-full object-cover" />}
            </div>

            <p className="font-bold">{name || "Anonymous"}</p>
          </div>

          <p className="mt-4">{quote || "..."}</p>
        </div>
      </div>
    </div>
  );
}
