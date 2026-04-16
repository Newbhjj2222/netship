import { useRef } from "react";
import html2canvas from "html2canvas";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebase";
import { FaUserCircle } from "react-icons/fa";

/* =========================
   COMPONENT
========================= */
export default function Preview({ data }) {
  const cardRef = useRef(null);

  /* wait images (important for logo) */
  const waitImages = async (el) => {
    const imgs = el.querySelectorAll("img");

    await Promise.all(
      [...imgs].map((img) => {
        if (img.complete) return;
        return new Promise((res) => {
          img.onload = res;
          img.onerror = res;
        });
      })
    );
  };

  /* DOWNLOAD */
  const downloadImage = async () => {
    try {
      const el = cardRef.current;
      if (!el) return;

      await waitImages(el);
      await new Promise((r) => setTimeout(r, 150));

      const canvas = await html2canvas(el, {
        useCORS: true,
        scale: 3,
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "netboard.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  if (!data) {
    return <div className="p-10">No data</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-6">

      {/* TEMPLATE */}
      <div
        ref={cardRef}
        className="w-full max-w-[420px] aspect-square relative rounded-2xl overflow-hidden bg-white shadow-md"
      >
        {/* BACKGROUND */}
        <img
          src="/logo.png"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* SIMPLE OVERLAY (light) */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* CARD */}
        <div className="relative z-10 bg-white/95 rounded-2xl p-4 w-[85%] mx-auto mt-10">

          {/* HEADER */}
          <div className="flex items-center gap-3">

            {/* ICON PROFILE */}
            <div className="text-gray-600">
              <FaUserCircle size={42} />
            </div>

            {/* NAME + BADGE */}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-black text-sm sm:text-base">
                {data.username}
              </p>

              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✔</span>
              </div>
            </div>
          </div>

          {/* QUOTE */}
          <p className="mt-4 text-sm sm:text-base text-black whitespace-pre-line leading-relaxed">
            {data.quote}
          </p>

          {/* WATERMARK */}
          <p className="mt-6 text-red-500 text-xs">
            NetBoard
          </p>
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadImage}
        className="bg-black text-white px-6 py-3 rounded-xl w-full max-w-[420px]"
      >
        Download PNG
      </button>

    </div>
  );
}

/* =========================
   SSR
========================= */
export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const snap = await getDoc(doc(db, "quotes", id));

    if (!snap.exists()) {
      return { props: { data: null } };
    }

    return {
      props: {
        data: JSON.parse(JSON.stringify(snap.data())),
      },
    };
  } catch (e) {
    return { props: { data: null } };
  }
}
