// pages/profile.js
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import cookie from "cookie";
import styles from "../styles/profile.module.css";

// ===== SSR =====
export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const userCookie = cookies.user ? JSON.parse(cookies.user) : null;

  if (!userCookie) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  // Membership status from cookie if available
  const isMember = userCookie.isMember || false;

  return {
    props: {
      user: userCookie,
      isMember,
    },
  };
}

// ===== COMPONENT =====
export default function ProfilePage({ user, isMember }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("user");
    router.replace("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2>{user.username || "User"}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Membership:</strong>{" "}
          {isMember ? (
            <span className={styles.active}>Active</span>
          ) : (
            <span className={styles.inactive}>Not Active</span>
          )}
        </p>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}
