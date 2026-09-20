import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar, MessageCircle, ArrowRight, Check, Minus, Clock,
  Shield, FileText, Headphones, KeyRound, Repeat, Sparkles,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Pricing | Israel Afolabi",
  description:
    "Transparent pricing for AI automation projects — three engagement tiers with fixed scope, clear delivery windows and what every project includes.",
  alternates: { canonical: "https://israel.easytech365.com/service-packages" },
};

const CAL = "https://calendar.app.google/8Pfj98atpuSk14RH9";
const WA = "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20would%20like%20to%20discuss%20a%20project";

/* ── Three engagement tiers ─────────────────────────────────
   Deliberately three, not thirty-nine. A pricing page is a
   decision aid, not a menu.                                  */
const tiers = [
  {
    name: "Single Workflow",
    tagline: "One process, automated properly",
    price: "$450",
    priceNote: "from",
    delivery: "3–7 days",
    forWho: "A business with one obvious time drain and clear rules.",
    includes: [
      "One end-to-end automated workflow",
      "Up to 3 system integrations",
      "Error handling and retry logic",
      "Testing against your real data",
      "Documentation and handover call",
      "14 days of post-launch support",
    ],
    excludes: ["AI agents", "Custom interfaces"],
    cta: "Discuss a workflow",
    featured: false,
  },
  {
    name: "Business System",
    tagline: "Several processes, working together",
    price: "$1,200",
    priceNote: "from",
    delivery: "2–3 weeks",
    forWho: "A growing business ready to automate a whole function — sales, finance or support.",
    includes: [
      "Multi-step system across several workflows",
      "Unlimited system integrations",
      "AI in the loop where it earns its place",
      "Database and persistent state",
      "Monitoring and failure alerts",
      "Team training session",
      "30 days of post-launch support",
    ],
    excludes: [],
    cta: "Discuss a system",
    featured: true,
  },
  {
    name: "Agentic & Custom",
    tagline: "Systems that decide, not just execute",
    price: "$3,000",
    priceNote: "from",
    delivery: "4–8 weeks",
    forWho: "Teams needing AI agents, voice systems or retrieval over their own documents.",
    includes: [
      "AI agents with tool use and memory",
      "RAG pipelines and vector databases",
      "Voice or multi-channel conversational AI",
      "Custom dashboards and internal tools",
      "Staged rollout with shadow-mode testing",
      "Full architecture documentation",
      "60 days of post-launch support",
    ],
    excludes: [],
    cta: "Discuss a custom build",
    featured: false,
  },
];

/* Comparison rows — value is either boolean or a short string */
const comparison: { label: string; values: (boolean | string)[] }[] = [
  { label: "Workflows included", values: ["1", "Up to 5", "Unlimited"] },
  { label: "System integrations", values: ["Up to 3", "Unlimited", "Unlimited"] },
  { label: "AI in the workflow", values: [false, true, true] },
  { label: "AI agents with tool use", values: [false, false, true] },
  { label: "Retrieval over your documents", values: [false, false, true] },
  { label: "Voice / conversational AI", values: [false, false, true] },
  { label: "Database & persistent state", values: [false, true, true] },
  { label: "Monitoring & failure alerts", values: [false, true, true] },
  { label: "Team training session", values: [false, true, true] },
  { label: "Post-launch support", values: ["14 days", "30 days", "60 days"] },
  { label: "Typical delivery", values: ["3–7 days", "2–3 weeks", "4–8 weeks"] },
];

/* Included in every engagement, regardless of tier */
const alwaysIncluded = [
  { icon: KeyRound, title: "You own everything", desc: "Built on your accounts and infrastructure. Nothing is hostage to my login." },
  { icon: FileText, title: "Written documentation", desc: "How it works, how to change it, and what to do when something breaks." },
  { icon: Shield, title: "Failure handling", desc: "Retries, alerts and a defined fallback. Silent failure is not acceptable." },
  { icon: Headphones, title: "A support window", desc: "Time after launch to fix anything real use uncovers, at no extra cost." },
];

