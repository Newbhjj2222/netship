'use client';

import { useState, useEffect } from "react";
import { FaPaintBrush, FaFont } from "react-icons/fa";

export default function ThemeSwitcher() {
  const [bg, setBg] = useState('white');
  const [color, setColor] = useState('black');
  const [font, setFont] = useState('sans');

  // AUTO APPLY (nta button)
  useEffect(() => {
    document.body.style.backgroundColor = bg;
    document.body.style.color = color;
    document.body.style.fontFamily =
      font === 'sans'
        ? 'Arial, Helvetica, sans-serif'
        : font === 'mono'
        ? 'Courier New, monospace'
        : 'Georgia, serif';
  }, [bg, color, font]);

  return (
    <div className="theme-switcher">

      <div className="row">
        <FaPaintBrush />

        <select value={bg} onChange={(e) => setBg(e.target.value)}>
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="gray">Gray</option>
        </select>

        <select value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="black">Text Black</option>
          <option value="white">Text White</option>
          <option value="blue">Text Blue</option>
          <option value="green">Text Green</option>
          <option value="yellow">Text Yellow</option>
          <option value="gray">Text Gray</option>
        </select>

        <FaFont />

        <select value={font} onChange={(e) => setFont(e.target.value)}>
          <option value="sans">Sans</option>
          <option value="mono">Mono</option>
          <option value="serif">Serif</option>
        </select>
      </div>

      <style jsx>{`
        .theme-switcher {
          width: 100%;
          padding: 0.5rem;
          display: flex;
          justify-content: center;
          user-select: none;
        }

        .row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          padding: 0.5rem 0.75rem;
          border-radius: 999px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          flex-wrap: wrap;
        }

        select {
          padding: 0.3rem 0.5rem;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 0.9rem;
          cursor: pointer;
          background: white;
        }

        svg {
          font-size: 1rem;
        }

        @media (max-width: 600px) {
          .row {
            gap: 0.3rem;
            padding: 0.4rem;
          }

          select {
            font-size: 0.8rem;
            padding: 0.25rem 0.4rem;
          }
        }

        html, body {
          touch-action: manipulation;
          overscroll-behavior: none;
        }
      `}</style>
    </div>
  );
}
