import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowRight, CheckCircle2, Quote, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Israel Afolabi",
  description: "From Mathematics teacher to AI Engineer, Automation Specialist, and AI Consultant — the story of Israel Afolabi.",
};

const timeline = [
  {
    year: "2021 – 2023",
    role: "Mathematics Teacher",
    desc: "I started my career teaching Mathematics and impacting young minds. Teaching taught me that complex problems can be broken down, simplified, and solved when you understand the fundamentals.",
    tools: [] as string[],
    impact: null as string | null,
    isCurrent: false,
  },
  {
    year: "2023",
    role: "Data Analysis Instructor",
    desc: "I transitioned into Data Analysis and began helping people understand how to turn raw data into meaningful insights. Teaching Data Analysis taught me how to simplify complex technical concepts, communicate insights clearly, and help people use technology to solve real problems.",
    tools: ["Excel", "Power BI", "SQL", "MicroStrategy"],
    impact: "1,000+ learners trained",
    isCurrent: false,
  },
  {
    year: "2024",
    role: "Business Intelligence Analyst",
    desc: "I moved from teaching people how to work with data to using data to solve real business problems.",
    tools: ["Excel", "Power BI", "SQL", "Python"],
    impact: null,
    isCurrent: false,
  },
  {
    year: "2025",
    role: "AI Engineer → AI Automation Specialist",
    desc: "I built AI-powered applications and automation systems that could do more than analyze information — they could take action.",
    tools: ["n8n", "Make", "Zapier", "Google Apps Script", "Power Automate", "Lovable", "Base44", "Replit", "GitHub", "LangChain", "Streamlit", "Supabase", "Docker"],
    impact: null,
    isCurrent: false,
    toolGroups: [
      { label: "AI & Automation", items: ["n8n", "Make", "Zapier", "Google Apps Script", "Power Automate"] },
      { label: "Development & Building", items: ["Lovable", "Base44", "Replit", "GitHub"] },
      { label: "AI Engineering", items: ["LangChain", "Streamlit", "Supabase", "Docker"] },
    ],
  },
  {
    year: "2026",
    role: "AI Consultant & Strategist",
    desc: "I now work with founders and business leaders to identify opportunities where AI can transform their operations — improving productivity, automating repetitive processes, reducing operational bottlenecks, redesigning workflows, improving decision-making, and building scalable business systems.",
    tools: [],
    impact: null,
    isCurrent: true,
    focus: ["Agentic AI", "AI Automation", "AI Strategy", "Claude", "Codex"],
    outcomes: ["Improve productivity", "Automate repetitive processes", "Reduce operational bottlenecks", "Redesign workflows", "Improve decision-making", "Build scalable systems"],
  },
];

