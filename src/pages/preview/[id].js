import { useRef } from "react";
import html2canvas from "html2canvas";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../components/firebase";

export default function Preview({ data }) {
  const cardRef = useRef(null);

  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current, {
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">

      {/* TEMPLATE */}
      <div
        ref={cardRef}
        className="w-[320px] sm:w-[420px] aspect-square relative rounded-2xl overflow-hidden"
      >
        {/* BACKGROUND */}
        <img
          src="/logo.png"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* CARD */}
        <div className="relative z-10 bg-white/90 rounded-2xl p-4 w-[85%] mx-auto mt-10">

          {/* HEADER */}
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={data.profilePic}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2">
              <p className="font-bold text-black text-sm sm:text-base">
                {data.username}
              </p>

              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
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

/* =========================
   SSR FETCH
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
        data: snap.data(),
      },
    };
  } catch (e) {
    return { props: { data: null } };
  }
}
