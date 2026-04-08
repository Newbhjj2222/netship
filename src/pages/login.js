'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../components/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import Link from "next/link";
import styles from "../styles/Login.module.css";
import Image from "next/image";

// THREE
import { Canvas } from "@react-three/fiber";

function Bg() {
  return (
    <mesh rotation={[0.3, 0.4, 0]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="#008489" wireframe />
    </mesh>
  );
}

export default function Login() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== SAVE COOKIE =====
  const saveUser = (user) => {
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
  };

  // ===== GET USERNAME =====
  const getUsername = async (email) => {
    const ref = doc(db, "userdate", "data");
    const snap = await getDoc(ref);

    if (!snap.exists()) return "User";

    const data = snap.data();
    for (let key in data) {
      if (data[key].email === email) {
        return data[key].fName || "User";
      }
    }
    return "User";
  };

  // ===== EMAIL LOGIN =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const username = await getUsername(email);

      saveUser({
        uid: user.uid,
        email: user.email,
        username,
      });

      router.replace("/");
    } catch (err) {
      setMessage("Login failed: " + err.message);
      setLoading(false);
    }
  };

  // ===== GOOGLE LOGIN =====
  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await saveGoogleUser(user);

      saveUser({
        uid: user.uid,
        email: user.email,
        username: user.displayName || "User",
      });

      router.replace("/");
    } catch (err) {
      setMessage("Google login failed");
      setLoading(false);
    }
  };

  // ===== SAVE GOOGLE USER =====
  const saveGoogleUser = async (user) => {
    const ref = doc(db, "userdate", "data");
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};

    if (!data[user.uid]) {
      await setDoc(ref, {
        ...data,
        [user.uid]: {
          fName: user.displayName,
          email: user.email,
        },
      });
    }
  };

  // ===== RESET PASSWORD =====
  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Andika email");
      return;
    }

    await sendPasswordResetEmail(auth, email);
    setMessage("Email yo guhindura password yoherejwe");
  };

  return (
    <>
      {/* 3D BACKGROUND */}
      <div className={styles.canvasBg}>
        <Canvas>
          <ambientLight />
          <Bg />
        </Canvas>
      </div>

      {/* LOADING */}
      {loading && <div className={styles.loader}>Loading...</div>}

      <div className={styles.container}>
        <h2 className={styles.title}>Sign In</h2>

        {message && <div className={styles.message}>{message}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={styles.btn}>Sign In</button>

          <button
            type="button"
            className={styles.reset}
            onClick={handleResetPassword}
          >
            Forgot password?
          </button>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
          >
            <Image src="/google.svg" alt="g" width={20} height={20} />
            Continue with Google
          </button>
        </form>

        <p className={styles.link}>
          Nta konti? <Link href="/register">Iyandikishe</Link>
        </p>
      </div>
    </>
  );
}
