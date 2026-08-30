"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowRight, Bot, Users, Zap, TrendingUp, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const CAL = "https://calendar.app.google/6EJ6aPfh3ScRUw6V9";
const WA = "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you";

const categories = ["All", "Automation", "AI Agents", "Training", "Consulting"];

const projects = [
  {
    title: "Lead Qualification Bot",
    category: "AI Agents",
    tags: ["n8n", "WhatsApp API", "Claude AI"],
    desc: "An AI-powered WhatsApp bot that qualifies leads 24/7 — asking the right questions, scoring responses and routing hot leads to sales instantly.",
    outcome: "Saved 3 hours a day of manual qualification",
    icon: Bot,
  },
  {
    title: "Client Onboarding Automation",
    category: "Automation",
    tags: ["Make.com", "Airtable", "Google Workspace"],
    desc: "End-to-end onboarding workflow that collects client data, generates contracts, schedules calls and sends welcome sequences — automatically.",
    outcome: "Onboarding time cut from 3 hours to zero",
    icon: Zap,
  },
  {
    title: "AI Corporate Training Programme",
    category: "Training",
    tags: ["Claude AI", "n8n", "Google Workspace"],
    desc: "Designed and delivered a three-week AI upskilling programme for a 50-person team — covering practical AI tools, prompting and automation basics.",
    outcome: "1,500+ professionals trained to date",
    icon: Users,
  },
  {
    title: "Social Media Content Pipeline",
    category: "Automation",
    tags: ["n8n", "Claude AI", "YouTube API"],
    desc: "Automated content repurposing pipeline that extracts insights from long-form video and publishes formatted posts across multiple platforms.",
    outcome: "10× content output with no extra effort",
    icon: TrendingUp,
  },
  {
    title: "Invoice Processing System",
    category: "Automation",
    tags: ["Google Apps Script", "Airtable", "Make.com"],
    desc: "A workflow that reads incoming email invoices, extracts the data, updates the database and triggers payment reminders — with no human involvement.",
    outcome: "Eliminated 5 hours a week of admin work",
    icon: Zap,
  },
  {
    title: "AI Strategy Consulting",
    category: "Consulting",
    tags: ["Strategy", "Roadmapping", "AI Audit"],
    desc: "Worked with a logistics startup to audit their manual processes, identify automation opportunities and deliver a six-month implementation roadmap.",
    outcome: "Identified 12 automation opportunities",
    icon: Bot,
  },
];

export default function ProjectsPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

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
              Systems I have built that <span style={{ color: "var(--primary-text)" }}>gave time back</span>
            </h1>
            <p className="section-lead mx-auto text-center">
              A sample of automation systems, AI agents and training programmes delivered
              for real businesses — and what each one changed.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ FILTER + GRID ══════════════ */}
      <section className="section-padding" style={{ paddingTop: "2.5rem" }}>
        <div className="container-wide">

          <Reveal>
            <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Filter projects">
              {categories.map((c) => {
                const on = active === c;
                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(c)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={
                      on
                        ? { backgroundColor: "var(--primary-fill)", color: "#fff", boxShadow: "var(--shadow-brand)" }
                        : { backgroundColor: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 60}>
                  <article className="card card-hover p-7 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "var(--primary-soft)", border: "1px solid var(--primary-line)" }}
                      >
                        <Icon className="w-5 h-5" style={{ color: "var(--primary-text)" }} />
                      </div>
                      <span className="badge badge-neutral">{p.category}</span>
                    </div>

                    <h3 className="mb-2.5">{p.title}</h3>
                    <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "var(--text-muted)" }}>{p.desc}</p>

                    <div
                      className="rounded-lg px-3.5 py-2.5 mb-5 text-sm font-medium"
                      style={{ backgroundColor: "var(--success-soft)", color: "var(--success)" }}
                    >
                      ↑ {p.outcome}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="chip text-xs" style={{ padding: "0.25rem 0.5rem" }}>{t}</span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="section-padding section-alt" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container-wide">
          <Reveal>
            <div className="card p-10 sm:p-14 text-center">
              <h2 className="mb-4">Want something like this built for your business?</h2>
              <p className="section-lead mx-auto mb-9 text-center">
                Every system here started as a 20-minute conversation about where time was
                being lost. Yours can too.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
                  <Calendar className="w-[18px] h-[18px]" /> Book a free call <ArrowRight className="w-4 h-4" />
                </a>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
                  <MessageCircle className="w-[18px] h-[18px]" /> WhatsApp Israel
                </a>
                <Link href="/service-packages" className="btn-secondary btn-lg">
                  View pricing <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
