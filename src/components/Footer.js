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
    const message = "Muraho, ndifuza ubufasha kubijyanye na membership.";
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="footer">

      <Link href="/" className="item home">
        <FiHome />
        <span>Home</span>
      </Link>

      <button className="item" onClick={goWhatsApp}>
        <FiMessageCircle />
        <span>WhatsApp</span>
      </button>

      <Link href="/member" className="item">
        <FiAward />
        <span>Membership</span>
      </Link>

      <Link href="/profile" className="item settings">
        <FiSettings />
        <span>Settings</span>
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
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          z-index: 1000;
        }

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 0.7rem;
          color: var(--foreground);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        /* Hide labels initially */
        .item span {
          display: none;
          position: absolute;
          bottom: 100%;
          background: var(--foreground);
          color: var(--background);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.6rem;
          white-space: nowrap;
          margin-bottom: 4px;
        }

        /* Show label on hover */
        .item:hover span {
          display: block;
        }

        .item svg {
          font-size: 1.4rem;
        }

        /* Space items: home first, settings last, others centered */
        .home { order: 0; }
        .item:nth-of-type(2) { order: 1; }
        .item:nth-of-type(3) { order: 2; }
        .settings { order: 3; }

        /* Prevent content hidden behind footer */
        :global(body) {
          padding-bottom: 60px;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .item svg { font-size: 1.2rem; }
        }
      `}</style>
    </div>
  );
}
