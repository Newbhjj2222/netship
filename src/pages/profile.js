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

  // ❌ Ntari login
  if (!userCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const username = userCookie.username || null;
  const email = userCookie.email || null;

  // ===== CHECK MEMBERSHIP USING USERNAME =====
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

  if (memberData) {
    const expires =
      memberData.subscriptionExpiresAt?.toDate?.() || new Date(0);

    if (memberData.isMember && expires > new Date()) {
      isMember = true;
    }
  }

  return {
    props: {
      username,
      email,
      isMember,
    },
  };
}

// ===== COMPONENT =====
export default function ProfilePage({ username, email, isMember }) {
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
          <h2>{username || "User"}</h2>
        </div>

        {/* INFO */}
        <div className={styles.info}>
          <p>
            <strong>Email:</strong> {email || "N/A"}
          </p>

          <p>
            <strong>Membership:</strong>{" "}
            {isMember ? (
              <span className={styles.badge}>
                <FiAward /> Active
              </span>
            ) : (
              <span className={styles.inactive}>
                Not Active
              </span>
            )}
          </p>
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
