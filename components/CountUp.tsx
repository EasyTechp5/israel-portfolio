"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a number up from zero the first time it scrolls into view.
 * Values with no digits ("Worldwide") are shown as they are. The final value is
 * in the server HTML, so crawlers, no-JS visitors and reduced-motion visitors
 * always see the real figure.
 */
export default function CountUp({ value, duration = 1700 }: { value: string; duration?: number }) {
  const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = parseFloat(match[2].replace(/,/g, ""));
    let raf = 0;

    const run = () => {
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
        setShown(target * eased);
        if (p < 1) raf = requestAnimationFrame(step);
        else setShown(null);
      };
      setShown(0);
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  if (!match) return <span ref={ref}>{value}</span>;

  const [, prefix, num, suffix] = match;
  const display =
    shown === null
      ? num
      : Math.round(shown).toLocaleString("en-US");

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
