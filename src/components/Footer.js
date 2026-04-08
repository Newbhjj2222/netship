'use client';

import Link from "next/link";
import { useRouter } from "next/router";
import { FiHome, FiSettings, FiMessageCircle, FiAward } from "react-icons/fi";

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
          justify-content: space-around;
          align-items: center;
          padding: 0.5rem 0;
          z-index: 1000;
        }

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--foreground);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .item svg {
          font-size: 2rem; /* icon nini */
        }

        .item span {
          font-size: 0.75rem;
        }

        .item:hover svg {
          transform: scale(1.2);
        }

        /* Space items: home first, settings last, others centered */
        .home { order: 0; }
        .item:nth-of-type(2) { order: 1; }
        .item:nth-of-type(3) { order: 2; }
        .settings { order: 3; }

        /* Prevent content hidden behind footer */
        :global(body) {
          padding-bottom: 70px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .item svg { font-size: 1.8rem; }
          .item span { font-size: 0.7rem; }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 0.5rem 0.2rem;
          }
          .item svg { font-size: 1.5rem; }
          .item span { font-size: 0.65rem; }
        }
      `}</style>
    </div>
  );
}
