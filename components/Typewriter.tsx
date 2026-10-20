"use client";

import { useEffect, useState } from "react";

/**
 * Types its text out with a blinking caret.
 *
 * The full text is always in the DOM (invisible while typing) so layout never
 * shifts, search engines and screen readers get the whole sentence, and with
 * JS off the layout's <noscript> rule reveals it. Visitors who ask for reduced
 * motion get the finished sentence straight away.
 */
export default function Typewriter({
  text,
  startDelay = 900,
  speed = 26,
  className,
  style,
}: {
  text: string;
  startDelay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [n, setN] = useState(0);
  const [caret, setCaret] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const show = window.setTimeout(() => {
        setN(text.length);
        setCaret(false);
      }, 0);
      return () => window.clearTimeout(show);
    }

    let i = 0;
    let timer = 0;
    let hide = 0;

    const tick = () => {
      i += 1;
      setN(i);
      if (i >= text.length) {
        // Let the caret blink a few times, then retire it.
        hide = window.setTimeout(() => setCaret(false), 3200);
        return;
      }
      const ch = text[i - 1];
      let delay = speed + Math.random() * speed * 0.9;
      if (ch === "," || ch === "—") delay += 190;
      else if (ch === "." || ch === "!" || ch === "?") delay += 300;
      timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(tick, startDelay);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hide);
    };
  }, [text, startDelay, speed]);

  return (
    <p className={className} style={style}>
      <span className="relative block">
        <span className="tw-ghost" style={{ opacity: 0 }}>
          {text}
        </span>
        <span aria-hidden className="tw-live absolute inset-0">
          {text.slice(0, n)}
          {caret && <span className="tw-caret" />}
        </span>
      </span>
    </p>
  );
}
