import { useState } from "react";
import { FaImage, FaVideo, FaPaperPlane } from "react-icons/fa";

export default function Home() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⚠️ Replace with your real values
  const PAGE_ID = "YOUR_PAGE_ID";
  const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";

  const handlePost = async () => {
    if (!message && !file) {
      alert("Shyiramo message cyangwa file");
      return;
    }

    setLoading(true);

    try {
      let url = "";
      let formData = new FormData();

      if (file) {
        if (file.type.startsWith("image")) {
          url = `https://graph.facebook.com/${PAGE_ID}/photos`;
          formData.append("source", file);
        } else if (file.type.startsWith("video")) {
          url = `https://graph.facebook.com/${PAGE_ID}/videos`;
          formData.append("source", file);
        }
      } else {
        url = `https://graph.facebook.com/${PAGE_ID}/feed`;
      }

      formData.append("message", message);
      formData.append("access_token", ACCESS_TOKEN);

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error.message);
      } else {
        alert("Byoherejwe neza 🚀");
        setMessage("");
        setFile(null);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg p-6 rounded-2xl shadow-xl border border-gray-300 dark:border-gray-700 bg-[var(--background)]">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Facebook Auto Poster
        </h1>

        {/* Textarea */}
        <textarea
          placeholder="Andika message yawe hano..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-28 p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent outline-none resize-none"
        />

        {/* File Upload */}
        <label className="flex items-center justify-between mt-4 p-3 rounded-xl border border-dashed border-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <span className="flex items-center gap-2 text-sm">
            {file ? file.name : "Hitamo ifoto cyangwa video"}
          </span>

          <div className="flex gap-3 text-lg">
            <FaImage />
            <FaVideo />
          </div>

          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Button */}
        <button
          onClick={handlePost}
          disabled={loading}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FaPaperPlane />
          {loading ? "Birimo kohereza..." : "Post kuri Facebook"}
        </button>
      </div>
    </div>
  );
}
