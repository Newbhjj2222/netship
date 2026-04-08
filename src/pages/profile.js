// pages/profile.js
import { db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import cookie from "cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FiLogOut, FiUser, FiAward } from "react-icons/fi";
import styles from "../styles/profile.module.css";

export async function getServerSideProps({ req }) {
  // 🔹 Parse cookies
  const cookies = cookie.parse(req.headers.cookie || "");
  const userCookie = cookies.user ? JSON.parse(cookies.user) : null;

  if (!userCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const uid = userCookie.uid;
  const username = userCookie.username || null;
  const email = userCookie.email || null;

  // 🔹 Check membership
  const memberSnap = await getDoc(doc(db, "members", uid));
  const isMember = memberSnap.exists() && memberSnap.data().isMember;

  return {
    props: {
      uid,
      username,
      email,
      isMember,
    },
  };
}

export default function ProfilePage({ uid, username, email, isMember }) {
  const router = useRouter();
  const [theme, setTheme] = useState("light");

  // 🔹 Apply theme to body safely
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const handleLogout = () => {
    Cookies.remove("user");
    router.replace("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <FiUser size={30} />
          <h2>{username || "User"}</h2>
        </div>

        <div className={styles.info}>
          <p><strong>Email:</strong> {email}</p>
          <p>
            <strong>Membership:</strong>{" "}
            {isMember ? (
              <span className={styles.badge}>
                <FiAward /> Active
              </span>
            ) : (
              "Inactive"
            )}
          </p>
        </div>

        <div className={styles.buttons}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FiLogOut /> Logout
          </button>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={styles.themeBtn}
          >
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>
      </div>
    </div>
  );
}
