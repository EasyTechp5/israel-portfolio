"use client";

import { useMemo, useState } from "react";
import { Printer, RotateCcw, Calendar, MessageCircle, Check } from "lucide-react";

type Answer = 0 | 1 | 2; // No / Sometimes / Yes

const CAL = "https://calendar.app.google/8Pfj98atpuSk14RH9";

const QUESTIONS: { q: string; why: string; fix: string }[] = [
  {
    q: "Does this task happen at least once a week?",
    why: "Frequency is what pays back the build. Something done twice a year rarely justifies automating.",
    fix: "If it is rare, a written checklist is usually cheaper than a system.",
  },
  {
    q: "Does it add up to two hours a week, or more, across everyone who does it?",
    why: "Time saved is the headline benefit. Small tasks need to be very frequent to matter.",
    fix: "Measure it for two weeks before deciding. People consistently underestimate how long routine work takes.",
  },
  {
    q: "Could you write the steps down so a new hire could follow them without asking you?",
    why: "If you cannot explain the rules, a system cannot follow them. This is the most common blocker.",
    fix: "Write the steps down first. The act of documenting often reveals exceptions nobody had mentioned.",
  },
  {
    q: "Is the input usually structured, such as forms, spreadsheets or standard emails?",
    why: "Structured input automates cheaply. Wildly varied input needs AI and more careful testing.",
    fix: "Standardise the input where you can, for example with a form instead of free-text emails.",
  },
  {
    q: "Is the process the same from one month to the next?",
    why: "A process that keeps changing costs more to maintain than it saves.",
    fix: "Let it settle first, or automate only the stable parts such as the trigger and the record-keeping.",
  },
  {
    q: "Can you tell whether the result is correct without redoing the work?",
    why: "If you cannot check the output, you cannot safely trust a system to produce it.",
    fix: "Add a check step or a human approval, or keep this one manual.",
  },
  {
    q: "Do the tools involved connect to each other, or let you export and import data?",
    why: "Systems with no integration or export are expensive to link and easy to break.",
    fix: "Check each tool for an API, a webhook or an export before committing. One awkward tool can double the cost.",
  },
  {
    q: "Is a mistake cheap to fix, or does a person review the result before it matters?",
    why: "Automation can repeat an error many times quickly. Stakes decide how much safety you must build in.",
    fix: "Insert a review step before anything involving money, legal commitments or customers' trust.",
  },
  {
    q: "Does speed matter, such as replying to a lead or chasing a payment?",
    why: "Where delay costs money, automation pays back fastest, because it never sleeps or forgets.",
    fix: "If speed does not matter, the case rests on hours saved alone. Check that alone is enough.",
  },
  {
    q: "Do you know who will own and maintain it after it is built?",
    why: "A system nobody owns quietly breaks. APIs change, credentials expire, rules shift.",
    fix: "Name a person before you build, and make sure it is documented and runs on your accounts.",
  },
];

const OPTIONS: { label: string; value: Answer }[] = [
  { label: "Yes", value: 2 },
  { label: "Sometimes", value: 1 },
  { label: "No", value: 0 },
];

function verdict(score: number) {
  if (score >= 17)
    return {
      tone: "var(--success)",
      soft: "var(--success-soft)",
      title: "Strong candidate",
      body: "This looks like a good one to automate. The rules are clear, it happens often and the result can be checked. Start with the version that removes the most hours, build in a failure alert, and run it alongside the manual process for a couple of weeks before you trust it.",
    };
  if (score >= 12)
    return {
      tone: "var(--primary-text)",
      soft: "var(--primary-soft)",
      title: "Promising, with some homework",
      body: "There is a real case here, but one or two weak spots would make it fragile. Fix the gaps listed below first. They are usually undocumented rules or messy input. Once those are sorted, it is likely worth building.",
    };
  if (score >= 7)
    return {
      tone: "#a16207",
      soft: "rgba(234,179,8,0.14)",
      title: "Not ready yet",
      body: "Automating this now would probably be expensive and break often. The process needs to be clearer or more stable first. Work through the gaps below, then score it again.",
    };
  return {
    tone: "var(--accent-text)",
    soft: "var(--accent-soft)",
    title: "Probably not worth automating",
    body: "The cost is likely to outweigh the gain. That is a useful answer too: turning down the wrong project is cheaper than finishing it. Keep this one manual, or simplify it before you revisit.",
  };
}

