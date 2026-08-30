import Image from "next/image";
import Link from "next/link";
import {
  Calendar, MessageCircle, ArrowRight, Bot, Zap, Users, TrendingUp,
  CheckCircle2, Star, Search, PenTool, Rocket, LifeBuoy, Quote,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Faq from "@/components/Faq";

const CAL = "https://calendar.app.google/6EJ6aPfh3ScRUw6V9";
const WA = "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you";

const stats = [
  { value: "1,500+", label: "Professionals trained" },
  { value: "10+", label: "Organizations served" },
  { value: "3+", label: "Years automating" },
  { value: "50+", label: "Systems delivered" },
];

const services = [
  {
    icon: Bot,
    title: "AI & Automation Systems",
    desc: "Custom workflows built with n8n, Make.com and AI agents that run 24/7 without human intervention.",
    points: ["Workflow automation", "AI agents", "System integrations"],
  },
  {
    icon: Users,
    title: "AI Training & Consulting",
    desc: "Corporate programmes that upskill your team to use AI tools confidently and effectively.",
    points: ["Team workshops", "Hands-on labs", "Adoption roadmaps"],
  },
  {
    icon: Zap,
    title: "Personal AI Coaching",
    desc: "One-to-one sessions tailored to your role — whether you lead a team or run the whole business.",
    points: ["1-on-1 sessions", "Role-specific", "Practical outcomes"],
  },
  {
    icon: TrendingUp,
    title: "End-to-End Delivery",
    desc: "From scoping and design through to deployment, documentation and handover.",
    points: ["Discovery & scoping", "Build & test", "Deploy & handover"],
  },
];

const process = [
  { icon: Search, step: "01", title: "Discover", desc: "We map your current workflow and find exactly where time and money leak out of the business." },
  { icon: PenTool, step: "02", title: "Design", desc: "I architect the automation — the tools, the logic, the fail-safes — and show you the plan before a line is built." },
  { icon: Rocket, step: "03", title: "Deploy", desc: "The system goes live, gets tested against real data, and your team is trained to run it." },
  { icon: LifeBuoy, step: "04", title: "Support", desc: "Post-launch monitoring and refinements, so the system keeps performing as your business grows." },
];

const tools = [
  "n8n", "Make.com", "Claude AI", "OpenAI", "Google Apps Script", "LangChain",
  "Supabase", "Airtable", "Zapier", "Power Automate", "WhatsApp API", "Streamlit",
  "Docker", "Python", "Power BI", "Telegram API",
];

const testimonials = [
  {
    text: "Israel built an automation that processes all our client onboarding. What used to take three hours now takes zero human time.",
    name: "Business Owner",
    role: "Lagos, Nigeria",
  },
  {
    text: "The training was eye-opening. I went from zero to building my own AI workflows in two weeks.",
    name: "HR Manager",
    role: "Corporate Professional",
  },
  {
    text: "Our lead generation bot runs 24/7, qualifying prospects while we sleep. The ROI was immediate.",
    name: "Startup Founder",
    role: "Technology Sector",
  },
];

const faqs = [
  {
    q: "How long does a typical automation take to build?",
    a: "Most systems are delivered in one to three weeks depending on complexity. Simple workflows — invoice automation, booking systems, email sequences — are often live within five working days. Larger agentic AI systems take four to eight weeks.",
  },
  {
    q: "Do I need technical knowledge to work with you?",
    a: "Not at all. My background is teaching, so explaining technical systems in plain language is the part I enjoy most. You describe the business problem; I handle the technical decisions and train your team on the finished system.",
  },
  {
    q: "What happens after the system is delivered?",
    a: "Every project includes documentation, a handover walkthrough and a support window. I stay available for refinements as your process evolves, and ongoing support retainers are available if you would prefer I manage the system for you.",
  },
  {
    q: "Do you work with clients outside Nigeria?",
    a: "Yes. I work remotely with clients across time zones. Calls are scheduled around your working hours and all delivery, documentation and training happens online.",
  },
  {
    q: "What does the free consultation involve?",
    a: "A 20 to 30 minute call where you walk me through your current process. I will tell you honestly whether automation is worth it for your situation, roughly what it would cost, and how long it would take. No pitch, no obligation.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div className="glow" style={{ top: "-6rem", left: "-8rem", width: "34rem", height: "34rem", background: "var(--primary)" }} aria-hidden />
        <div className="glow" style={{ bottom: "-10rem", right: "-6rem", width: "28rem", height: "28rem", background: "var(--primary)" }} aria-hidden />

        <div className="container-wide relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Copy */}
            <div className="lg:col-span-7">
              <div className="hero-in">
                <span className="badge badge-green mb-6">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "var(--success)" }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "var(--success)" }} />
                  </span>
                  Available for new projects
                </span>
              </div>

              <div className="hero-in" style={{ "--in-delay": "70ms" } as React.CSSProperties}>
                <h1 className="mb-6" style={{ fontWeight: 800 }}>
                  I build AI systems that make your business{" "}
                  <span className="underline-accent" style={{ color: "var(--primary-text)" }}>run itself</span>
                </h1>
              </div>

              <div className="hero-in" style={{ "--in-delay": "140ms" } as React.CSSProperties}>
                <p className="text-lg sm:text-xl leading-relaxed mb-9 max-w-2xl" style={{ color: "var(--text-muted)" }}>
                  I design intelligent automation that removes manual work, train teams to use AI
                  effectively, and help businesses scale — faster, leaner, smarter.
                </p>
              </div>

              <div className="hero-in" style={{ "--in-delay": "210ms" } as React.CSSProperties}>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
                    <Calendar className="w-[18px] h-[18px]" />
                    Book a free 20-min call
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
                    <MessageCircle className="w-[18px] h-[18px]" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="hero-in" style={{ "--in-delay": "280ms" } as React.CSSProperties}>
                <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-subtle)" }}>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4" style={{ color: "#f5a524", fill: "#f5a524" }} />
                    ))}
                  </div>
                  <span>Trusted by <strong style={{ color: "var(--text-body)" }}>1,500+</strong> professionals and <strong style={{ color: "var(--text-body)" }}>10+</strong> organizations</span>
                </div>
              </div>
            </div>

            {/* Portrait */}
            <div className="lg:col-span-5">
              <div className="hero-in" style={{ "--in-delay": "160ms" } as React.CSSProperties}>
                <div className="relative mx-auto lg:ml-auto lg:mr-0" style={{ maxWidth: "24rem" }}>
                  <div
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden"
                    style={{ boxShadow: "var(--shadow-xl)", border: "1px solid var(--border)" }}
                  >
                    <Image
                      src="/images/israel-hero.jpg"
                      alt="Israel Afolabi, AI Engineer and Automation Specialist"
                      fill
                      sizes="(max-width: 1024px) 24rem, 24rem"
                      className="object-cover object-top"
                      priority
                    />
                  </div>

                  <div
                    className="absolute -bottom-5 -left-5 rounded-xl px-4 py-3"
                    style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
                  >
                    <p className="text-xl font-bold leading-none" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>1,500+</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>People trained</p>
                  </div>

                  <div
                    className="absolute -top-5 -right-4 rounded-xl px-4 py-3"
                    style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "var(--success)" }} />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "var(--success)" }} />
                      </span>
                      <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>Workflow active</p>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-subtle)" }}>Running 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="hero-in" style={{ "--in-delay": "340ms" } as React.CSSProperties}>
            <div
              className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
              style={{ backgroundColor: "var(--border)", border: "1px solid var(--border)" }}
            >
              {stats.map((s) => (
                <div key={s.label} className="px-6 py-7 text-center" style={{ backgroundColor: "var(--bg)" }}>
                  <p className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: "var(--primary-text)", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
                    {s.value}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TOOL MARQUEE ══════════════ */}
      <section className="py-12 section-alt" style={{ borderBlock: "1px solid var(--border)" }}>
        <div className="container-wide">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] mb-8" style={{ color: "var(--text-subtle)" }}>
            Built with the tools that power modern business
          </p>
        </div>
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track gap-3">
            {[...tools, ...tools].map((t, i) => (
              <span key={i} className="chip flex-shrink-0" style={{ backgroundColor: "var(--bg)" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SERVICES ══════════════ */}
      <section className="section-padding">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <span className="eyebrow">Services</span>
              <h2 className="mb-4">What I do for your business</h2>
              <p className="section-lead">
                From complete automation builds to team training — everything you need to
                operate intelligently and scale without adding headcount.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 70}>
                  <div className="card card-hover p-7 h-full flex flex-col">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: "var(--primary-soft)", border: "1px solid var(--primary-line)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "var(--primary-text)" }} />
                    </div>

                    <h3 className="mb-2.5">{s.title}</h3>
                    <p className="leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>{s.desc}</p>

                    <ul className="space-y-2 mb-6">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-body)" }}>
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--primary-text)" }} />
                          {p}
                        </li>
                      ))}
                    </ul>

                    <Link href="/services" className="link-arrow mt-auto">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/services" className="btn-secondary">
                View all services <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/service-packages" className="btn-ghost">
                See pricing &amp; packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ PROCESS ══════════════ */}
      <section className="section-padding section-alt" style={{ borderBlock: "1px solid var(--border)" }}>
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <span className="eyebrow">How it works</span>
              <h2 className="mb-4">A clear path from problem to working system</h2>
              <p className="section-lead">
                No jargon, no surprises. You know what is happening at every stage,
                and what it will cost before any work begins.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.step} delay={i * 80}>
                  <div className="card card-hover p-7 h-full relative">
                    <span
                      className="absolute top-6 right-6 text-4xl font-bold leading-none select-none"
                      style={{ color: "var(--primary-text)", opacity: 0.12, fontFamily: "var(--font-display)" }}
                      aria-hidden
                    >
                      {p.step}
                    </span>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: "var(--primary-soft)", border: "1px solid var(--primary-line)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "var(--primary-text)" }} />
                    </div>
                    <h3 className="mb-2">{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="section-padding">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <span className="eyebrow">Client results</span>
              <h2 className="mb-4">Real systems. Real results.</h2>
              <p className="section-lead">
                Every project is measured the same way: how much time it gives back,
                and how much it costs to run.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <figure className="card card-hover p-7 h-full flex flex-col">
                  <Quote className="w-7 h-7 mb-4" style={{ color: "var(--primary-text)", opacity: 0.35 }} aria-hidden />
                  <blockquote className="leading-relaxed mb-6 flex-1" style={{ color: "var(--text-body)" }}>
                    {t.text}
                  </blockquote>
                  <figcaption className="pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                    <p className="text-sm" style={{ color: "var(--text-subtle)" }}>{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section className="section-padding section-alt" style={{ borderBlock: "1px solid var(--border)" }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <Reveal className="lg:col-span-5">
              <span className="eyebrow">FAQ</span>
              <h2 className="mb-4">Questions, answered</h2>
              <p className="section-lead mb-7">
                Still unsure about something? Send me a message and I will answer
                it directly — usually within a few hours.
              </p>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <MessageCircle className="w-[18px] h-[18px]" /> Ask a question
              </a>
            </Reveal>

            <Reveal delay={100} className="lg:col-span-7">
              <Faq items={faqs} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="section-padding relative overflow-hidden">
        <div className="glow" style={{ top: "-8rem", left: "50%", transform: "translateX(-50%)", width: "36rem", height: "26rem", background: "var(--primary)" }} aria-hidden />
        <div className="container-wide relative">
          <Reveal>
            <div
              className="rounded-3xl px-8 py-14 sm:px-14 sm:py-16 text-center"
              style={{
                background: "linear-gradient(135deg, var(--primary-fill) 0%, #003a96 100%)",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <h2 className="mb-4" style={{ color: "#fff" }}>Ready to automate your business?</h2>
              <p className="text-lg mb-9 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.82)" }}>
                Book a free 20-minute call. No pitch, no obligation — just honest advice
                on what automation can realistically do for you.
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
                  className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors"
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
