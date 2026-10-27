"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar, MessageCircle, ArrowRight, ArrowUpRight,
  X, ChevronLeft, ChevronRight, Check, Link2,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { categories, byCategory, type Project } from "@/lib/projects";

const CAL = "https://calendar.app.google/8Pfj98atpuSk14RH9";
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

  // Deep link: /projects?project=<slug> opens that project straight away.
  // The slug is read synchronously; opening happens on a timer so the
  // effect never sets state directly.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("project");
    if (!slug) return;
    const t = window.setTimeout(() => {
      const all = byCategory("All");
      const i = all.findIndex((p) => p.slug === slug);
      if (i >= 0) {
        setActive("All");
        setOpen(i);
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  // Keep the address bar pointing at the project on screen, so it can be shared.
  // Skipped until a project has been opened once, so it never wipes an incoming link.
  const urlTouched = useRef(false);
  useEffect(() => {
    if (!urlTouched.current) {
      if (!current) return;
      urlTouched.current = true;
    }
    const url = new URL(window.location.href);
    if (current) url.searchParams.set("project", current.slug);
    else url.searchParams.delete("project");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [current]);

  const [copied, setCopied] = useState(false);
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the address bar already has the link */
    }
  }, []);

  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "3rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div className="glow" style={{ top: "-6rem", right: "5%", width: "28rem", height: "22rem", background: "var(--primary)" }} aria-hidden />

        <div className="container-wide relative text-center">
          <div className="hero-in">
            <span className="eyebrow justify-center">Selected work</span>
            <h1 className="mb-6 mx-auto max-w-3xl">
              Automation and AI built around{" "}
              <em className="mark">the work that slows you down</em>
            </h1>
            <p className="section-lead mx-auto text-center mb-9">
              Workflows and AI agents, grouped by the kind of problem they
              solve. Open any one to see how it is built and what it is for.
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
              className="flex flex-wrap justify-center gap-y-1 mb-6"
              role="tablist"
              aria-label="Filter projects by category"
            >
              {categories.map((c) => {
                const on = active === c.name;
                return (
                  <button
                    key={c.name}
                    role="tab"
                    aria-selected={on}
                    onClick={() => { setActive(c.name); setOpen(null); }}  /* a new filter closes any open project */
                    className="tab-link"
                  >
                    {c.name}
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
                  <div className="p-6 pb-5">
                    <span className="mono-label">{p.category}</span>
                    <h2 className="mt-3 mb-2.5" style={{ fontSize: "clamp(1.4rem, 2vw, 1.75rem)", lineHeight: 1.15 }}>
                      {p.outcome}
                    </h2>
                    <p className="mono-label" style={{ letterSpacing: "0.08em" }}>{p.title}</p>
                  </div>

                  {/* Screenshot */}
                  <div
                    className="relative mt-auto w-full flex-shrink-0"
                    style={{ aspectRatio: "16 / 10", backgroundColor: "var(--bg-inset)", borderTop: "1px solid var(--border)" }}
                  >
                    <Image
                      src={p.image}
                      alt={`${p.title} — build screenshot`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-5">
                    {p.tools.slice(0, 3).map((t) => (
                      <span key={t} className="chip" style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem" }}>{t}</span>
                    ))}
                    {p.tools.length > 3 && (
                      <span className="chip" style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem" }}>
                        +{p.tools.length - 3}
                      </span>
                    )}
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
              className="relative w-full max-w-4xl rounded-xl overflow-hidden my-8"
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
                <span className="mono-label">{current.category}</span>
                <h2 className="mt-3 mb-2" style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)" }}>
                  {current.outcome}
                </h2>
                <p className="mono-label mb-6" style={{ letterSpacing: "0.08em" }}>{current.title}</p>

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
                  <button type="button" onClick={copyLink} className="btn-ghost">
                    {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                    {copied ? "Link copied" : "Copy link to this project"}
                  </button>
                </div>

                <p className="text-xs mt-6 text-center" style={{ color: "var(--text-subtle)" }}>
                  Use the arrow keys to browse
                </p>
              </div>
            </article>
          </div>
        </div>
      )}
    </>
  );
}