const credentials = [
  "AI & Automation Specialist (3+ years)",
  "Founder, EasyTech Academy",
  "1500+ individuals trained",
  "10+ organizations consulted",
  "Expert in n8n, Make.com & Claude AI",
  "Google Apps Script practitioner",
  "Trusted by teams across multiple industries",
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: "7rem", paddingBottom: "5rem", background: "linear-gradient(135deg, var(--bg) 0%, var(--primary-soft) 60%, var(--bg) 100%)" }}
      >
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "var(--primary-soft)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "var(--accent-soft)" }} />

        <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div>
              <span className="badge badge-blue mb-5">About Israel</span>

              <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-3" style={{ color: "var(--text-primary)" }}>
                Israel <span style={{ color: "var(--primary-text)" }}>Afolabi</span>
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {["AI Engineer", "AI Automation Specialist", "Agentic AI Builder"].map((r) => (
                  <span key={r} className="badge badge-blue">{r}</span>
                ))}
              </div>

              <div className="relative pl-5 mb-8" style={{ borderLeft: "3px solid var(--primary)" }}>
                <p className="text-xl font-bold italic" style={{ color: "var(--text-primary)" }}>
                  &ldquo;I didn&apos;t start my career in AI.&rdquo;
                </p>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  I started in the classroom. My journey from teaching Mathematics to building AI-powered systems and advising businesses has been one of continuous learning, problem-solving, and transformation.
                </p>
              </div>

              <div className="card p-5 rounded-2xl mb-8">
                <Quote className="w-6 h-6 mb-2" style={{ color: "var(--primary-text)" }} />
                <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  Don&apos;t start with the AI tool.
                </p>
                <p className="font-bold text-lg" style={{ color: "var(--primary-text)" }}>
                  Start with the business problem.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Calendar className="w-4 h-4" /> Book Free Call <ArrowRight className="w-4 h-4" />
                </a>
                <a href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Israel
                </a>
              </div>
            </div>

            {/* Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl blur-2xl scale-105" style={{ background: "linear-gradient(135deg, var(--primary-line), var(--accent-soft))" }} />
                <div className="relative w-72 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl" style={{ border: "2px solid var(--primary-line)" }}>
                  <Image src="/images/israel-hero.jpg" alt="Israel Afolabi" fill className="object-cover object-top" priority />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(4,8,16,0.5) 0%, transparent 50%)" }} />
                  {/* Sits on the photo, so it stays dark in both themes */}
                  <div
                    className="absolute bottom-4 left-4 right-4 p-3 rounded-xl"
                    style={{
                      backgroundColor: "rgba(6, 9, 15, 0.72)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <p className="font-bold text-sm" style={{ color: "#ffffff" }}>Israel Afolabi</p>
                    <p className="text-xs" style={{ color: "#8fbaff" }}>AI Engineer · EasyTech Academy</p>
                  </div>
                </div>
                <div className="absolute -top-5 -right-5 card px-4 py-3 shadow-xl rounded-xl" style={{ border: "1px solid var(--primary-line)" }}>
                  <p className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>1500+</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>People Trained</p>
                </div>
                <div className="absolute -bottom-5 -left-5 card px-4 py-3 shadow-xl rounded-xl" style={{ border: "1px solid var(--primary-line)" }}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "var(--success)" }} />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: "var(--success)" }} />
                    </span>
                    <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>Available for projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Career Timeline ───────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: "var(--bg-surface, var(--bg))" }}>
        <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-blue mb-4">Career Journey</span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>From Classroom to AI</h2>
            <p className="max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
              A story of continuous learning, transformation, and building intelligent systems.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5" style={{ backgroundColor: "var(--primary-line)" }} />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-16 sm:pl-20">
                  <div
                    className="absolute left-3 sm:left-5 top-6 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: item.isCurrent ? "var(--accent)" : "var(--primary)",
                      boxShadow: `0 0 12px ${item.isCurrent ? "color-mix(in srgb, var(--accent) 45%, transparent)" : "var(--primary-line)"}`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  <div className="card p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                    style={{ borderColor: item.isCurrent ? "color-mix(in srgb, var(--accent) 26%, transparent)" : "var(--primary-soft)" }}>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: item.isCurrent ? "var(--accent-soft)" : "var(--primary-soft)",
                          color: item.isCurrent ? "var(--accent-text)" : "var(--primary-text)",
                        }}>
                        {item.year}
                      </span>
                      {item.isCurrent && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--success-soft)", color: "var(--success)" }}>
                          Current
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>{item.role}</h3>
                    <p className="mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>

                    {item.impact && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-sm font-semibold"
                        style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary-text)" }}>
                        ✦ {item.impact}
                      </div>
                    )}

                    {"toolGroups" in item && item.toolGroups ? (
                      <div className="space-y-3">
                        {item.toolGroups.map((g) => (
                          <div key={g.label}>
                            <p className="text-xs font-bold mb-1.5" style={{ color: "var(--primary-text)" }}>→ {g.label}</p>
                            <div className="flex flex-wrap gap-2">
                              {g.items.map((t) => (
                                <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                                  style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary-text)", border: "1px solid var(--primary-line)" }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : item.tools && item.tools.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {item.tools.map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary-text)", border: "1px solid var(--primary-line)" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {"focus" in item && item.focus && (
                      <div className="mt-4">
                        <p className="text-xs font-bold mb-2" style={{ color: "var(--accent-text)" }}>Current Focus Areas</p>
                        <div className="flex flex-wrap gap-2">
                          {item.focus.map((f) => (
                            <span key={f} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-text)", border: "1px solid color-mix(in srgb, var(--accent) 26%, transparent)" }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Credentials + Mission ─────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="badge badge-blue mb-5">Credentials</span>
              <h2 className="text-4xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>What I Bring to the Table</h2>
              <ul className="space-y-3">
                {credentials.map((c) => (
                  <li key={c} className="flex items-start gap-3 card p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--primary-text)" }} />
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="badge badge-blue mb-5">Mission</span>
              <h2 className="text-4xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>The Mission</h2>
              <div className="card p-8 rounded-2xl relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl" style={{ backgroundColor: "var(--primary-soft)" }} />
                <Quote className="w-10 h-10 mb-4" style={{ color: "var(--primary-line)" }} />
                <p className="text-xl font-bold leading-snug mb-6 pl-4" style={{ color: "var(--text-primary)", borderLeft: "3px solid var(--primary)" }}>
                  I design intelligent systems that replace manual work with automation — while training a generation of professionals to thrive in an AI-first world.
                </p>
                <p className="font-semibold" style={{ color: "var(--text-muted)" }}>
                  Goal: Train <span className="font-bold" style={{ color: "var(--primary-text)" }}>1 million people</span> in AI and automation.
                </p>
              </div>

              <div className="card p-6 rounded-2xl">
                <p className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>My Philosophy</p>
                <p className="text-2xl font-bold mb-1" style={{ color: "var(--primary-text)" }}>Don&apos;t start with the AI tool.</p>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Start with the business problem.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--primary-soft) 0%, var(--accent-soft) 100%)" }} />
        <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Ready to Work With Israel?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Let&apos;s talk about how AI can transform your business. First call is free — no pitch, just honest advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="btn-primary py-3.5 px-8">
              <Calendar className="w-5 h-5" /> Book Free Call <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you" target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-3.5 px-8">
              <MessageCircle className="w-5 h-5" /> WhatsApp Israel
            </a>
            <Link href="/resume" className="btn-secondary py-3.5 px-8">
              <ArrowUpRight className="w-5 h-5" /> View My Resume
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
