// pages/profile.js
'use client';

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FiLogOut, FiUser, FiAward, FiMail } from "react-icons/fi";
import * as THREE from "three";
import styles from "../styles/profile.module.css";

export default function ProfilePage({ user, isMember }) {
  const router = useRouter();
  const mountRef = useRef(null);

  const handleLogout = () => {
    Cookies.remove("user");
    router.replace("/login");
  };

  // ===== Three.js Background =====
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Add rotating cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x0070f3 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={styles.container} ref={mountRef}>
      <div className={styles.overlay}>
        <div className={styles.profileCard}>
          <div className={styles.header}>
            <FiUser size={40} />
            <h2>{user.username || "User"}</h2>
            {isMember && (
              <span className={styles.badge}>
                <FiAward /> Member
              </span>
            )}
          </div>

          <div className={styles.info}>
            <p>
              <FiMail /> <strong>Email:</strong> {user.email}
            </p>
            
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
