"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function Faq({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-6 py-5 text-left"
            >
              <span
                className="text-base sm:text-lg font-semibold"
                style={{
                  color: isOpen ? "var(--primary)" : "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.02em",
                  transition: "color 0.2s ease",
                }}
              >
                {item.q}
              </span>
              <Plus
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{
                  color: isOpen ? "var(--primary)" : "var(--text-subtle)",
                  transform: isOpen ? "rotate(45deg)" : "none",
                  transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), color 0.2s ease",
                }}
              />
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <p className="pb-5 pr-10 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
