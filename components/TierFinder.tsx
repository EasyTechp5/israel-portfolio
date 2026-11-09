"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

const QUESTIONS = [
  {
    q: "What are you trying to fix?",
    options: [
      { label: "One repetitive task", pts: 0 },
      { label: "A whole function (sales, finance, support)", pts: 1 },
      { label: "Something that needs to decide on its own", pts: 2 },
    ],
  },
  {
    q: "How are the rules today?",
    options: [
      { label: "Clear and written down", pts: 0 },
      { label: "Mostly clear, a few exceptions", pts: 1 },
      { label: "Mostly in people's heads or documents", pts: 2 },
    ],
  },
  {
    q: "When do you need it?",
    options: [
      { label: "This week or next", pts: 0 },
      { label: "Within a month", pts: 1 },
      { label: "No rush, I want it done right", pts: 2 },
    ],
  },
];

const RESULT = [
  { name: "Single Workflow", price: "from $450", why: "One focused process, automated properly and handed over in about a week." },
  { name: "Business System", price: "from $1,200", why: "Several workflows working together, with monitoring, so a whole function runs itself." },
  { name: "Agentic & Custom", price: "from $3,000", why: "AI agents or retrieval over your own documents, rolled out in stages and tested in shadow mode." },
];

export default function TierFinder() {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;
  const score = answers.reduce((a, b) => a + b, 0);
  // Question one carries most weight: what you want fixed decides the tier.
  const idx = done ? Math.min(2, Math.max(answers[0], Math.round(score / 3))) : 0;
  const r = RESULT[idx];

  return (
    <div className="card mx-auto max-w-2xl p-6 sm:p-8 text-left" style={{ position: "relative" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="mono-label" style={{ color: "var(--primary-text)" }}>Find your fit · 30 seconds</span>
        {step > 0 && (
          <button type="button" onClick={() => setAnswers([])} className="text-xs inline-flex items-center gap-1" style={{ color: "var(--text-subtle)" }}>
            <RotateCcw className="w-3.5 h-3.5" /> Start over
          </button>
        )}
      </div>
      <div className="flex gap-1.5 mb-5" aria-hidden>
        {QUESTIONS.map((_, i) => (
          <span key={i} style={{ height: 4, flex: 1, borderRadius: 4, background: i < step ? "var(--primary-fill)" : "var(--border)", transition: "background .3s" }} />
        ))}
      </div>

      {!done ? (
        <div key={step} className="page-in">
          <h3 className="mb-4" style={{ fontSize: "1.2rem" }}>{QUESTIONS[step].q}</h3>
          <div className="grid gap-2.5">
            {QUESTIONS[step].options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setAnswers([...answers, o.pts])}
                className="topic-chip"
                style={{ textAlign: "left", justifyContent: "flex-start", padding: "0.85rem 1rem", borderRadius: 12 }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="page-in">
          <p className="text-sm mb-1" style={{ color: "var(--text-subtle)" }}>Sounds like</p>
          <h3 className="mb-1" style={{ fontSize: "1.6rem" }}>{r.name} <span style={{ color: "var(--primary-text)", fontSize: "1rem" }}>{r.price}</span></h3>
          <p className="mb-5" style={{ color: "var(--text-body)" }}>{r.why}</p>
          <a
            href={`https://wa.me/2348139464398?text=${encodeURIComponent(`Hi Israel, the pricing guide pointed me to "${r.name}". I would like to discuss my project.`)}`}
            target="_blank" rel="noopener noreferrer" className="btn-primary"
          >
            Talk about it <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs mt-3" style={{ color: "var(--text-subtle)" }}>A starting point only. You get a fixed quote in writing after a free call.</p>
        </div>
      )}
    </div>
  );
}
