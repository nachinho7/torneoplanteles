// src/components/TorneoSelector.jsx
import React from "react";
import "../styles/TorneoSelector.css";

export const TORNEOS = {
  "TOP 12": "top12",
  "PRIMERA A": "primeraa",
  "PRIMERA B": "primerab",
  "PRIMERA C": "primerac",
};

const TorneoSelector = ({ torneo, onChange }) => {
  return (
    <div className="torneo-selector-container">
        <div className="torneo-select">
        <select value={torneo} onChange={(e) => onChange(e.target.value)}>
            {Object.entries(TORNEOS).map(([label, value]) => (
            <option key={value} value={value}>{label}</option>
            ))}
        </select>
        </div>
    </div>
  );
};

export default TorneoSelector;
