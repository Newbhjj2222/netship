"use client";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Home() {
  const cardRef = useRef();

  const [name, setName] = useState("NetalentsG");
  const [quote, setQuote] = useState(
    "Nta muntu utagira ibibazo mu buzima..."
  );
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement("a");
    link.download = "quote.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">

      {/* Inputs */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <input
          type="text"
          placeholder="Andika izina..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded-xl border"
        />

        <textarea
          placeholder="Andika quote..."
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="p-3 rounded-xl border h-24"
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <button
          onClick={downloadImage}
          className="p-3 rounded-xl bg-black text-white"
        >
          Download Image
        </button>
      </div>

      {/* Template */}
      <div
        ref={cardRef}
        className="w-full max-w-md aspect-square flex items-center justify-center rounded-2xl overflow-hidden relative"
        style={{
          backgroundImage: "url('/logo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* card */}
        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-4 w-[85%]">

          {/* header */}
          <div className="flex items-center gap-3">
            {/* profile */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
              {image && (
                <img
                  src={image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* name + badge */}
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm sm:text-base">{name}</p>

              {/* verified badge */}
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs">✔</span>
              </div>
            </div>
          </div>

          {/* quote */}
          <p className="mt-4 text-sm sm:text-base leading-relaxed">
            {quote}
          </p>
        </div>
      </div>
    </div>
  );
}
