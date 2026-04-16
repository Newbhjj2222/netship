import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebase";

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

  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = "template.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">

      <div
        ref={cardRef}
        className="w-[400px] aspect-square relative rounded-2xl overflow-hidden"
      >
        {/* BACKGROUND */}
        <img
          src="/logo.png"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        {/* CARD */}
        <div className="relative z-10 bg-white/90 p-4 w-[85%] mx-auto mt-10 rounded-xl">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img src={data.profilePic} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-2">
              <p className="font-bold">{data.username}</p>

              <span className="w-5 h-5 bg-blue-500 text-white text-xs flex items-center justify-center rounded-full">
                ✔
              </span>
            </div>

          </div>

          <p className="mt-4">{data.quote}</p>

          {/* WATERMARK */}
          <p className="mt-4 text-red-500 text-xs">NetBoard</p>

        </div>
      </div>

      <button
        onClick={downloadImage}
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Download
      </button>
    </div>
  );
}
