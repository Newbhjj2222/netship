// pages/member.js
import { db } from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import cookie from "cookie";
import { FaUser, FaUserTie, FaHandsHelping, FaWhatsapp } from "react-icons/fa";
import styles from "../styles/member.module.css";

export async function getServerSideProps({ req }) {
  // ===== PARSE COOKIES =====
  const cookies = req.headers.cookie || "";
  const parsedCookies = cookie.parse(cookies);
  const userCookie = parsedCookies.user ? JSON.parse(parsedCookies.user) : null;

  if (!userCookie) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const username = userCookie.username;

  // ===== CHECK ROLES =====
  const roles = ["member", "umujyanama", "umuterankunga"];
  let roleData = {};

  for (let role of roles) {
    const q = query(collection(db, role + "s"), where("username", "==", username));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data();
      // check membership expiry if role is member
      if (role === "member") {
        const now = new Date();
        const expires = data.subscriptionExpiresAt?.toDate?.() || new Date(0);
        data.active = data.isMember && expires > now;
      } else {
        data.active = true; // umujyanama & umuterankunga always active
      }
      roleData[role] = data;
    } else {
      roleData[role] = { active: false };
    }
  }

  return { props: { username, roleData } };
}

export default function MemberPage({ username, roleData }) {
  const goWhatsApp = (role) => {
    if (typeof window !== "undefined") {
      const number = "250722319367";
      const message = `Muraho, ndifuza ubufasha ku bijyanye na ${role}.`;
      const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }
  };

  const roles = [
    {
      key: "member",
      label: "Membership",
      icon: <FaUser />,
    },
    {
      key: "umujyanama",
      label: "Umujyanama",
      icon: <FaUserTie />,
    },
    {
      key: "umuterankunga",
      label: "Umuterankunga",
      icon: <FaHandsHelping />,
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Profile ya {username}</h1>

      <div className={styles.cardsWrapper}>
        {roles.map((role) => {
          const data = roleData[role.key] || { active: false };
          const isActive = data.active;
          return (
            <div key={role.key} className={styles.card}>
              <div className={styles.icon}>{role.icon}</div>
              <h2>{role.label}</h2>
              <span className={isActive ? styles.activeBadge : styles.nonActiveBadge}>
                {isActive ? "Active" : "Non-Active"}
              </span>

              {/* Membership dates */}
              {role.key === "member" && data.subscriptionExpiresAt?.toDate && (
                <p>
                  Igihe izarangirira: {data.subscriptionExpiresAt.toDate().toLocaleDateString()}
                </p>
              )}

              <button onClick={() => goWhatsApp(role.label)} className={styles.whatsappBtn}>
                <FaWhatsapp /> Twandikire
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
