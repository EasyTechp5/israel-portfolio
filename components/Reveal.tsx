"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades + lifts its children into view once, when scrolled into the viewport.
 *
 * Guards against content ever getting stuck invisible: anything already at or
 * above the fold reveals immediately (the observer never fires for elements
 * scrolled past), and a 3s failsafe reveals the rest. A <noscript> override in
 * the layout keeps the page fully visible when JS is unavailable.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer support → just show it.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Already in view, or scrolled past (e.g. deep link, restored scroll
    // position, fast scroll) → show immediately. The observer never fires
    // for elements sitting above the viewport.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);

    // Safety net: never leave content hidden.
    const failsafe = window.setTimeout(() => {
      setVisible(true);
      observer.disconnect();
    }, 3000);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
