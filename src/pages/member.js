// pages/member.js
import { db } from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import cookie from "cookie";
import { FaUser, FaUserTie, FaHandsHelping, FaWhatsapp } from "react-icons/fa";
import styles from "../styles/member.module.css";

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? req.headers.cookie : "";
  const parsedCookies = cookie.parse(cookies);
  const userCookie = parsedCookies.user ? JSON.parse(parsedCookies.user) : null;

  if (!userCookie) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const username = userCookie.username;

  const roles = ["member", "umujyanama", "umuterankunga"];
  let roleData = {};

  for (let role of roles) {
    const q = query(collection(db, role + "s"), where("username", "==", username));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const data = snap.docs[0].data();

      if (role === "member") {
        const now = new Date();
        const expires = data.subscriptionExpiresAt
          ? data.subscriptionExpiresAt.toDate()
          : null;
        data.isActive = data.isMember && expires && expires > now;
        data.expiresAt = expires ? expires.toISOString() : null; // convert to string for SSR
      } else {
        data.isActive = true;
      }

      roleData[role] = data;
    } else {
      roleData[role] = { isActive: false, expiresAt: null };
    }
  }

  return { props: { username, roleData } };
}

export default function MemberPage({ username, roleData }) {
  const goWhatsApp = (roleLabel) => {
    if (typeof window === "undefined") return;
    const number = "250722319367";
    const message = `Muraho, ndifuza ubufasha ku bijyanye na ${roleLabel}.`;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const roles = [
    { key: "member", label: "Membership", icon: <FaUser /> },
    { key: "umujyanama", label: "Umujyanama", icon: <FaUserTie /> },
    { key: "umuterankunga", label: "Umuterankunga", icon: <FaHandsHelping /> },
  ];

  return (
    <div className={styles.container}>
      <h1>Profile ya {username}</h1>

      <div className={styles.cardsWrapper}>
        {roles.map((role) => {
          const data = roleData[role.key];
          const active = data?.isActive;

          // convert expiresAt back to Date for display
          const expiresDate = data?.expiresAt ? new Date(data.expiresAt) : null;

          return (
            <div key={role.key} className={styles.card}>
              <div className={styles.icon}>{role.icon}</div>
              <h2>{role.label}</h2>
              <span className={active ? styles.activeBadge : styles.nonActiveBadge}>
                {active ? "Active" : "Non-Active"}
              </span>

              {role.key === "member" && expiresDate && (
                <p>Igihe izarangirira: {expiresDate.toLocaleDateString()}</p>
              )}

              <button className={styles.whatsappBtn} onClick={() => goWhatsApp(role.label)}>
                <FaWhatsapp /> Twandikire
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