export default function AuditTool() {
  const [answers, setAnswers] = useState<(Answer | null)[]>(() => QUESTIONS.map(() => null));
  const [label, setLabel] = useState("");

  const answered = answers.filter((a) => a !== null).length;
  const done = answered === QUESTIONS.length;
  const score = useMemo(() => answers.reduce<number>((s, a) => s + (a ?? 0), 0), [answers]);
  const result = verdict(score);
  const max = QUESTIONS.length * 2;

  const gaps = QUESTIONS.map((q, i) => ({ ...q, a: answers[i] })).filter((q) => q.a !== null && q.a < 2);

  function setAnswer(i: number, v: Answer) {
    setAnswers((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  }

  return (
    <div>
      {/* process label */}
      <div className="card p-6 mb-6">
        <label htmlFor="audit-label" className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          Which process are you scoring? <span style={{ color: "var(--text-subtle)", fontWeight: 400 }}>(optional, it appears on your printout)</span>
        </label>
        <input
          id="audit-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value.slice(0, 120))}
          placeholder="e.g. Chasing overdue invoices"
          className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "var(--bg-inset)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
        />
      </div>

      {/* progress */}
      <div className="mb-6 print:hidden" aria-live="polite">
        <div className="flex items-center justify-between text-sm mb-2" style={{ color: "var(--text-muted)" }}>
          <span>
            {answered} of {QUESTIONS.length} answered
          </span>
          {answered > 0 && !done ? <span>Keep going</span> : null}
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-inset)", border: "1px solid var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(answered / QUESTIONS.length) * 100}%`, backgroundColor: "var(--primary-fill)" }}
          />
        </div>
      </div>

      {/* questions */}
      <ol className="space-y-4">
        {QUESTIONS.map((item, i) => (
          <li key={item.q} className="card p-6">
            <div className="flex gap-4">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary-text)", fontFamily: "var(--font-display)" }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p id={`q-${i}`} className="font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  {item.q}
                </p>
                <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                  {item.why}
                </p>
                <div role="radiogroup" aria-labelledby={`q-${i}`} className="flex flex-wrap gap-2">
                  {OPTIONS.map((o) => {
                    const on = answers[i] === o.value;
                    return (
                      <button
                        key={o.label}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setAnswer(i, o.value)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                        style={
                          on
                            ? { backgroundColor: "var(--primary-fill)", color: "#fff", border: "1px solid var(--primary-fill)" }
                            : { backgroundColor: "var(--bg-card)", color: "var(--text-body)", border: "1px solid var(--border-strong)" }
                        }
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* result */}
      <div className="mt-8" aria-live="polite">
        {done ? (
          <div className="card overflow-hidden" style={{ borderColor: result.tone, borderWidth: 2 }}>
            <div className="p-7" style={{ backgroundColor: result.soft }}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: "var(--text-subtle)" }}>
                {label.trim() ? `Result for: ${label.trim()}` : "Your result"}
              </p>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                <span
                  className="font-bold"
                  style={{ fontSize: "2.8rem", lineHeight: 1, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  {score}
                  <span style={{ fontSize: "1.4rem", color: "var(--text-subtle)" }}> / {max}</span>
                </span>
                <span className="text-xl font-bold" style={{ color: result.tone, fontFamily: "var(--font-display)" }}>
                  {result.title}
                </span>
              </div>
              <p className="leading-relaxed" style={{ color: "var(--text-body)" }}>
                {result.body}
              </p>
            </div>

            {gaps.length > 0 ? (
              <div className="p-7" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  Where to focus first
                </p>
                <ul className="space-y-4">
                  {gaps.map((g) => (
                    <li key={g.q} className="flex gap-3">
                      <Check className="mt-0.5 h-[18px] w-[18px] shrink-0" style={{ color: "var(--primary-text)" }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {g.q}
                        </p>
                        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {g.fix}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="p-7 flex flex-col sm:flex-row flex-wrap gap-3 print:hidden" style={{ borderTop: "1px solid var(--border)" }}>
              <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Calendar className="h-4 w-4" /> Review this with me, free
              </a>
              <a
                href={`https://wa.me/2348139464398?text=${encodeURIComponent(
                  `Hi Israel, I scored a process on your automation audit (${score}/${max}${label.trim() ? `, "${label.trim()}"` : ""}) and I would like your view.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <MessageCircle className="h-4 w-4" /> Send me your score
              </a>
              <button type="button" onClick={() => window.print()} className="btn-ghost">
                <Printer className="h-4 w-4" /> Print or save as PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  setAnswers(QUESTIONS.map(() => null));
                  setLabel("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn-ghost"
              >
                <RotateCcw className="h-4 w-4" /> Score another process
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-center py-6" style={{ color: "var(--text-subtle)" }}>
            Answer all ten questions to see your score.
          </p>
        )}
      </div>
    </div>
  );
}
