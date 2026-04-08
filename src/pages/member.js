// pages/member.js
import { db } from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import cookie from "cookie";
import { FaUser, FaUserTie, FaHandsHelping, FaWhatsapp } from "react-icons/fa";
import styles from "../styles/member.module.css";

// ===== SSR ONLY =====
export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? req.headers.cookie : "";
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
      roleData[role] = snap.docs[0].data();
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

  const checkStatus = (roleKey) => {
    const data = roleData[roleKey];
    if (!data) return { active: false };
    if (roleKey === "member") {
      const expires = data.subscriptionExpiresAt?.toDate?.() || new Date(0);
      const now = new Date();
      return { active: expires > now, expires };
    }
    return { active: true };
  };

  return (
    <div className={styles.container}>
      <h1>Profile ya {username}</h1>

      <div className={styles.cardsWrapper}>
        {roles.map((role) => {
          const data = roleData[role.key];
          const status = checkStatus(role.key);

          return (
            <div key={role.key} className={styles.card}>
              <div className={styles.icon}>{role.icon}</div>
              <h2>{role.label}</h2>

              <span className={`${styles.badge} ${status.active ? styles.active : styles.nonActive}`}>
                {status.active ? "Active" : "Non-Active"}
              </span>

              {role.key === "member" && data && status.expires && (
                <p>Igihe membership izarangirira: {status.expires.toLocaleDateString()}</p>
              )}

              <button
                onClick={() => goWhatsApp(role.label)}
                className={styles.whatsappBtn}
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
