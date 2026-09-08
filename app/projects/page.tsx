"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar, MessageCircle, ArrowRight, ArrowUpRight,
  X, ChevronLeft, ChevronRight, Check,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { projects, categories, byCategory, type Project } from "@/lib/projects";

const CAL = "https://calendar.app.google/6EJ6aPfh3ScRUw6V9";
const WA = "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20saw%20your%20work%20and%20I%20am%20interested%20in%20your%20AI%20automation%20services";

/* What I'm strongest at, and where I'll tell you not to automate. */
const strengths = [
  "Workflow automation across n8n, Make.com and Zapier",
  "AI agents with tool use, memory and retrieval",
  "Connecting systems that were never meant to talk",
  "Voice and chat agents that hand off cleanly to a human",
  "Building it so your team can maintain it after handover",
];

const boundaries = [
  "Processes that change every month — you'll spend more maintaining it than you save",
  "Tasks that run a handful of times a year — the build rarely pays back",
  "Work where nobody can explain the current rules — fix the process first",
  "Decisions where being wrong is costly and the output can't be checked",
];

export default function ProjectsPage() {
  const [active, setActive] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = useMemo(() => byCategory(active), [active]);
  const blurb = categories.find((c) => c.name === active)?.blurb ?? "";

  // Reset the lightbox when the filter changes so the index can't dangle
  useEffect(() => setOpen(null), [active]);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  const current: Project | null = open === null ? null : filtered[open];

  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "3rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div className="glow" style={{ top: "-6rem", right: "5%", width: "28rem", height: "22rem", background: "var(--primary)" }} aria-hidden />

        <div className="container-wide relative text-center">
          <div className="hero-in">
            <span className="eyebrow justify-center">Selected work</span>
            <h1 className="mb-6 mx-auto max-w-3xl" style={{ fontWeight: 800 }}>
              {projects.length} systems I have built that{" "}
              <span style={{ color: "var(--primary-text)" }}>gave time back</span>
            </h1>
            <p className="section-lead mx-auto text-center mb-9">
              Automation workflows, AI agents and advisory work — grouped by the kind of
              problem they solve. Click any project to see the build.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
                <Calendar className="w-[18px] h-[18px]" /> Book a free call <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/service-packages" className="btn-secondary btn-lg">
                See pricing <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FILTER + GRID ══════════════ */}
      <section className="section-padding" style={{ paddingTop: "2rem" }}>
        <div className="container-wide">

          <Reveal>
            <div
              className="flex flex-wrap justify-center gap-2 mb-5"
              role="tablist"
              aria-label="Filter projects by category"
            >
              {categories.map((c) => {
                const on = active === c.name;
                const count = byCategory(c.name).length;
                return (
                  <button
                    key={c.name}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(c.name)}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
                    style={
                      on
                        ? { backgroundColor: "var(--primary-fill)", color: "#fff", boxShadow: "var(--shadow-brand)" }
                        : { backgroundColor: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }
                    }
                  >
                    {c.name}
                    <span
                      className="ml-1.5 text-xs"
                      style={{ opacity: on ? 0.75 : 0.55 }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-sm mb-12" style={{ color: "var(--text-subtle)" }}>
              {blurb}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 8) * 50}>
                <button
                  onClick={() => setOpen(i)}
                  aria-label={`View details: ${p.title}`}
                  className="card card-hover h-full w-full flex flex-col overflow-hidden text-left"
                >
                  {/* Screenshot */}
                  <div
                    className="relative w-full flex-shrink-0"
                    style={{ aspectRatio: "16 / 10", backgroundColor: "var(--bg-inset)" }}
                  >
                    <Image
                      src={p.image}
                      alt={`${p.title} — build screenshot`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <span className="badge badge-blue mb-3 self-start">{p.category}</span>

                    <h2 className="mb-2.5" style={{ fontSize: "1.05rem", lineHeight: 1.35 }}>
                      {p.title}
                    </h2>

                    <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-muted)" }}>
                      {p.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {p.tools.slice(0, 3).map((t) => (
                        <span key={t} className="chip text-xs" style={{ padding: "0.2rem 0.5rem" }}>{t}</span>
                      ))}
                      {p.tools.length > 3 && (
                        <span className="chip text-xs" style={{ padding: "0.2rem 0.5rem" }}>
                          +{p.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW I WORK ══════════════ */}
      <section className="section-padding section-alt" style={{ borderBlock: "1px solid var(--border)" }}>
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow">How I work</span>
              <h2 className="mb-4">What I am strongest at — and what I will talk you out of</h2>
              <p className="section-lead">
                Anyone can list what they do. The more useful half is knowing where
                automation stops paying for itself.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Reveal>
              <div className="card p-8 h-full">
                <h3 className="mb-5">Where I add the most value</h3>
                <ul className="space-y-3">
                  {strengths.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <Check className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: "var(--success)" }} />
                      <span className="text-sm" style={{ color: "var(--text-body)" }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="card p-8 h-full">
                <h3 className="mb-5">Where I will tell you not to automate</h3>
                <ul className="space-y-3">
                  {boundaries.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <X className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: "var(--accent-text)" }} />
                      <span className="text-sm" style={{ color: "var(--text-body)" }}>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm mt-6 pt-5" style={{ color: "var(--text-subtle)", borderTop: "1px solid var(--border)" }}>
                  Turning down the wrong project is cheaper for both of us than finishing it.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="section-padding">
        <div className="container-wide">
          <Reveal>
            <div
              className="rounded-3xl px-8 py-14 sm:px-14 sm:py-16 text-center"
              style={{ background: "linear-gradient(135deg, var(--primary-fill) 0%, #003a96 100%)", boxShadow: "var(--shadow-xl)" }}
            >
              <h2 className="mb-4" style={{ color: "#fff" }}>Want something like this built for your business?</h2>
              <p className="text-lg mb-9 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.84)" }}>
                Every system here started as a 20-minute conversation about where time was
                being lost. Tell me what is eating your week.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: "#fff", color: "var(--primary-text)", boxShadow: "var(--shadow-lg)" }}
                >
                  <MessageCircle className="w-[18px] h-[18px]" /> DM me on WhatsApp
                </a>
                <a
                  href={CAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl font-semibold"
                  style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  <Calendar className="w-[18px] h-[18px]" /> Book a free call
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ LIGHTBOX ══════════════ */}
      {current && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto"
          style={{ backgroundColor: "rgba(4,7,12,0.94)", backdropFilter: "blur(6px)" }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
        >
          <div className="min-h-full flex items-center justify-center p-4 sm:p-8">
            <button
              onClick={close}
              aria-label="Close"
              className="fixed top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "#fff" }}
            >
              <X className="w-5 h-5" />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous project"
                  className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10"
                  style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "#fff" }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next project"
                  className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10"
                  style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "#fff" }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <article
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden my-8"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ aspectRatio: "16 / 10", backgroundColor: "var(--bg-inset)" }}>
                <Image
                  src={current.image}
                  alt={`${current.title} — build screenshot`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 56rem"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="p-7 sm:p-9">
                <span className="badge badge-blue mb-4">{current.category}</span>
                <h2 className="mb-4" style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.85rem)" }}>
                  {current.title}
                </h2>

                <p className="leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                  {current.desc}
                </p>

                <div
                  className="rounded-xl p-5 mb-6"
                  style={{ backgroundColor: "var(--primary-soft)", border: "1px solid var(--primary-line)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: "var(--primary-text)" }}>
                    What this does for you
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>
                    {current.helps}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-7">
                  {current.tools.map((t) => (
                    <span key={t} className="chip text-xs">{t}</span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/2348139464398?text=${encodeURIComponent(
                      `Hi Israel, I saw your "${current.title}" project and I would like something similar for my business.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <MessageCircle className="w-4 h-4" /> Ask about this build
                  </a>
                  <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <Calendar className="w-4 h-4" /> Book a call
                  </a>
                </div>

                <p className="text-xs mt-6 text-center" style={{ color: "var(--text-subtle)" }}>
                  {(open ?? 0) + 1} of {filtered.length} in {active === "All" ? "all projects" : active}
                </p>
              </div>
            </article>
          </div>
        </div>
      )}
    </>
  );
}
