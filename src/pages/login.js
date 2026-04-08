// pages/login.js
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
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

  // Auto redirect if user cookie exists
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) router.replace("/"); // user already logged in
  }, [router]);

  // ===== Email/Password Login =====
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save cookie
      Cookies.set("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        username: user.displayName || "User"
      }), { expires: 7 });

      // Ensure membership exists in Firestore
      const memberRef = doc(db, "members", user.uid);
      const memberSnap = await getDoc(memberRef);
      if (!memberSnap.exists()) {
        await setDoc(memberRef, {
          uid: user.uid,
          username: user.displayName || "User",
          isMember: true,
          subscriptionExpiresAt: new Date(Date.now() + 365*24*60*60*1000),
          createdAt: serverTimestamp(),
        });
      }

      setMessage("Winjiye neza!");
      router.replace("/");
    } catch (err) {
      setMessage("Kwinjira ntibishobotse: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== Google Login =====
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save cookie
      Cookies.set("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        username: user.displayName || "User"
      }), { expires: 7 });

      // Ensure membership exists in Firestore
      const memberRef = doc(db, "members", user.uid);
      const memberSnap = await getDoc(memberRef);
      if (!memberSnap.exists()) {
        await setDoc(memberRef, {
          uid: user.uid,
          username: user.displayName || "User",
          isMember: true,
          subscriptionExpiresAt: new Date(Date.now() + 365*24*60*60*1000),
          createdAt: serverTimestamp(),
        });
      }

      setMessage("Winjiye neza ukoresheje Google!");
      router.replace("/");
    } catch (err) {
      setMessage("Google login ntibishobotse: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign In</h2>

      {message && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleEmailLogin} className={styles.form}>
        <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className={styles.btn}>Sign In</button>
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
