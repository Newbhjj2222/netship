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

  /* =========================
     WAIT IMAGES
  ========================= */
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

  /* =========================
     DOWNLOAD
  ========================= */
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
        <title>Preview</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">

        {/* CARD */}
        <div
          id="card"
          ref={cardRef}
          className="w-[350px] sm:w-[420px] aspect-square bg-white rounded-2xl overflow-hidden shadow-lg"
        >
          {/* BACKGROUND */}
          <img
            src="/logo.png"
            crossOrigin="anonymous"
            className="w-full h-[40%] object-cover"
          />

          {/* CONTENT */}
          <div className="p-4">

            {/* HEADER */}
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                <img
                  src={data.profilePic}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <p className="font-bold text-black">
                  {data.username}
                </p>

                <span className="bg-blue-500 text-white text-xs px-1 rounded">
                  ✔
                </span>
              </div>
            </div>

            {/* QUOTE */}
            <p className="mt-4 text-black text-sm whitespace-pre-line">
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
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Download Image
        </button>

      </div>
    </>
  );
}
