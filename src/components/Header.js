'use client';

export default function Header() {
  return (
    <header className="header">
      <h1>Net Membership</h1>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: var(--background);
          color: var(--foreground);
          text-align: center;
          padding: 1rem 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          z-index: 1000;
        }

        .header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .header h1 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </header>
  );
}
