// pages/profile.js
import { db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import cookie from "cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { FaSignOutAlt, FaUser, FaIdBadge } from "react-icons/fa";
import styles from "./profile.module.css";

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const userCookie = cookies.user ? JSON.parse(cookies.user) : null;

  if (!userCookie) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const uid = userCookie.uid;

  // Get membership info
  const memberSnap = await getDoc(doc(db, "members", uid));
  const memberData = memberSnap.exists() ? memberSnap.data() : null;

  return {
    props: {
      user: userCookie,
      memberData: memberData || null,
    },
  };
}

export default function ProfilePage({ user, memberData }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("user");
    router.replace("/login");
  };

  const isMember =
    memberData && memberData.isMember && memberData.subscriptionExpiresAt
      ? new Date(memberData.subscriptionExpiresAt.toDate()) > new Date()
      : false;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <FaUser size={40} />
          <h2>{user.username}</h2>
          {isMember && (
            <span className={styles.badge}>
              <FaIdBadge /> Member
            </span>
          )}
        </div>

        <div className={styles.info}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>UID:</strong> {user.uid}</p>
          {memberData && memberData.subscriptionExpiresAt && (
            <p>
              <strong>Membership expires:</strong>{" "}
              {new Date(memberData.subscriptionExpiresAt.toDate()).toLocaleDateString()}
            </p>
          )}
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}
