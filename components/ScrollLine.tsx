"use client";

import { useEffect, useRef } from "react";

/**
 * Vertical timeline line that fills (with a glowing head) as the reader scrolls
 * down it. Drop it inside a `relative` container as its first child.
 */
export default function ScrollLine({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const f = fill.current;
    const hd = head.current;
    if (!el || !f || !hd) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = reduce ? 1 : Math.min(Math.max((window.innerHeight * 0.6 - r.top) / r.height, 0), 1);
      f.style.transform = `scaleY(${p})`;
      hd.style.top = `${p * 100}%`;
      hd.style.opacity = p > 0 && p < 1 ? "1" : "0";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className={`absolute top-0 bottom-0 w-0.5 ${className}`} aria-hidden>
      <div className="absolute inset-0" style={{ backgroundColor: "var(--primary-line)" }} />
      <div
        ref={fill}
        className="absolute inset-0 origin-top"
        style={{
          background: "var(--primary)",
          transform: "scaleY(0)",
        }}
      />
      <div
        ref={head}
        className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "var(--primary)",
          boxShadow: "0 0 0 4px color-mix(in srgb, var(--primary) 25%, transparent), 0 0 18px var(--primary)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
