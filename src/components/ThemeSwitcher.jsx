'use client';
import { useState } from "react";

export default function ThemeSwitcher() {
  const [bg, setBg] = useState('white');
  const [color, setColor] = useState('black');
  const [font, setFont] = useState('sans');

  const applyTheme = () => {
    document.body.className = `bg-${bg} text-${color} font-${font}`;
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Customize Theme</h3>

      <div style={{ margin: '0.5rem 0' }}>
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

      <div style={{ margin: '0.5rem 0' }}>
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

      <div style={{ margin: '0.5rem 0' }}>
        <label>Font: </label>
        <select value={font} onChange={(e) => setFont(e.target.value)}>
          <option value="sans">Sans</option>
          <option value="mono">Mono</option>
          <option value="serif">Serif</option>
        </select>
      </div>

      <button
        onClick={applyTheme}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Apply Theme
      </button>
    </div>
  );
}
