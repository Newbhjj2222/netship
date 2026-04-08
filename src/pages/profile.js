// pages/profile.js
'use client';

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FiLogOut, FiUser, FiMail } from "react-icons/fi";
import styles from "../styles/profile.module.css";

export default function ProfilePage({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("user");
    router.replace("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <FiUser size={40} />
          <h2>{user.username || "User"}</h2>
        </div>

        <div className={styles.info}>
          <p>
            <FiMail /> <strong>Email:</strong> {user.email}
          </p>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}
