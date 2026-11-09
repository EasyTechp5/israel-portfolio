"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

/** Pure arithmetic on the visitor's own numbers. It claims nothing about results. */
export default function HandCostCalc() {
  const [hours, setHours] = useState(6);
  const [rate, setRate] = useState(10);
  const [cur, setCur] = useState("$");
  const yearHours = hours * 52;
  const yearCost = yearHours * rate;
  const fmt = (n: number) => n.toLocaleString("en-US");

  return (
    <div className="card p-6 sm:p-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] items-center" style={{ borderTop: "3px solid var(--primary-fill)" }}>
      <div>
        <span className="mono-label" style={{ color: "var(--primary-text)" }}>Quick sum</span>
        <h2 className="my-2" style={{ fontSize: "clamp(1.4rem,2.6vw,1.9rem)" }}>What is the manual way costing you?</h2>
        <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>Your own numbers, nothing assumed. Use the hours someone spends each week on the task you would like to stop doing by hand.</p>

        <label className="block text-sm font-medium mb-1" htmlFor="hc-h">Hours per week: <strong>{hours}</strong></label>
        <input id="hc-h" type="range" min={1} max={40} value={hours} onChange={(e) => setHours(+e.target.value)} className="w-full mb-5" style={{ accentColor: "#0055DA" }} />

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="hc-r">Cost of an hour</label>
            <input id="hc-r" type="number" min={0} value={rate} onChange={(e) => setRate(Math.max(0, +e.target.value || 0))} className="field w-full" />
          </div>
          <div className="flex gap-1.5" role="group" aria-label="Currency">
            {["$", "₦", "£", "€"].map((c) => (
              <button key={c} type="button" className="topic-chip" aria-pressed={c === cur} onClick={() => setCur(c)} style={{ padding: "0.5rem 0.8rem" }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 text-center" style={{ background: "var(--bg-inset)" }}>
        <p className="text-sm" style={{ color: "var(--text-subtle)" }}>Over a year that is</p>
        <p className="font-bold my-1" style={{ fontSize: "clamp(2rem,4vw,2.8rem)", fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.03em" }} aria-live="polite">
          {cur}{fmt(yearCost)}
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>and {fmt(yearHours)} hours of someone&apos;s time.</p>
        <a
          href={`https://wa.me/2348139464398?text=${encodeURIComponent(`Hi Israel, a task here takes about ${hours} hours a week. Could we talk about automating it?`)}`}
          target="_blank" rel="noopener noreferrer" className="btn-primary"
        >
          Could this be automated? <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-xs mt-3" style={{ color: "var(--text-subtle)" }}>Whether it is worth automating is something I will tell you honestly on a free call.</p>
      </div>
    </div>
  );
}
