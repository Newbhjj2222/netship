'use client';

import Link from "next/link";
import { useRouter } from "next/router";
import {
  FiHome,
  FiSettings,
  FiMessageCircle,
  FiAward
} from "react-icons/fi";

export default function Footer() {
  const router = useRouter();

  const goWhatsApp = () => {
    const number = "250722319367";
    const message = "Muraho, ndifuza membership.";
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="footer">

      <Link href="/" className="item">
        <FiHome />
        <span>Home</span>
      </Link>

      <Link href="/profile" className="item">
        <FiSettings />
        <span>Settings</span>
      </Link>

      <button className="item" onClick={goWhatsApp}>
        <FiMessageCircle />
        <span>WhatsApp</span>
      </button>

      <Link href="/member" className="item">
        <FiAward />
        <span>Membership</span>
      </Link>

      <style jsx>{`
        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: var(--background);
          color: var(--foreground);
          border-top: 1px solid rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0.5rem 0;
          z-index: 1000;
        }

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 0.7rem;
          color: var(--foreground);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .item svg {
          font-size: 1.2rem;
        }

        .item:hover {
          opacity: 0.7;
          transform: translateY(-2px);
        }

        /* Prevent content from being hidden behind footer */
        :global(body) {
          padding-bottom: 60px;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .item {
            font-size: 0.65rem;
          }

          .item svg {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
