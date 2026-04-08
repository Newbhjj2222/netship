// pages/profile.js
import { db } from "../components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import cookie from "cookie";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { FiLogOut, FiUser, FiAward } from "react-icons/fi";
import styles from "../styles/profile.module.css";

// ===== SSR =====
export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const userCookie = cookies.user ? JSON.parse(cookies.user) : null;

  // ❌ Nta user
  if (!userCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const username = userCookie.username || null;

  // ===== MEMBERSHIP CHECK (using username) =====
  const q = query(
    collection(db, "members"),
    where("username", "==", username)
  );

  const snap = await getDocs(q);

  let memberData = null;
  snap.forEach((doc) => {
    memberData = doc.data();
  });

  let isMember = false;
  let expiresAt = null;

  if (memberData) {
    expiresAt =
      memberData.subscriptionExpiresAt?.toDate?.() || null;

    if (memberData.isMember && expiresAt > new Date()) {
      isMember = true;
    }
  }

  return {
    props: {
      user: userCookie, // 🔥 TWOHEREZA DATA YOSE
      isMember,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    },
  };
}

// ===== COMPONENT =====
export default function ProfilePage({ user, isMember, expiresAt }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("user");
    router.replace("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>

        {/* HEADER */}
        <div className={styles.header}>
          <FiUser size={30} />
          <h2>
            {user.username || "User"}
            {isMember && (
              <span className={styles.badge}>
                <FiAward /> Member
              </span>
            )}
          </h2>
        </div>

        {/* USER INFO */}
        <div className={styles.info}>
          <p><strong>UID:</strong> {user.uid}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>

          {/* 🔥 SHOW ALL EXTRA DATA */}
          {Object.keys(user).map((key) => {
            if (["uid", "email", "username"].includes(key)) return null;

            return (
              <p key={key}>
                <strong>{key}:</strong> {String(user[key])}
              </p>
            );
          })}

          <p>
            <strong>Membership:</strong>{" "}
            {isMember ? (
              <span className={styles.badge}>
                Active
              </span>
            ) : (
              <span className={styles.inactive}>
                Not Active
              </span>
            )}
          </p>

          {expiresAt && (
            <p>
              <strong>Expires At:</strong>{" "}
              {new Date(expiresAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* ACTION */}
        <div className={styles.buttons}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FiLogOut /> Logout
          </button>
        </div>

      </div>
    </div>
  );
}
