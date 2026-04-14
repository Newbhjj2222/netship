import { useEffect, useState } from "react";
import { FaStar, FaDownload } from "react-icons/fa";

export default function App() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      setApps([
        {
          name: "Netship",
          apk: "https://apk.e-droid.net/apk/app3971751-61pg0y.apk?v=5",
          image: "https://via.placeholder.com/400x250?text=App+Preview",
          rating: 4.5,
          installs: "38K+",
        },
      ]);
    };

    fetchApps();
  }, []);

  const handleInstall = (apk) => {
    window.open(apk, "_blank");
  };

  return (
    <div className="container">
      <h1 className="title">App Store</h1>

      <div className="grid">
        {apps.map((app, index) => (
          <div key={index} className="card">
            <img src={app.image} className="image" alt="app" />

            <div className="content">
              <h2 className="appName">{app.name}</h2>

              <div className="meta">
                <span className="rating">
                  <FaStar /> {app.rating}
                </span>
                <span className="installs">{app.installs}</span>
              </div>

              <button
                className="btn"
                onClick={() => handleInstall(app.apk)}
              >
                <FaDownload /> Install
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 20px;
          background: var(--background);
          color: var(--foreground);
        }

        .title {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 25px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .card {
          border-radius: 18px;
          overflow: hidden;
          background: var(--background);
          border: 1px solid rgba(120, 120, 120, 0.2);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-6px) scale(1.01);
        }

        .image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .content {
          padding: 16px;
        }

        .appName {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 12px;
          opacity: 0.8;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 10px;
          background: #3b82f6;
          color: white;
          font-weight: 600;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .btn:hover {
          background: #2563eb;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 22px;
          }

          .image {
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
}
