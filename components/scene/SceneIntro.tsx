"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * The doors. A short loading beat ("Preparing the workspace"), then a
 * "Come in" button that swings the doors open and moves through them into the room.
 * Skipped for returning visitors, deep links and reduced motion (see Scene).
 */
export default function SceneIntro({ onDone, ready = true }: { onDone: () => void; ready?: boolean }) {
  const [pct, setPct] = useState(0);
  const [counted, setCounted] = useState(false);
  const [opening, setOpening] = useState(false);
  // The door is offered once the counter has finished AND the room behind it is ready.
  const phase: "loading" | "ready" | "opening" = opening ? "opening" : counted && ready ? "ready" : "loading";
  const button = useRef<HTMLButtonElement>(null);

  // Count up to 100 over about 1.7 seconds, then offer the door.
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / 1700, 1);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(step);
      else setCounted(true);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase === "ready") button.current?.focus();
  }, [phase]);

  const enter = () => {
    if (phase !== "ready") return;
    setOpening(true);
    window.setTimeout(onDone, 1350);
  };

  return (
    <div className={`intro ${phase === "opening" ? "opening" : ""}`} role="dialog" aria-label="Welcome">
      <div className="intro-bg" />

      <div className="intro-stage" aria-hidden>
        <div className="intro-lintel">
          <span className="intro-name">Israel Afolabi</span>
          <span className="mono-label" style={{ color: "rgba(255,255,255,0.78)" }}>AI engineer · automation</span>
        </div>
        <div className="intro-frame">
          <div className="intro-light" />
          <div className="door door-l"><i className="handle" /></div>
          <div className="door door-r"><i className="handle" /></div>
        </div>
      </div>

      <div className="intro-ui">
        {phase === "loading" ? (
          <>
            <span className="mono-label" style={{ color: "#0a2d73" }}>Preparing the workspace</span>
            <span className="intro-count">{pct}<small>%</small></span>
          </>
        ) : (
          <button
            ref={button}
            type="button"
            onClick={enter}
            className="intro-enter"
            disabled={phase === "opening"}
          >
            Come in <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
