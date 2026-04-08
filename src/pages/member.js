// pages/member.js
'use client';

import { db } from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import cookie from "cookie";
import { FaUser, FaUserTie, FaHandsHelping, FaWhatsapp } from "react-icons/fa";
import styles from "../styles/member.module.css";

export async function getServerSideProps({ req }) {
  // ===== PARSE COOKIES =====
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

  const checkStatus = (roleKey) => {
    const data = roleData[roleKey];
    if (!data) return { active: false };

    if (roleKey === "member") {
      if (!data.subscriptionExpiresAt) return { active: false };
      const expires = data.subscriptionExpiresAt.toDate();
      const now = new Date();
      return { active: expires >= now, expires };
    }

    // Umujyanama cyangwa umuterankunga bameze active niba bari muri database
    return { active: true };
  };

  const roles = [
    {
      key: "member",
      label: "Membership",
      icon: <FaUser size={40} />,
    },
    {
      key: "umujyanama",
      label: "Umujyanama",
      icon: <FaUserTie size={40} />,
    },
    {
      key: "umuterankunga",
      label: "Umuterankunga",
      icon: <FaHandsHelping size={40} />,
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Profile ya {username}</h1>

      <div className={styles.cardsWrapper}>
        {roles.map((role) => {
          const status = checkStatus(role.key);
          const data = roleData[role.key];

          return (
            <div key={role.key} className={styles.card}>
              <div className={styles.icon}>{role.icon}</div>
              <h2>{role.label}</h2>

              <p className={status.active ? styles.activeBadge : styles.nonActiveBadge}>
                {status.active ? "Active" : "Non-Active"}
              </p>

              {/* Membership dates */}
              {role.key === "member" && status.active && data && data.subscriptionExpiresAt && (
                <p className={styles.dates}>
                  Igihe izarangirira: {data.subscriptionExpiresAt.toDate().toLocaleDateString()}
                </p>
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
