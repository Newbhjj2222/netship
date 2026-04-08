'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Cookies from "js-cookie";
import { FaUser, FaUserTie, FaHandsHelping, FaWhatsapp } from "react-icons/fa";
import styles from "../styles/member.module.css";

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? req.headers.cookie : "";
  const parsedCookies = require("cookie").parse(cookies);
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
  const router = useRouter();
  const [clientRoleData, setClientRoleData] = useState({});

  // ===== Load roleData from cookies on client side =====
  useEffect(() => {
    const roles = ["member", "umujyanama", "umuterankunga"];
    let data = {};
    roles.forEach((role) => {
      const cookieData = Cookies.get(role);
      if (cookieData) data[role] = JSON.parse(cookieData);
    });
    if (Object.keys(data).length) setClientRoleData(data);
  }, []);

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
      description: clientRoleData.member
        ? "Urimo kuba member"
        : "Nturi member",
    },
    {
      key: "umujyanama",
      label: "Umujyanama",
      icon: <FaUserTie />,
      description: clientRoleData.umujyanama
        ? "Uri umujyanama"
        : "Nturi umujyanama",
    },
    {
      key: "umuterankunga",
      label: "Umuterankunga",
      icon: <FaHandsHelping />,
      description: clientRoleData.umuterankunga
        ? "Uri umuterankunga"
        : "Nturi umuterankunga",
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Profile ya {username}</h1>

      <div className={styles.cardsWrapper}>
        {roles.map((role) => {
          const data = roleData[role.key] || clientRoleData[role.key];
          return (
            <div key={role.key} className={styles.card}>
              <div className={styles.icon}>{role.icon}</div>
              <h2>{role.label}</h2>
              <p>{role.description}</p>

              {/* Membership dates */}
              {role.key === "member" && data && (
                <p>
                  Igihe yatangiye: {data.subscriptionStart?.toDate?.().toLocaleDateString()} <br />
                  Igihe izarangirira: {data.subscriptionExpiresAt?.toDate?.().toLocaleDateString()}
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
