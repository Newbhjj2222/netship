// pages/profile.js
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import cookie from "cookie";
import { FiUser, FiMail, FiLogOut } from "react-icons/fi";
import styles from "../styles/profile.module.css";
import ThemeSwitcher from "../components/ThemeSwitcher";

// ===== SSR =====
export async function getServerSideProps({ req }) {
  // parse cookies safely
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const userCookie = cookies.user ? JSON.parse(cookies.user) : null;

  // redirect if no cookie
  if (!userCookie) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  // fallback to avoid undefined
  const safeUser = {
    username: userCookie.username || "User",
    email: userCookie.email || "no-email@example.com",
    uid: userCookie.uid || "N/A",
  };

  return {
    props: { user: safeUser },
  };
}

// ===== COMPONENT =====
export default function ProfilePage({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("user");
    router.replace("/login");
  };

  return (
    <>
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <FiUser size={40} />
          <h2>{user.username}</h2>
        </div>

        <div className={styles.info}>
          <p>
            <FiMail /> <strong>Email:</strong> {user.email}
          </p>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <FiLogOut /> Logout
        </button>
      </div>
    <ThemeSwitcher />
    </div>
    
    </>
  );
}
