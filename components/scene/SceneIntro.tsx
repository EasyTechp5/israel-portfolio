"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * The doors. A short loading beat ("Preparing the workspace"), then a
 * "Come in" button that swings the doors open and moves through them into the room.
 * Skipped for returning visitors, deep links and reduced motion (see Scene).
 */
export default function SceneIntro({ onDone, ready = true, sound = true, onSound }: { onDone: () => void; ready?: boolean; sound?: boolean; onSound?: () => void }) {
  const [pct, setPct] = useState(0);
  const [counted, setCounted] = useState(false);
  const [opening, setOpening] = useState(false);
  // The door is offered once the counter has finished AND the room behind it is ready.
  const phase: "loading" | "ready" | "opening" = opening ? "opening" : counted && ready ? "ready" : "loading";
  const button = useRef<HTMLButtonElement>(null);

  // Count up to 100 over about a second, then offer the door.
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / 900, 1);
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
        <div
          className={`intro-frame ${phase === "ready" ? "is-ready" : ""}`}
          onClick={enter}
        >
          <div className="intro-light" />
          <div className="door door-l">
            <i className="hinge h1" /><i className="hinge h2" /><i className="hinge h3" />
            <span className="handle"><b className="plate" /><b className="lever" /><b className="keyhole" /></span>
          </div>
          <div className="door door-r">
            <i className="hinge h1" /><i className="hinge h2" /><i className="hinge h3" />
            <span className="handle"><b className="plate" /><b className="lever" /><b className="keyhole" /></span>
          </div>
          <span className="intro-step" />
        </div>
      </div>

      <button type="button" className="intro-sound" onClick={onSound} aria-pressed={sound}>
        <span className="eq" data-on={sound} aria-hidden><i /><i /><i /><i /></span>
        <span>Sound {sound ? "on" : "off"}</span>
      </button>

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
