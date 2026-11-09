"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { sfx } from "@/lib/ambient";

/**
 * The doors. A short loading beat ("Preparing the workspace"), then a
 * "Come in" button that swings the doors open and moves through them into the room.
 * Skipped for returning visitors, deep links and reduced motion (see Scene).
 */
export default function SceneIntro({ onDone, onOpening, ready = true, sound = true, onSound }: { onDone: () => void; onOpening?: () => void; ready?: boolean; sound?: boolean; onSound?: () => void }) {
  const [pct, setPct] = useState(0);
  const [counted, setCounted] = useState(false);
  const [opening, setOpening] = useState(false);
  // The door is offered once the counter has finished AND the room behind it is ready.
  const phase: "loading" | "ready" | "opening" = opening ? "opening" : counted && ready ? "ready" : "loading";
  const button = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [knocked, setKnocked] = useState(0);

  // The doorway leans a little toward the pointer.
  const onMove = (e: React.PointerEvent) => {
    const r = root.current;
    if (!r) return;
    r.style.setProperty("--mx", String((e.clientX / window.innerWidth) * 2 - 1));
    r.style.setProperty("--my", String((e.clientY / window.innerHeight) * 2 - 1));
  };
  // Knock on the door: the doors shudder and a voice from inside answers.
  const knock = (e: React.MouseEvent) => {
    e.stopPropagation();
    sfx("knock");
    setKnocked((k) => k + 1);
  };
  useEffect(() => {
    if (!knocked) return;
    const t = window.setTimeout(() => setKnocked(0), 2600);
    return () => window.clearTimeout(t);
  }, [knocked]);

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
    onOpening?.();
    window.setTimeout(onDone, 1350);
  };

  return (
    <div ref={root} onPointerMove={onMove} className={`intro ${phase === "opening" ? "opening" : ""}`} role="dialog" aria-label="Welcome">
      <div className="intro-bg" />
      <div className="intro-rays" aria-hidden />

      <div className="intro-stage" aria-hidden>
        <div className="intro-tilt">
          <div className="intro-lintel">
            <span className="intro-name">Israel Afolabi</span>
            {knocked > 0 ? (
              <span className="intro-say">Come in, it&apos;s open.</span>
            ) : (
              <span className="mono-label" style={{ color: "rgba(255,255,255,0.78)" }}>AI engineer · automation</span>
            )}
          </div>
          <div className="intro-set">
            <span className="lantern lantern-l" />
            <span className="lantern lantern-r" />
            <div className="plant plant-l">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}<b /></div>
            <div className="plant plant-r">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}<b /></div>
            <div
              className={`intro-frame ${phase === "ready" ? "is-ready" : ""} ${knocked ? "knocked" : ""}`}
              onClick={enter}
            >
              <div className="intro-fan" />
              <div className="intro-light" />
              <div className="door door-l">
                <i className="hinge h1" /><i className="hinge h2" /><i className="hinge h3" />
                <i className="peephole" />
                <button type="button" className="knocker" tabIndex={-1} onClick={knock} aria-hidden><i /><b /></button>
                <span className="handle"><b className="plate" /><b className="lever" /><b className="keyhole" /></span>
                <i className="kick" />
              </div>
              <div className="door door-r">
                <i className="hinge h1" /><i className="hinge h2" /><i className="hinge h3" />
                <i className="slot" />
                <span className="handle"><b className="plate" /><b className="lever" /><b className="keyhole" /></span>
                <i className="kick" />
              </div>
              <span className="intro-step" />
            </div>
          </div>
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
