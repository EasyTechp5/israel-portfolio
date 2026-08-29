"use client";

import { useEffect, useState } from "react";

const titles = [
  "AI Engineer",
  "AI Automation Specialist",
  "Agentic AI Builder",
];

export default function RotatingTitle() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % titles.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="font-semibold text-sm transition-opacity duration-400"
      style={{
        color: "#0055DA",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {titles[index]}
    </span>
  );
}
