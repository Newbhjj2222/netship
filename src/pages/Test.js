import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⚠️ Replace these with your real values
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

      // Decide type
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
        console.log(data.error);
        alert("Hari ikibazo: " + data.error.message);
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
    <div className="container">
      <h1>Facebook Auto Poster</h1>

      <textarea
        placeholder="Andika message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handlePost} disabled={loading}>
        {loading ? "Birimo kohereza..." : "Post"}
      </button>

      <style jsx>{`
        .container {
          max-width: 500px;
          margin: 50px auto;
          padding: 20px;
          background: #111;
          color: white;
          border-radius: 10px;
          text-align: center;
          font-family: Arial;
        }

        h1 {
          margin-bottom: 20px;
        }

        textarea {
          width: 100%;
          height: 100px;
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 5px;
          border: none;
        }

        input {
          margin-bottom: 10px;
        }

        button {
          width: 100%;
          padding: 10px;
          background: #1877f2;
          border: none;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background: #0f5dc1;
        }
      `}</style>
    </div>
  );
}
