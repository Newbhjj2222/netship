'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

import { auth, db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import Image from "next/image";
import styles from "../styles/Login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== AUTO LOGIN =====
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      router.replace("/");
    }
  }, [router]);

  // ===== GET USER FROM FIRESTORE =====
  const getUserData = async (uid) => {
    try {
      const ref = doc(db, "userdate", "data");
      const snap = await getDoc(ref);

      if (!snap.exists()) return null;

      const data = snap.data();

      if (!data[uid]) return null;

      return data[uid]; // contains fName, email, etc
    } catch (err) {
      console.error("Error fetching user:", err);
      return null;
    }
  };

  // ===== SAVE COOKIE (SAFE VERSION) =====
  const saveUserToCookie = (uid, firebaseUser, dbUser) => {
    const userData = {
      uid,
      email: firebaseUser.email,
      username: dbUser?.fName || "User",
    };

    Cookies.set("user", JSON.stringify(userData), {
      expires: 7,
      path: "/", // 🔥 VERY IMPORTANT for SSR
    });

    console.log("COOKIE SAVED:", userData);
  };

  // ===== EMAIL LOGIN =====
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const dbUser = await getUserData(user.uid);

      if (!dbUser) {
        setMessage("User ntaboneka muri database.");
        setLoading(false);
        return;
      }

      saveUserToCookie(user.uid, user, dbUser);

      setMessage("Winjiye neza!");

      // ⏳ WAIT kugirango cookie ibanze ibike
      setTimeout(() => {
        router.replace("/");
      }, 500);

    } catch (err) {
      setMessage("Kwinjira ntibishobotse: " + err.message);
      setLoading(false);
    }
  };

  // ===== GOOGLE LOGIN =====
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const dbUser = await getUserData(user.uid);

      if (!dbUser) {
        setMessage("User wa Google ntabitswe muri database.");
        setLoading(false);
        return;
      }

      saveUserToCookie(user.uid, user, dbUser);

      setMessage("Winjiye neza ukoresheje Google!");

      setTimeout(() => {
        router.replace("/");
      }, 500);

    } catch (err) {
      setMessage("Google login ntibishobotse: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign In</h2>

      {message && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleEmailLogin} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className={styles.btn}>
          Sign In
        </button>
      </form>

      <p style={{ textAlign: "center", margin: "10px 0" }}>or</p>

      <button className={styles.googleBtn} onClick={handleGoogleLogin}>
        <Image src="/google.svg" width={20} height={20} alt="Google" />
        <span>Continue with Google</span>
      </button>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Nta konti? <a href="/register">Iyandikishe hano</a>
      </p>

      {loading && <p className={styles.loading}>Tegereza gato...</p>}
    </div>
  );
}
