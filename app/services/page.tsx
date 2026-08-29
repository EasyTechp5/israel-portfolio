import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowRight, Bot, Users, Zap, TrendingUp, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | Israel Afolabi",
  description: "AI automation solutions, corporate training, personal coaching, and consulting services by Israel Afolabi.",
};

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
    cta: "Build My Automation",
    color: "blue",
  },
  {
    icon: Users,
    title: "AI Training & Consulting",
    tagline: "Upskill your entire team",
    desc: "Corporate training programs that equip your team with practical AI skills — no fluff, just tools and workflows they can use from day one.",
    features: [
      "Team AI literacy workshops",
      "Hands-on tool training (n8n, Make.com, ChatGPT)",
      "Department-specific automation strategies",
      "Train-the-trainer programs",
      "Ongoing advisory retainers",
      "Custom learning paths",
    ],
    cta: "Book a Training Session",
    color: "purple",
  },
  {
    icon: Zap,
    title: "Personal AI Coaching",
    tagline: "Your personal AI acceleration",
    desc: "1-on-1 coaching sessions tailored to your role, goals, and current skill level. Whether you're a professional, freelancer, or entrepreneur.",
    features: [
      "Personalized AI tool recommendations",
      "Weekly 1-on-1 sessions",
      "Career AI integration roadmap",
      "Build your first automation live",
      "Access to private resource library",
      "WhatsApp support between sessions",
    ],
    cta: "Start Coaching",
    color: "cyan",
  },
  {
    icon: TrendingUp,
    title: "AI Projects & Consulting",
    tagline: "From idea to deployed system",
    desc: "End-to-end project delivery — I scope, design, build, test, and hand over a fully working automation system your team can maintain.",
    features: [
      "Project scoping & requirements analysis",
      "Architecture design & tool selection",
      "Full system build & testing",
      "Team handover & documentation",
      "Post-launch support period",
      "Scalability planning",
    ],
    cta: "Discuss My Project",
    color: "green",
  },
];

const colorMap: Record<string, { card: string; icon: string; badge: string }> = {
  blue: {
    card: "border-[#0055DA]/30 hover:border-blue-500/40",
    icon: "bg-[#0055DA]/20 border-[#0055DA]/30 text-[#6aabff]",
    badge: "bg-[#0055DA]/20 text-[#aaccff]",
  },
  purple: {
    card: "border-purple-500/20 hover:border-purple-500/40",
    icon: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    badge: "bg-purple-500/10 text-purple-300",
  },
  cyan: {
    card: "border-cyan-500/20 hover:border-cyan-500/40",
    icon: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-300",
  },
  green: {
    card: "border-green-500/20 hover:border-green-500/40",
    icon: "bg-green-500/10 border-green-500/20 text-green-400",
    badge: "bg-green-500/10 text-green-300",
  },
};

const process = [
  { step: "01", title: "Discovery Call", desc: "We talk for 20 minutes — free. I listen, ask questions, and tell you honestly what automation can and can't do for your situation." },
  { step: "02", title: "Proposal & Scope", desc: "I put together a clear proposal: what I'll build, how long it takes, and what it costs. No surprises." },
  { step: "03", title: "Build & Test", desc: "I build the system, run it through real scenarios, and make sure it works exactly as expected before handing it over." },
  { step: "04", title: "Handover & Support", desc: "You get the live system, documentation, and a support window so your team can hit the ground running." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-[#040810] via-[#0055DA]/20 to-[#040810]">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#0055DA]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container-wide section-padding pt-32 w-full text-center">
          <span className="badge badge-blue mb-6">Services</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Run on Autopilot</span>
          </h1>
          <p className="text-[#ccdaee] text-xl max-w-2xl mx-auto">
            Whether you need a complete automation build, team training, or personal coaching — I have a service designed to meet you where you are.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((s) => {
              const Icon = s.icon;
              const c = colorMap[s.color];
              return (
                <div key={s.title} className={`glass-card p-8 border transition-all duration-300 hover:-translate-y-1 ${c.card}`}>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${c.icon}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${c.badge}`}>
                    {s.tagline}
                  </span>
                  <h3 className="text-2xl font-black text-white mb-3">{s.title}</h3>
                  <p className="text-[#7799cc] leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2 mb-8">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#ccdaee]">
                        <CheckCircle2 className="w-4 h-4 text-[#6aabff] flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center"
                  >
                    <Calendar className="w-4 h-4" />
                    {s.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-white/[0.02]">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="badge badge-blue mb-4">How It Works</span>
            <h2 className="text-4xl font-black text-white mb-4">My Process</h2>
            <p className="text-[#7799cc] max-w-xl mx-auto">Simple, transparent, and built around your outcome.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <div key={p.step} className="relative glass-card p-6">
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-blue-500/50" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-[#0055DA] flex items-center justify-center font-black text-sm text-white mb-4">
                  {p.step}
                </div>
                <h3 className="text-white font-bold mb-2">{p.title}</h3>
                <p className="text-[#7799cc] text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-cyan-900/20" />
        <div className="container-wide relative z-10 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Not Sure Which Service Fits?</h2>
          <p className="text-[#ccdaee] text-lg mb-8 max-w-xl mx-auto">Book a free 20-minute call and I&apos;ll tell you exactly what would work best for your situation.</p>
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
