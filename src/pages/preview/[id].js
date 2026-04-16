import { useRef } from "react";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebase";
import html2canvas from "html2canvas";

/* =========================
   SSR
========================= */
export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const ref = doc(db, "quotes", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return { notFound: true };
    }

    return {
      props: {
        data: JSON.parse(JSON.stringify(snap.data())),
      },
    };
  } catch (e) {
    return { notFound: true };
  }
}

/* =========================
   COMPONENT
========================= */
export default function Preview({ data }) {
  const cardRef = useRef(null);

  /* wait images */
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

  /* download */
  const downloadImage = async () => {
    const el = cardRef.current;
    if (!el) return;

    await waitImages(el);

    const canvas = await html2canvas(el, {
      useCORS: true,
      scale: 3,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = "netboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!data) {
    return <div className="p-10">No data</div>;
  }

  return (
    <>
      <Head>
        <title>NetBoard Preview</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 gap-6">

        {/* TEMPLATE */}
        <div
          ref={cardRef}
          className="w-full max-w-[420px] aspect-square bg-white rounded-2xl overflow-hidden shadow-md"
        >
          {/* BACKGROUND */}
          <img
            src="/logo.png"
            crossOrigin="anonymous"
            className="w-full h-[40%] object-cover"
          />

          {/* CONTENT */}
          <div className="p-4 flex flex-col h-[60%] justify-between">

            {/* HEADER */}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-black text-sm sm:text-base">
                {data.username}
              </p>

              <span className="bg-blue-500 text-white text-[10px] sm:text-xs px-1.5 py-[2px] rounded-full">
                ✔
              </span>
            </div>

            {/* QUOTE */}
            <p className="text-black text-sm sm:text-base leading-relaxed whitespace-pre-line mt-3">
              {data.quote}
            </p>

            {/* WATERMARK */}
            <p className="text-red-500 text-xs mt-4">
              NetBoard
            </p>

          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={downloadImage}
          className="bg-black text-white px-6 py-3 rounded-xl w-full max-w-[420px]"
        >
          Download Image
        </button>

      </div>
    </>
  );
}
