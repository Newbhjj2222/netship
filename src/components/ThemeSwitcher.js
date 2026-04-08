'use client';

import { useState } from "react";
import { FaPaintBrush, FaFont } from "react-icons/fa";

export default function ThemeSwitcher() {
  const [bg, setBg] = useState('white');
  const [color, setColor] = useState('black');
  const [font, setFont] = useState('sans');

  const applyTheme = () => {
    document.body.style.backgroundColor = bg;
    document.body.style.color = color;
    document.body.style.fontFamily =
      font === 'sans' ? 'Arial, Helvetica, sans-serif' :
      font === 'mono' ? 'Courier New, monospace' :
      'Georgia, serif';
  };

  return (
    <div className="theme-switcher">
      <h3><FaPaintBrush /> Customize Theme</h3>

      <div className="theme-control">
        <label>Background: </label>
        <select value={bg} onChange={(e) => setBg(e.target.value)}>
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="gray">Gray</option>
        </select>
      </div>

      <div className="theme-control">
        <label>Text Color: </label>
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="gray">Gray</option>
        </select>
      </div>

      <div className="theme-control">
        <label>Font: </label>
        <select value={font} onChange={(e) => setFont(e.target.value)}>
          <option value="sans">Sans</option>
          <option value="mono">Mono</option>
          <option value="serif">Serif</option>
        </select>
      </div>

      <button className="apply-btn" onClick={applyTheme}>
        <FaFont /> Apply Theme
      </button>

      <style jsx>{`
        .theme-switcher {
          max-width: 400px;
          margin: 1rem auto;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          background: #f9f9f9;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          user-select: none; /* disable text selection */
        }

        .theme-switcher h3 {
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
        }

        .theme-control {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        select {
          padding: 0.3rem 0.5rem;
          border-radius: 6px;
          border: 1px solid #ccc;
          cursor: pointer;
        }

        .apply-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s;
        }

        .apply-btn:hover {
          background: #005bb5;
        }

        @media (max-width: 480px) {
          .theme-switcher {
            padding: 0.75rem 1rem;
          }

          .theme-switcher h3 {
            font-size: 1rem;
          }

          select, .apply-btn {
            font-size: 0.9rem;
          }
        }

        html, body {
          touch-action: manipulation; /* disable zoom gestures on mobile */
          overscroll-behavior: none;
        }
      `}</style>
    </div>
  );
}
