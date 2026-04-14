import { db } from "../components/firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "../styles/app.module.css";
import { FaStar, FaDownload } from "react-icons/fa";

export async function getServerSideProps() {
  const querySnapshot = await getDocs(collection(db, "apps"));

  const apps = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: { apps },
  };
}

export default function App({ apps }) {
  const handleInstall = (apk) => {
    window.open(apk, "_blank");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>App Store</h1>

      <div className={styles.grid}>
        {apps.map((app) => (
          <div key={app.id} className={styles.card}>
            <img src={app.image} className={styles.image} />

            <div className={styles.content}>
              <h2>{app.name}</h2>

              <div className={styles.meta}>
                <span>
                  <FaStar /> {app.rating}
                </span>
                <span>{app.installs}</span>
              </div>

              <button
                className={styles.btn}
                onClick={() => handleInstall(app.apk)}
              >
                <FaDownload /> Install
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
