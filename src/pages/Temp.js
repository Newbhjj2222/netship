import { useRef, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const cardRef = useRef(null);
  const router = useRouter();

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState(null);
  const [template, setTemplate] = useState("logo.png");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const exportImage = async () => {
    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
    });

    const img = canvas.toDataURL("image/png");

    // pass image to next page
    sessionStorage.setItem("exportImage", img);

    router.push("/export");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 gap-5" style={{ marginTop: "80px" }}>

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

        {/* TEMPLATE */}
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="p-3 border rounded-xl"
        >
          <option value="logo.png">Default Template</option>
        </select>
      </div>

      {/* PREVIEW */}
      <div
        ref={cardRef}
        className="w-[350px] sm:w-[400px] aspect-square relative overflow-hidden rounded-2xl flex items-center justify-center bg-white shadow-xl"
      >

        {/* TEMPLATE BACKGROUND */}
        <img
          src={`/${template}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        {/* CONTENT */}
        <div className="relative z-10 bg-white/90 rounded-2xl p-4 w-[85%]">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
              {image && (
                <img src={image} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <p className="font-bold text-sm">
                {name || "Anonymous"}
              </p>

              <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                ✔
              </span>
            </div>

          </div>

          <p className="mt-4 text-sm whitespace-pre-line">
            {quote || "Andika quote yawe hano..."}
          </p>

        </div>
      </div>

      {/* EXPORT BUTTON */}
      <button
        onClick={exportImage}
        className="mt-3 bg-black text-white px-6 py-3 rounded-xl"
      >
        Export Image
      </button>

    </div>
  );
}
