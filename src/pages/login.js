'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { FiCopy, FiShare2 } from "react-icons/fi";

import styles from "../styles/Login.module.css";

// 3D Background Component
function Bg() {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="#008489" wireframe />
    </mesh>
  );
}

const Login = () => {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto login if user in cookies
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      router.replace("/");
    }
  }, [router]);

  // EMAIL/PASSWORD LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      Cookies.set("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        username: user.displayName || "User"
      }), { expires: 7 });

      setMessage("Winjiye neza!");
      router.replace("/");
    } catch (error) {
      setMessage("Kwinjira ntibishobotse: " + error.message);
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      Cookies.set("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        username: user.displayName || "User"
      }), { expires: 7 });

      setMessage("Winjiye neza ukoresheje Google!");
      router.replace("/");
    } catch (error) {
      setMessage("Google login ntibishobotse: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* 3D Background */}
      <Canvas className={styles.canvasBg}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Bg />
      </Canvas>

      {/* Login Container */}
      <div className={styles.container}>
        <h2 className={styles.title}>Sign In</h2>

        {message && <div className={styles.message}>{message}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
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
          <button type="button" className={styles.reset} onClick={() => alert("Reset password logic")}>
            Forgot password?
          </button>

          {/* Google Login */}
          <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin}>
            <Image src="/google.svg" width={20} height={20} alt="Google" />
            <span>Continue with Google</span>
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Nta konti ufite? <a href="/register">Iyandikishe hano</a>
        </p>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Tegereza gato...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
