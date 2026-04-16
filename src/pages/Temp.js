import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase";

/* CLOUDINARY */
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Newtalents");
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

export default function Home() {
  const router = useRouter();

  const [quote, setQuote] = useState("");
  const [file, setFile] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const username = Cookies.get("username") || "Anonymous";

  const handleGenerate = async () => {
    if (!file || !quote) return alert("Fill everything");

    setLoading(true);

    // upload image
    const imageUrl = await uploadToCloudinary(file);

    // save to firestore
    const docRef = await addDoc(collection(db, "quotes"), {
      username,
      quote,
      profilePic: imageUrl,
      createdAt: serverTimestamp(),
    });

    setSavedId(docRef.id);
    setLoading(false);
  };

  const goToPreview = () => {
    router.push(`/preview/${savedId}`);
  };

  return (
    <div style={{ marginTop: "80px" }} className="p-4 flex flex-col items-center gap-4">

      <textarea
        placeholder="Andika quote..."
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        className="p-3 border rounded-xl w-full max-w-md"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {!savedId ? (
        <button
          onClick={handleGenerate}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          {loading ? "Processing..." : "Generate"}
        </button>
      ) : (
        <button
          onClick={goToPreview}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Review Template
        </button>
      )}
    </div>
  );
}
