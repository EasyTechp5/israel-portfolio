import Image from "next/image";
import Link from "next/link";
import {
  Calendar, MessageCircle, ArrowRight, Bot, Zap, Users,
  CheckCircle2, Star, ChevronRight, TrendingUp, Shield, Clock,
} from "lucide-react";

const stats = [
  { value: "1500+", label: "Professionals Trained" },
  { value: "10+", label: "Organizations Served" },
  { value: "3+", label: "Years Automating" },
  { value: "100%", label: "Client Satisfaction" },
];

const services = [
  {
    icon: Bot,
    title: "AI & Automation Solutions",
    desc: "Custom workflows built with n8n, Make.com, and AI agents that run 24/7 without human intervention.",
    color: "blue",
  },
  {
    icon: Users,
    title: "AI Training & Consulting",
    desc: "Corporate training programs that upskill your team to leverage AI tools confidently and effectively.",
    color: "purple",
  },
  {
    icon: Zap,
    title: "Personal AI Coaching",
    desc: "1-on-1 sessions tailored to your role — whether you're a professional, entrepreneur, or team lead.",
    color: "cyan",
  },
  {
    icon: TrendingUp,
    title: "AI Projects & Consulting",
    desc: "End-to-end project delivery — from scoping and design to deployment and handover.",
    color: "green",
  },
];

const tools = [
  { name: "n8n", cat: "Automation" },
  { name: "Make.com", cat: "Automation" },
  { name: "Claude AI", cat: "AI" },
  { name: "ChatGPT", cat: "AI" },
  { name: "Google Apps Script", cat: "Automation" },
  { name: "Google Workspace", cat: "Productivity" },
  { name: "Airtable", cat: "Database" },
  { name: "Slack", cat: "Integration" },
  { name: "WhatsApp API", cat: "Integration" },
  { name: "Zapier", cat: "Automation" },
  { name: "Webhooks", cat: "Integration" },
  { name: "YouTube API", cat: "API" },
];

const testimonials = [
  {
    text: "Israel built an automation that processes all our client onboarding — what used to take 3 hours now takes zero human time.",
    name: "Business Owner",
    role: "Lagos, Nigeria",
  },
  {
    text: "The training was eye-opening. I went from zero to building my own AI workflows in two weeks.",
    name: "Corporate Professional",
    role: "HR Manager",
  },
  {
    text: "Our lead generation bot runs 24/7, qualifying prospects while we sleep. ROI was immediate.",
    name: "Startup Founder",
    role: "Tech Startup",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  green: "bg-green-500/10 border-green-500/20 text-green-400",
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="badge badge-blue mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Available for AI Projects &amp; Consulting
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
                I Build{" "}
                <span className="gradient-text">AI Systems</span>{" "}
                That Make Your Business{" "}
                <span className="relative">
                  Run Itself
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 9C50 3 150 1 298 9" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-slate-300 text-xl leading-relaxed mb-8 max-w-lg">
                I design intelligent automation systems that eliminate manual work, train teams to harness AI effectively, and help businesses scale — faster, leaner, smarter.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary py-3.5 px-8 text-base"
                >
                  <Calendar className="w-5 h-5" />
                  Book Free 20-Min Call
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary py-3.5 px-8 text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-black text-white">{s.value}</p>
                    <p className="text-slate-400 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl blur-2xl scale-110" />
                <div className="relative w-72 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[450px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src="/images/israel-hero.jpg"
                    alt="Israel Afolabi — AI Automation Specialist"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>

                <div className="absolute -bottom-4 -left-4 glass-card px-4 py-3 shadow-xl">
                  <p className="text-white font-black text-xl">1500+</p>
                  <p className="text-slate-300 text-xs">People Trained</p>
                </div>

                <div className="absolute -top-4 -right-4 glass-card px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <p className="text-green-400 text-xs font-semibold">n8n Workflow Active</p>
                  </div>
                  <p className="text-slate-400 text-xs">Running 24/7 automatically</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="badge badge-blue mb-4">Services</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              What I Do For Your Business
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              From full automation builds to team training — everything you need to operate intelligently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="glass-card p-8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${colorMap[s.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3">{s.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-5">{s.desc}</p>
                  <Link href="/services" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors group-hover:gap-3">
                    Learn more <ChevronRight className="w-4 h-4 transition-all" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/services" className="btn-secondary">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Me */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge badge-blue mb-6">Why Israel?</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Real Systems. Real Results.
              </h2>
              <div className="space-y-5">
                {[
                  { icon: CheckCircle2, title: "3+ Years of Automation Experience", desc: "Hands-on expertise with real business deployments — not theory." },
                  { icon: Shield, title: "Trusted by 10+ Organizations", desc: "From startups to established brands across Nigeria and beyond." },
                  { icon: Clock, title: "Fast Turnaround", desc: "Most automation systems delivered and running within days." },
                  { icon: Star, title: "Trainer of 1500+ Professionals", desc: "Proven ability to simplify AI for any skill level." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{item.title}</p>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.name} className="glass-card p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4">Tech Stack</span>
            <h2 className="text-4xl font-black text-white mb-4">Tools I Use to Build Your Systems</h2>
            <p className="text-slate-400 max-w-xl mx-auto">The exact tools that power every automation, AI agent, and workflow.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((t) => (
              <div
                key={t.name}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all cursor-default"
              >
                <span className="text-white font-semibold text-sm">{t.name}</span>
                <span className="ml-2 text-slate-500 text-xs">{t.cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-cyan-900/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="container-wide relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Ready to Automate Your Business?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Book a free 20-minute call — no pitch, no obligation, just honest advice on what automation can do for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-4 px-10 text-base"
              >
                <Calendar className="w-5 h-5" />
                Book Free Call
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-4 px-10 text-base"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Israel
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
