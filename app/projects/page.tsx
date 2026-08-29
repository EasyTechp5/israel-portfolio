"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowRight, ExternalLink, Bot, Users, Zap, TrendingUp } from "lucide-react";

const categories = ["All", "Automation", "AI Agents", "Training", "Consulting"];

const projects = [
  {
    title: "Lead Qualification Bot",
    category: "AI Agents",
    tags: ["n8n", "WhatsApp API", "Claude AI"],
    desc: "An AI-powered WhatsApp bot that qualifies leads 24/7 — asking the right questions, scoring responses, and routing hot leads to sales instantly.",
    outcome: "Saved 3 hours/day of manual qualification",
    icon: Bot,
    color: "blue",
  },
  {
    title: "Client Onboarding Automation",
    category: "Automation",
    tags: ["Make.com", "Airtable", "Google Workspace"],
    desc: "End-to-end onboarding workflow that collects client data, generates contracts, schedules calls, and sends welcome sequences — automatically.",
    outcome: "Reduced onboarding time from 3 hours to 0",
    icon: Zap,
    color: "cyan",
  },
  {
    title: "AI Corporate Training Program",
    category: "Training",
    tags: ["ChatGPT", "n8n", "Google Workspace"],
    desc: "Designed and delivered a 3-week AI upskilling program for a 50-person team — covering practical AI tools, prompt engineering, and automation basics.",
    outcome: "1500+ professionals trained to date",
    icon: Users,
    color: "purple",
  },
  {
    title: "Social Media Content Pipeline",
    category: "Automation",
    tags: ["n8n", "Claude AI", "YouTube API"],
    desc: "Automated content repurposing pipeline that extracts insights from YouTube videos and publishes formatted posts across multiple platforms.",
    outcome: "10x content output with zero extra effort",
    icon: TrendingUp,
    color: "green",
  },
  {
    title: "Invoice Processing System",
    category: "Automation",
    tags: ["Google Apps Script", "Airtable", "Make.com"],
    desc: "A workflow that reads incoming email invoices, extracts data, updates the database, and triggers payment reminders — no human involvement.",
    outcome: "Eliminated 5 hours/week of admin work",
    icon: Zap,
    color: "blue",
  },
  {
    title: "AI Strategy Consulting",
    category: "Consulting",
    tags: ["Strategy", "Roadmapping", "AI Audit"],
    desc: "Worked with a logistics startup to audit their manual processes, identify automation opportunities, and deliver a 6-month AI implementation roadmap.",
    outcome: "Identified 12 automation opportunities",
    icon: Bot,
    color: "purple",
  },
];

const colorMap: Record<string, { card: string; icon: string; tag: string }> = {
  blue: { card: "hover:border-blue-500/40", icon: "bg-[#0055DA]/20 border-[#0055DA]/30 text-[#6aabff]", tag: "bg-[#0055DA]/20 text-[#aaccff] border-[#0055DA]/30" },
  cyan: { card: "hover:border-cyan-500/40", icon: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400", tag: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20" },
  purple: { card: "hover:border-purple-500/40", icon: "bg-purple-500/10 border-purple-500/20 text-purple-400", tag: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
  green: { card: "hover:border-green-500/40", icon: "bg-green-500/10 border-green-500/20 text-green-400", tag: "bg-green-500/10 text-green-300 border-green-500/20" },
};

export default function ProjectsPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-[#040810] via-[#0055DA]/20 to-[#040810]">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#0055DA]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container-wide section-padding pt-32 w-full text-center">
          <span className="badge badge-blue mb-6">Projects</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6">
            Real Work.{" "}
            <span className="gradient-text">Real Results.</span>
          </h1>
          <p className="text-[#ccdaee] text-xl max-w-2xl mx-auto">
            A selection of automation systems, AI agents, and training programs I&apos;ve built and delivered.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active === c
                    ? "bg-[#0055DA] text-white shadow-lg shadow-[#0055DA]/25"
                    : "bg-white/5 text-[#ccdaee] hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => {
              const Icon = p.icon;
              const c = colorMap[p.color];
              return (
                <div key={p.title} className={`glass-card p-6 border transition-all duration-300 hover:-translate-y-1 group ${c.card}`}>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${c.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tags.map((t) => (
                      <span key={t} className={`px-2.5 py-0.5 rounded-lg border text-xs font-medium ${c.tag}`}>{t}</span>
                    ))}
                  </div>
                  <h3 className="text-white font-black text-lg mb-2">{p.title}</h3>
                  <p className="text-[#7799cc] text-sm leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/5 border border-green-500/15 mb-4">
                    <span className="text-green-400 text-xs font-semibold">Result:</span>
                    <span className="text-green-300 text-xs">{p.outcome}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#5566aa]">No projects in this category yet.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-cyan-900/20" />
        <div className="container-wide relative z-10 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Want Something Like This Built for Your Business?</h2>
          <p className="text-[#ccdaee] text-lg mb-8 max-w-xl mx-auto">Let&apos;s talk about what&apos;s possible. Book a free 20-minute discovery call.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="btn-primary py-3.5 px-8">
              <Calendar className="w-5 h-5" /> Book Free Call <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you" target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-3.5 px-8">
              <MessageCircle className="w-5 h-5" /> WhatsApp Israel
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
