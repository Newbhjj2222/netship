import { useRef, useState } from "react";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import Cookies from "js-cookie";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase";

/* =========================
   🟢 CLOUDINARY FUNCTION (AS YOU PROVIDED)
========================= */
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Newtalents"); // replace na preset yawe niba itandukanye
  formData.append("cloud_name", "dilowy3fd");

  const endpoint =
    "https://api.cloudinary.com/v1_1/dilowy3fd/image/upload";

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};

/* =========================
   FIRESTORE SAVE (quotes)
========================= */
const saveQuote = async (payload) => {
  const docRef = await addDoc(collection(db, "quotes"), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export default function Home() {
  const cardRef = useRef(null);
  const router = useRouter();

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState(null);
  const [template, setTemplate] = useState("logo.png");

  /* =========================
     COOKIE USERNAME
  ========================= */
  const cookieUsername = Cookies.get("username");
  const finalUsername = cookieUsername || name || "Anonymous";

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  /* =========================
     EXPORT FLOW
  ========================= */
  const exportQuote = async () => {
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
    });

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    const file = new File([blob], "quote.png", {
      type: "image/png",
    });

    // 1. upload to cloudinary
    const imageUrl = await uploadToCloudinary(file);

    // 2. save to firestore (quotes collection)
    const id = await saveQuote({
      username: finalUsername,
      quote,
      imageUrl,
      template,
    });

    // 3. redirect to export page
    router.push(`/export/${id}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 gap-5"
      style={{ marginTop: "80px" }}
    >

      {/* USERNAME INPUT (only if cookie missing) */}
      {!cookieUsername && (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Andika izina..."
          className="p-3 border rounded-xl w-full max-w-md"
        />
      )}

      {/* TEMPLATE SELECT */}
      <select
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        className="p-3 border rounded-xl w-full max-w-md"
      >
        <option value="logo.png">Draft (Default)</option>
        <option value="blue.png">Blue Template</option>
        <option value="green.png">Green Template</option>
        <option value="dark.png">Dark Template</option>
      </select>

      {/* QUOTE */}
      <textarea
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder="Andika quote..."
        className="p-3 border rounded-xl w-full max-w-md h-24"
      />

      {/* IMAGE UPLOAD */}
      <input type="file" accept="image/*" onChange={handleImage} />

      {/* PREVIEW CARD */}
      <div
        ref={cardRef}
        className="w-[400px] aspect-square relative overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        {/* TEMPLATE BACKGROUND */}
        <img
          src={`/${template}`}
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        {/* CONTENT */}
        <div className="relative z-10 bg-white/90 p-4 w-[85%] mx-auto mt-10 rounded-xl">

          <p className="font-bold text-black">
            {finalUsername}
          </p>

          <p className="mt-3 text-sm text-black whitespace-pre-line">
            {quote || "Andika quote yawe hano..."}
          </p>

        </div>
      </div>

      {/* EXPORT BUTTON */}
      <button
        onClick={exportQuote}
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Export Image
      </button>

    </div>
  );
}
