import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebaseClient";

export default function Preview() {
  const router = useRouter();
  const { id } = router.query;
  const cardRef = useRef(null);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const snap = await getDoc(doc(db, "quotes", id));
      if (snap.exists()) setData(snap.data());
    };

    fetchData();
  }, [id]);

  /* =========================
     SVG DOWNLOAD (NO html2canvas)
  ========================= */
  const downloadImage = async () => {
    const node = cardRef.current;
    if (!node) return;

    const html = node.outerHTML;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080">
        <foreignObject width="100%" height="100%">
          ${new XMLSerializer().serializeToString(node)}
        </foreignObject>
      </svg>
    `;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const png = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = "netboard.png";
      link.href = png;
      link.click();

      URL.revokeObjectURL(url);
    };
  };

  if (!data) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">

      {/* TEMPLATE */}
      <div
        ref={cardRef}
        className="w-[320px] sm:w-[400px] aspect-square relative rounded-2xl overflow-hidden"
      >
        {/* BACKGROUND */}
        <img
          src="/logo.png"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* CARD */}
        <div className="relative z-10 bg-white/90 rounded-2xl p-4 w-[85%] mx-auto mt-10">

          {/* HEADER */}
          <div className="flex items-center gap-3">

            {/* PROFILE */}
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={data.profilePic}
                className="w-full h-full object-cover"
              />
            </div>

            {/* NAME + BADGE */}
            <div className="flex items-center gap-2">
              <p className="font-bold text-black text-sm sm:text-base">
                {data.username}
              </p>

              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs">✔</span>
              </div>
            </div>
          </div>

          {/* QUOTE */}
          <p className="mt-4 text-sm sm:text-base text-black whitespace-pre-line">
            {data.quote}
          </p>

          {/* WATERMARK */}
          <p className="mt-5 text-red-500 text-xs">
            NetBoard
          </p>
        </div>
      </div>

      {/* DOWNLOAD */}
      <button
        onClick={downloadImage}
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Download Image
      </button>
    </div>
  );
}