/* What can actually be built — reference, not a price list */
const capabilities = [
  { area: "Sales & Lead Generation", items: "Lead qualification, prospecting pipelines, instant enquiry response, CRM sync" },
  { area: "Finance & Invoicing", items: "Invoice generation, payment tracking, reminders, receipts, expense capture" },
  { area: "Customer Support", items: "AI support agents, ticket triage, order status, feedback analysis" },
  { area: "Booking & Scheduling", items: "Self-service booking, confirmations, reminders, calendar sync" },
  { area: "HR & Staff Operations", items: "Onboarding sequences, staff monitoring, condition-based alerts, reporting" },
  { area: "Data & Reporting", items: "Automated reports, KPI monitoring, dashboards, data pipelines" },
  { area: "Marketing & Content", items: "Content repurposing, multi-channel publishing, email sequences, newsletters" },
  { area: "Documents & Records", items: "Document generation, database automation, ID assignment, record management" },
];

const process = [
  { step: "01", title: "Free discovery call", desc: "20 minutes. You describe the process, I tell you honestly whether automating it is worth it." },
  { step: "02", title: "Fixed-price proposal", desc: "Written scope, price and delivery date. No hourly billing and no moving numbers." },
  { step: "03", title: "Build and test", desc: "I build it, then run it against your real data before it touches anything live." },
  { step: "04", title: "Handover and support", desc: "Training, documentation and a support window while the system beds in." },
];

const faqs = [
  {
    q: "Why is the price a range rather than a fixed number?",
    a: "Because the same sentence can describe a three-day job or a three-week one. \"Automate my invoicing\" means something different for a business with clean data in one system than for one with invoices in three places and four undocumented exceptions. The tier prices are honest starting points; you get a fixed number in writing after the discovery call, before any work begins.",
  },
  {
    q: "What are the ongoing costs after you hand it over?",
    a: "Two things: the automation platform, and AI model usage if the system uses AI. Self-hosted n8n is a flat server cost that does not scale with volume; Make.com and Zapier charge per operation, so they scale with success. I will model your expected monthly cost during the proposal rather than leaving you to discover it on the first invoice.",
  },
  {
    q: "Do you offer ongoing support after the included window?",
    a: "Yes, on a monthly retainer covering monitoring, fixes, and new workflows as you grow. Most clients start without one and add it once the system is genuinely load-bearing. It is optional, and I will tell you if I think you do not need it.",
  },
  {
    q: "What if the project turns out to be bigger than the tier suggests?",
    a: "You find out in the proposal, not halfway through. If discovery reveals the work is larger than expected, I re-scope and re-quote before starting. I do not begin work and then come back asking for more.",
  },
  {
    q: "Can I start small and expand later?",
    a: "That is usually the right approach. Start with the single workflow that wastes the most time, see it working, then decide whether to go further. Systems built at the lower tier are designed so they can be extended rather than rebuilt.",
  },
  {
    q: "What if you think my project is not worth doing?",
    a: "I will say so on the call, and explain why. Processes that change monthly, run a handful of times a year, or where nobody can explain the current rules are usually better fixed than automated. Turning down the wrong project is cheaper for both of us than finishing it.",
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium" style={{ color: "var(--text-body)" }}>{value}</span>;
  }
  return value ? (
    <Check className="w-[18px] h-[18px] mx-auto" style={{ color: "var(--success)" }} aria-label="Included" />
  ) : (
    <Minus className="w-[18px] h-[18px] mx-auto" style={{ color: "var(--text-subtle)", opacity: 0.5 }} aria-label="Not included" />
  );
}

