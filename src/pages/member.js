// pages/member.js
import { db } from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import cookie from "cookie";
import { FaUser, FaUserTie, FaHandsHelping, FaWhatsapp } from "react-icons/fa";
import styles from "../styles/member.module.css";

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie || "";
  const parsedCookies = cookie.parse(cookies);
  const userCookie = parsedCookies.user ? JSON.parse(parsedCookies.user) : null;

  if (!userCookie) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const username = userCookie.username;

  // ===== CHECK ROLES IN DATABASE =====
  const roles = ["member", "umujyanama", "umuterankunga"];
  let roleData = {};

  for (let role of roles) {
    const q = query(collection(db, role + "s"), where("username", "==", username));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const data = snap.docs[0].data();
      // For members, check if subscription is still active
      if (role === "member") {
        const expires = data.subscriptionExpiresAt?.toDate?.() || new Date(0);
        const now = new Date();
        roleData[role] = {
          ...data,
          active: data.isMember && expires >= now,
          expires,
        };
      } else {
        // Umujyanama or Umuterankunga are active if they exist
        roleData[role] = { ...data, active: true };
      }
    } else {
      roleData[role] = { active: false };
    }
  }

  return { props: { username, roleData } };
}

export default function MemberPage({ username, roleData }) {
  const goWhatsApp = (role) => {
    const number = "250722319367";
    const message = `Muraho, ndifuza ubufasha ku bijyanye na ${role}.`;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const roles = [
    { key: "member", label: "Membership", icon: <FaUser size={40} /> },
    { key: "umujyanama", label: "Umujyanama", icon: <FaUserTie size={40} /> },
    { key: "umuterankunga", label: "Umuterankunga", icon: <FaHandsHelping size={40} /> },
  ];

  return (
    <div className={styles.container}>
      <h1>Profile ya {username}</h1>
      <div className={styles.cardsWrapper}>
        {roles.map((role) => {
          const data = roleData[role.key];
          return (
            <div key={role.key} className={styles.card}>
              <div className={styles.icon}>{role.icon}</div>
              <h2>{role.label}</h2>

              <p className={data.active ? styles.activeBadge : styles.nonActiveBadge}>
                {data.active ? "Active" : "Non-Active"}
              </p>

              {/* Membership expiration date */}
              {role.key === "member" && data.active && data.expires && (
                <p className={styles.dates}>
                  Igihe izarangirira: {data.expires.toLocaleDateString()}
                </p>
              )}

              <button
                className={styles.whatsappBtn}
                onClick={() => goWhatsApp(role.label)}
              >
                <FaWhatsapp /> Twandikire
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
