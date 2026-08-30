import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowRight, Bot, Users, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services | Israel Afolabi",
  description: "AI automation solutions, corporate training, personal coaching, and end-to-end project consulting by Israel Afolabi.",
};

const CAL = "https://calendar.app.google/6EJ6aPfh3ScRUw6V9";
const WA = "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you";

const services = [
  {
    icon: Bot,
    title: "AI & Automation Solutions",
    tagline: "Let your business run itself",
    desc: "I design and deploy end-to-end automation systems tailored to your business — from lead generation bots to full data processing pipelines.",
    features: [
      "Custom n8n & Make.com workflow builds",
      "AI chatbots for lead qualification & support",
      "Data extraction & processing automation",
      "WhatsApp & Slack notification systems",
      "CRM & database integrations",
      "24/7 automated reporting",
    ],
    cta: "Build my automation",
  },
  {
    icon: Users,
    title: "AI Training & Consulting",
    tagline: "Upskill your entire team",
    desc: "Corporate training programmes that equip your team with practical AI skills — no fluff, just tools and workflows they can use from day one.",
    features: [
      "Team AI literacy workshops",
      "Hands-on tool training (n8n, Make.com, Claude)",
      "Department-specific automation strategies",
      "Train-the-trainer programmes",
      "Ongoing advisory retainers",
      "Custom learning paths",
    ],
    cta: "Book a training session",
  },
  {
    icon: Zap,
    title: "Personal AI Coaching",
    tagline: "Your personal AI acceleration",
    desc: "One-to-one coaching tailored to your role, goals and current skill level — whether you are a professional, freelancer or entrepreneur.",
    features: [
      "Personalised AI tool recommendations",
      "Weekly 1-on-1 sessions",
      "Career AI integration roadmap",
      "Build your first automation live",
      "Access to a private resource library",
      "WhatsApp support between sessions",
    ],
    cta: "Start coaching",
  },
  {
    icon: TrendingUp,
    title: "AI Projects & Consulting",
    tagline: "From idea to deployed system",
    desc: "End-to-end project delivery — I scope, design, build, test and hand over a fully working system your team can maintain.",
    features: [
      "Project scoping & requirements analysis",
      "Architecture design & tool selection",
      "Full system build & testing",
      "Team handover & documentation",
      "Post-launch support period",
      "Scalability planning",
    ],
    cta: "Discuss my project",
  },
];

const process = [
  { step: "01", title: "Discovery call", desc: "We talk for 20 minutes — free. I listen, ask questions, and tell you honestly what automation can and cannot do for your situation." },
  { step: "02", title: "Proposal & scope", desc: "I put together a clear proposal: what I will build, how long it takes and what it costs. No surprises." },
  { step: "03", title: "Build & test", desc: "I build the system, run it through real scenarios, and make sure it works exactly as expected before handing it over." },
  { step: "04", title: "Handover & support", desc: "You get the live system, documentation and a support window so your team can hit the ground running." },
];

export default function ServicesPage() {
  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "4rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div className="glow" style={{ top: "-6rem", left: "10%", width: "30rem", height: "24rem", background: "var(--primary)" }} aria-hidden />

        <div className="container-wide relative text-center">
          <div className="hero-in">
            <span className="eyebrow justify-center">Services</span>
            <h1 className="mb-6 mx-auto max-w-4xl" style={{ fontWeight: 800 }}>
              Everything you need to <span style={{ color: "var(--primary-text)" }}>operate intelligently</span>
            </h1>
            <p className="section-lead mx-auto mb-9 text-center">
              Whether you need a system built, a team trained, or a second opinion on your
              AI strategy — here is exactly how I can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
                <Calendar className="w-[18px] h-[18px]" /> Book a free call <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/service-packages" className="btn-secondary btn-lg">
                See pricing &amp; packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SERVICES ══════════════ */}
      <section className="section-padding" style={{ paddingTop: "3rem" }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 70}>
                  <div className="card card-hover p-8 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "var(--primary-soft)", border: "1px solid var(--primary-line)" }}
                      >
                        <Icon className="w-[22px] h-[22px]" style={{ color: "var(--primary-text)" }} />
                      </div>
                      <div>
                        <h2 className="text-xl mb-1" style={{ fontSize: "1.375rem" }}>{s.title}</h2>
                        <p className="text-sm font-medium" style={{ color: "var(--primary-text)" }}>{s.tagline}</p>
                      </div>
                    </div>

                    <p className="leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{s.desc}</p>

                    <ul className="space-y-2.5 mb-7">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-body)" }}>
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--primary-text)" }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`https://wa.me/2348139464398?text=${encodeURIComponent(`Hi Israel, I am interested in: ${s.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full mt-auto"
                    >
                      {s.cta} <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ PROCESS ══════════════ */}
      <section className="section-padding section-alt" style={{ borderBlock: "1px solid var(--border)" }}>
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <span className="eyebrow">The process</span>
              <h2 className="mb-4">How we work together</h2>
              <p className="section-lead">
                Four stages, clearly defined. You always know where the project stands.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 80}>
                <div className="card card-hover p-7 h-full">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold mb-5"
                    style={{ backgroundColor: "var(--primary-fill)", color: "#fff", fontFamily: "var(--font-display)" }}
                  >
                    {p.step}
                  </span>
                  <h3 className="mb-2">{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
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
              <h2 className="mb-4" style={{ color: "#fff" }}>Not sure which service fits?</h2>
              <p className="text-lg mb-9 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.82)" }}>
                Tell me about your business on a free call and I will point you to the right
                option — even if that turns out to be no service at all.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={CAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: "#fff", color: "var(--primary-text)", boxShadow: "var(--shadow-lg)" }}
                >
                  <Calendar className="w-[18px] h-[18px]" /> Book free call <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl font-semibold"
                  style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)" }}
                >
                  <MessageCircle className="w-[18px] h-[18px]" /> WhatsApp Israel
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