export default function PricingPage() {
  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "3rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div className="glow" style={{ top: "-6rem", left: "50%", transform: "translateX(-50%)", width: "32rem", height: "22rem", background: "var(--primary)" }} aria-hidden />

        <div className="container-wide relative text-center">
          <div className="hero-in">
            <span className="eyebrow justify-center">Pricing</span>
            <h1 className="mb-6 mx-auto max-w-3xl" style={{ fontWeight: 800 }}>
              Fixed scope, fixed price, <span style={{ color: "var(--primary-text)" }}>fixed date</span>
            </h1>
            <p className="section-lead mx-auto text-center mb-9">
              Three ways to work together, priced on outcome rather than hours. Every
              engagement is quoted in writing before anything is built.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
                <Calendar className="w-[18px] h-[18px]" /> Book a free call <ArrowRight className="w-4 h-4" />
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
                <MessageCircle className="w-[18px] h-[18px]" /> Ask a question
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TIERS ══════════════ */}
      <section className="section-padding" style={{ paddingTop: "3rem" }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div
                  className="card h-full flex flex-col relative"
                  style={
                    t.featured
                      ? { borderColor: "var(--primary)", borderWidth: "2px", boxShadow: "var(--shadow-lg)" }
                      : undefined
                  }
                >
                  {t.featured && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                      style={{ backgroundColor: "var(--primary-fill)", color: "#fff", boxShadow: "var(--shadow-brand)" }}
                    >
                      Most projects start here
                    </span>
                  )}

                  <div className="p-8 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
                    <h2 className="mb-1.5" style={{ fontSize: "1.3rem" }}>{t.name}</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--primary-text)" }}>{t.tagline}</p>

                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>
                        {t.priceNote}
                      </span>
                      <span
                        className="font-bold"
                        style={{ fontSize: "2.5rem", color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
                      >
                        {t.price}
                      </span>
                      <span className="text-sm" style={{ color: "var(--text-subtle)" }}>USD</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
                      <Clock className="w-4 h-4" style={{ color: "var(--primary-text)" }} />
                      Delivered in {t.delivery}
                    </div>

                    <a
                      href={`https://wa.me/2348139464398?text=${encodeURIComponent(
                        `Hi Israel, I am interested in the "${t.name}" tier and would like to discuss my project.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={t.featured ? "btn-primary w-full" : "btn-secondary w-full"}
                    >
                      {t.cta} <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="p-8 pt-6 flex flex-col flex-1">
                    <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      <strong style={{ color: "var(--text-primary)" }}>Right for you if:</strong> {t.forWho}
                    </p>

                    <p className="text-xs font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "var(--text-subtle)" }}>
                      What you get
                    </p>
                    <ul className="space-y-2.5 mb-6">
                      {t.includes.map((inc) => (
                        <li key={inc} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--success)" }} />
                          <span className="text-sm" style={{ color: "var(--text-body)" }}>{inc}</span>
                        </li>
                      ))}
                    </ul>

                    {t.excludes.length > 0 && (
                      <ul className="space-y-2.5 mt-auto pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                        {t.excludes.map((ex) => (
                          <li key={ex} className="flex items-start gap-2.5">
                            <Minus className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--text-subtle)", opacity: 0.6 }} />
                            <span className="text-sm" style={{ color: "var(--text-subtle)" }}>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="text-center text-sm mt-8" style={{ color: "var(--text-subtle)" }}>
              Prices in USD. Payment plans available. Ongoing running costs (platform and AI usage)
              are modelled in your proposal, not left as a surprise.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ COMPARISON ══════════════ */}
      <section className="section-padding section-alt" style={{ borderBlock: "1px solid var(--border)" }}>
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow">Compare</span>
              <h2 className="mb-4">What is included at each tier</h2>
              <p className="section-lead">
                The honest version — including what each tier does not cover.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="card overflow-hidden">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "44rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--bg-inset)" }}>
                      <th
                        className="text-left text-sm font-semibold"
                        style={{ padding: "1rem 1.25rem", color: "var(--text-primary)" }}
                      >
                        &nbsp;
                      </th>
                      {tiers.map((t) => (
                        <th
                          key={t.name}
                          className="text-center text-sm font-semibold"
                          style={{
                            padding: "1rem 1.25rem",
                            color: t.featured ? "var(--primary-text)" : "var(--text-primary)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row) => (
                      <tr key={row.label}>
                        <td
                          className="text-sm"
                          style={{ padding: "0.85rem 1.25rem", borderTop: "1px solid var(--border)", color: "var(--text-body)" }}
                        >
                          {row.label}
                        </td>
                        {row.values.map((v, i) => (
                          <td
                            key={i}
                            className="text-center"
                            style={{
                              padding: "0.85rem 1.25rem",
                              borderTop: "1px solid var(--border)",
                              backgroundColor: tiers[i].featured ? "var(--primary-soft)" : undefined,
                            }}
                          >
                            <Cell value={v} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ ALWAYS INCLUDED ══════════════ */}
      <section className="section-padding">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow">Every engagement</span>
              <h2 className="mb-4">Included regardless of what you spend</h2>
              <p className="section-lead">
                These are not upsells. They are what separates a system you own from a
                dependency you rent.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {alwaysIncluded.map((a, i) => {
              const Icon = a.icon;
              return (
                <Reveal key={a.title} delay={i * 70}>
                  <div className="card card-hover p-7 h-full">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: "var(--primary-soft)", border: "1px solid var(--primary-line)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "var(--primary-text)" }} />
                    </div>
                    <h3 className="mb-2">{a.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ RETAINER ══════════════ */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="container-wide">
          <Reveal>
            <div className="card p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2.5 mb-4">
                  <Repeat className="w-5 h-5" style={{ color: "var(--primary-text)" }} />
                  <span className="badge badge-blue">Optional</span>
                </div>
                <h2 className="mb-3" style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)" }}>
                  Ongoing support retainer
                </h2>
                <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Once a system is genuinely load-bearing, most clients want someone watching it.
                  A retainer covers monitoring, fixes when an API changes, and new workflows as you
                  grow — billed monthly, cancellable, and only worth taking once you actually need it.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <div className="flex items-baseline gap-2 lg:justify-end mb-1">
                  <span className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>from</span>
                  <span
                    className="font-bold"
                    style={{ fontSize: "2.1rem", color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
                  >
                    $300
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-subtle)" }}>/month</span>
                </div>
                <p className="text-sm mb-5" style={{ color: "var(--text-subtle)" }}>Scoped to your systems</p>
                <a
                  href={`https://wa.me/2348139464398?text=${encodeURIComponent(
                    "Hi Israel, I would like to discuss an ongoing support retainer."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Discuss a retainer <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ PROCESS ══════════════ */}
      <section className="section-padding section-alt" style={{ borderBlock: "1px solid var(--border)" }}>
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow">How it works</span>
              <h2 className="mb-4">From first call to working system</h2>
              <p className="section-lead">
                You know the price and the date before any work starts.
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

      {/* ══════════════ CAPABILITIES ══════════════ */}
      <section className="section-padding">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow">What can be built</span>
              <h2 className="mb-4">The kinds of systems these tiers cover</h2>
              <p className="section-lead">
                Any of these can be a single workflow or a full system — the tier depends on
                scope, not on subject.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-px rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--border)", border: "1px solid var(--border)" }}>
            {capabilities.map((c, i) => (
              <Reveal key={c.area} delay={Math.min(i, 6) * 50}>
                <div className="p-6 h-full" style={{ backgroundColor: "var(--bg)" }}>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: "var(--primary-text)" }} />
                    <div>
                      <h3 className="mb-1.5" style={{ fontSize: "1rem" }}>{c.area}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{c.items}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <p className="text-center text-sm mt-8" style={{ color: "var(--text-subtle)" }}>
              Not listed?{" "}
              <a href={WA} target="_blank" rel="noopener noreferrer" className="font-medium underline" style={{ color: "var(--primary-text)" }}>
                Ask anyway
              </a>{" "}
              — most business processes automate the same way underneath.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section className="section-padding section-alt" style={{ borderBlock: "1px solid var(--border)" }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <Reveal className="lg:col-span-5">
              <span className="eyebrow">Pricing FAQ</span>
              <h2 className="mb-4">The questions people actually ask</h2>
              <p className="section-lead mb-7">
                If something here is still unclear, message me directly. I would rather answer
                it now than have you guess.
              </p>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <MessageCircle className="w-[18px] h-[18px]" /> Ask about pricing
              </a>
            </Reveal>

            <Reveal delay={100} className="lg:col-span-7">
              <Faq items={faqs} />
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
              <h2 className="mb-4" style={{ color: "#fff" }}>Not sure which tier fits?</h2>
              <p className="text-lg mb-9 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.84)" }}>
                Describe the process on a free 20-minute call. I will tell you which tier it
                falls into — or that it is not worth automating at all.
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
                <Link
                  href="/projects"
                  className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl font-semibold"
                  style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  See the work first
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
