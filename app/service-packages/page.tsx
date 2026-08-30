import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowRight, Clock, CheckCircle2, Zap, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Service Packages | Israel Afolabi",
  description: "AI Automation service packages with transparent pricing and delivery times. From marketing automation to agentic AI systems.",
};

const packages = [
  {
    icon: "📣",
    category: "Marketing & Social Media Automation",
    desc: "Automate how your business creates, distributes, and manages marketing content across all channels.",
    color: "var(--primary-text)",
    badge: "Popular",
    services: [
      "Automated Social Media Content Generation & Posting",
      "AI Content Repurposing System",
      "Automated Social Media Scheduling",
      "AI-Powered Content Calendar",
      "Automated Email Marketing Campaigns",
      "Personalized Email Campaign Automation",
      "Bulk Email Campaign System",
      "Automated Lead Nurturing & Follow-up",
      "YouTube Content & Newsletter Automation",
    ],
    tiers: [
      { name: "Starter", price: "$499", delivery: "5–7 days", desc: "1 platform + basic scheduling" },
      { name: "Professional", price: "$1,200", delivery: "10–14 days", desc: "Multi-platform + AI content + campaigns" },
      { name: "Enterprise", price: "$2,500+", delivery: "3–4 weeks", desc: "Full suite + custom AI + analytics" },
    ],
  },
  {
    icon: "💰",
    category: "Finance, Invoicing & Payment Automation",
    desc: "End-to-end automation from invoice generation to payment confirmation and receipt delivery.",
    color: "var(--primary-text)",
    badge: "Best Seller",
    services: [
      "Automated Invoice Generation & Delivery",
      "Automated Payment Confirmation & Receipt",
      "Invoice → Payment → Receipt Workflow",
      "Automated Payment Reminder System",
      "Customer Payment Status Tracking",
      "Invoice PDF Generation",
      "Automated Transaction Record Management",
      "Financial Notification System",
    ],
    tiers: [
      { name: "Starter", price: "$399", delivery: "3–5 days", desc: "Invoice + receipt automation" },
      { name: "Professional", price: "$899", delivery: "7–10 days", desc: "Full payment workflow + reminders" },
      { name: "Enterprise", price: "$1,800+", delivery: "2–3 weeks", desc: "Custom ERP integration + full automation" },
    ],
  },
  {
    icon: "🤝",
    category: "Customer Service & Experience Automation",
    desc: "AI-powered chatbots, voice agents, and automated support systems that delight your customers 24/7.",
    color: "var(--primary-text)",
    badge: null,
    services: [
      "AI Customer Service Chatbot",
      "AI Website Chatbot",
      "AI Voice Agent",
      "AI Customer Enquiry System",
      "Automated Customer Support",
      "AI FAQ / Knowledge Base",
      "AI Customer Qualification",
      "Customer Follow-up Automation",
      "AI Appointment/Booking Assistant",
    ],
    tiers: [
      { name: "Starter", price: "$599", delivery: "5–7 days", desc: "FAQ chatbot + basic responses" },
      { name: "Professional", price: "$1,500", delivery: "10–14 days", desc: "AI chatbot + voice + qualification" },
      { name: "Enterprise", price: "$3,000+", delivery: "3–4 weeks", desc: "Full AI support suite + CRM integration" },
    ],
  },
  {
    icon: "📅",
    category: "Booking & Appointment Automation",
    desc: "Intelligent scheduling systems that book, confirm, and remind — so you never miss an appointment.",
    color: "var(--primary-text)",
    badge: null,
    services: [
      "AI Appointment Booking System",
      "Telegram → Google Calendar Integration",
      "Automated Calendar Scheduling",
      "Healthcare Booking Assistant",
      "Automated Booking Confirmation",
      "Automated Appointment Reminders",
      "Customer → AI → Calendar → Confirmation Workflow",
    ],
    tiers: [
      { name: "Starter", price: "$349", delivery: "3–5 days", desc: "Calendar booking + confirmations" },
      { name: "Professional", price: "$799", delivery: "7–10 days", desc: "AI booking + reminders + Telegram" },
      { name: "Enterprise", price: "$1,500+", delivery: "2–3 weeks", desc: "Multi-channel + custom AI assistant" },
    ],
  },
  {
    icon: "👥",
    category: "HR & Staff Management Automation",
    desc: "Automated staff monitoring, alerts, and reporting systems built on your existing Excel/SharePoint data.",
    color: "var(--primary-text)",
    badge: null,
    services: [
      "Automated Staff Monitoring System",
      "Excel & SharePoint Staff Monitoring",
      "Automated Staff Alerts & Notifications",
      "Employee Record Monitoring",
      "Automated Reporting from Staff Data",
      "Condition-based Employee Notifications",
      "Excel → Alert Workflows",
    ],
    tiers: [
      { name: "Starter", price: "$449", delivery: "5–7 days", desc: "Excel monitoring + basic alerts" },
      { name: "Professional", price: "$1,000", delivery: "10–14 days", desc: "SharePoint + smart alerts + reports" },
      { name: "Enterprise", price: "$2,000+", delivery: "2–3 weeks", desc: "Full HR automation + custom dashboards" },
    ],
  },
  {
    icon: "📊",
    category: "Data & Business Intelligence Automation",
    desc: "Automated reporting, KPI monitoring, and data pipelines that keep you informed without manual effort.",
    color: "var(--primary-text)",
    badge: null,
    services: [
      "Automated Business Reporting",
      "Automated Excel & Data Collection",
      "Automated Data Validation",
      "Automated Dashboard Data Preparation",
      "Automated KPI/Metrics Monitoring",
      "Automated Business Alerts",
      "Google Forms → Database Automation",
      "Automated Data-processing Workflows",
    ],
    tiers: [
      { name: "Starter", price: "$499", delivery: "5–7 days", desc: "Automated reporting + alerts" },
      { name: "Professional", price: "$1,200", delivery: "10–14 days", desc: "KPI monitoring + dashboards + pipelines" },
      { name: "Enterprise", price: "$2,500+", delivery: "3–4 weeks", desc: "Full BI automation + custom integrations" },
    ],
  },
  {
    icon: "🗄️",
    category: "Database & Record Management Automation",
    desc: "Automated database workflows that capture, update, and manage your business records in real time.",
    color: "var(--primary-text)",
    badge: null,
    services: [
      "Google Form → Supabase Automation",
      "Automated Record Creation & Updates",
      "Automated Customer Database Management",
      "Automated Lead Database Management",
      "Automated Student Record Management",
      "Unique ID Generation & Assignment",
      "Database → Email/Notification Automation",
    ],
    tiers: [
      { name: "Starter", price: "$399", delivery: "3–5 days", desc: "Form → database + notifications" },
      { name: "Professional", price: "$899", delivery: "7–10 days", desc: "Full record management + ID generation" },
      { name: "Enterprise", price: "$1,800+", delivery: "2–3 weeks", desc: "Multi-source DB automation + custom logic" },
    ],
  },
  {
    icon: "📧",
    category: "Email Automation",
    desc: "Personalized, automated email systems — from welcome sequences to bulk campaigns and follow-ups.",
    color: "var(--primary-text)",
    badge: null,
    services: [
      "Automated Email Campaign System",
      "Personalized Email Generation",
      "Google Form → Personalized Email",
      "Automated Welcome & Confirmation Emails",
      "Automated Invoice & Receipt Emails",
      "Automated Newsletter & Follow-up Emails",
      "Bulk Email Automation",
      "Email → Database Workflows",
    ],
    tiers: [
      { name: "Starter", price: "$299", delivery: "3–5 days", desc: "Welcome + confirmation automation" },
      { name: "Professional", price: "$699", delivery: "7–10 days", desc: "Full campaign + personalization system" },
      { name: "Enterprise", price: "$1,500+", delivery: "2–3 weeks", desc: "Bulk + segmentation + CRM sync" },
    ],
  },
  {
    icon: "🧠",
    category: "AI Knowledge & Document Automation",
    desc: "RAG-powered AI systems that let you and your team instantly query company documents and knowledge bases.",
    color: "var(--accent-text)",
    badge: "Advanced",
    services: [
      "AI PDF Chatbot",
      "AI Document Q&A System",
      "RAG-based Knowledge Assistant",
      "AI Knowledge Base Builder",
      "Document Search & Retrieval",
      "Company Knowledge Assistant",
      "Internal Documentation Assistant",
      "PDF → Embeddings → Vector DB → AI",
    ],
    tiers: [
      { name: "Starter", price: "$799", delivery: "7–10 days", desc: "PDF chatbot + basic Q&A" },
      { name: "Professional", price: "$1,800", delivery: "2–3 weeks", desc: "Full RAG system + vector DB + UI" },
      { name: "Enterprise", price: "$3,500+", delivery: "4–6 weeks", desc: "Multi-source knowledge system + custom AI" },
    ],
  },
  {
    icon: "🤖",
    category: "Agentic AI & Intelligent Workflow Automation",
    desc: "Next-generation AI agents that don't just automate — they understand, reason, decide, and take action.",
    color: "var(--accent-text)",
    badge: "Premium",
    services: [
      "AI Agents (custom-built)",
      "Agentic Customer Support System",
      "AI Lead Qualification Agent",
      "AI Booking Agent",
      "AI Research & Knowledge Agent",
      "Multi-step AI Workflows",
      "AI + n8n Agentic Workflows",
      "Tool-using AI Agents",
    ],
    tiers: [
      { name: "Starter", price: "$1,200", delivery: "10–14 days", desc: "Single-task AI agent" },
      { name: "Professional", price: "$2,800", delivery: "3–4 weeks", desc: "Multi-tool agent + workflow integration" },
      { name: "Enterprise", price: "$5,000+", delivery: "4–8 weeks", desc: "Full agentic system + custom tools + deploy" },
    ],
  },
  {
    icon: "🎓",
    category: "Education & Training Automation",
    desc: "Complete student lifecycle automation — from registration and payments to communications and follow-ups.",
    color: "var(--primary-text)",
    badge: null,
    services: [
      "Automated Student Registration",
      "Automated Student ID Generation",
      "Student Database Management",
      "Automated Student Emails & Notifications",
      "Automated Invoice & Payment Confirmation",
      "Automated Receipts for Students",
      "Training Marketing Automation",
      "Scholarship Application Automation",
      "Automated Cohort Communication",
    ],
    tiers: [
      { name: "Starter", price: "$499", delivery: "5–7 days", desc: "Registration + ID + emails" },
      { name: "Professional", price: "$1,200", delivery: "10–14 days", desc: "Full student lifecycle automation" },
      { name: "Enterprise", price: "$2,500+", delivery: "3–4 weeks", desc: "LMS integration + marketing + payments" },
    ],
  },
  {
    icon: "📱",
    category: "Telegram & Messaging Automation",
    desc: "Business assistants and automation workflows delivered through Telegram and messaging platforms.",
    color: "var(--primary-text)",
    badge: null,
    services: [
      "Telegram AI Assistant",
      "Telegram → Google Calendar Booking Bot",
      "Telegram AI Voice/Message Interactions",
      "Automated Telegram Notifications",
      "Telegram → n8n → AI Workflows",
      "Messaging-based Business Assistants",
    ],
    tiers: [
      { name: "Starter", price: "$349", delivery: "3–5 days", desc: "Telegram bot + basic automation" },
      { name: "Professional", price: "$799", delivery: "7–10 days", desc: "AI Telegram assistant + calendar + AI" },
      { name: "Enterprise", price: "$1,500+", delivery: "2–3 weeks", desc: "Multi-platform messaging + full AI" },
    ],
  },
  {
    icon: "🎥",
    category: "Content & YouTube Automation",
    desc: "AI-powered content pipelines that generate, publish, and distribute video and social content automatically.",
    color: "var(--primary-text)",
    badge: null,
    services: [
      "AI YouTube Automation System",
      "Automated Video Content Generation",
      "AI Script Generation",
      "AI Video Generation & Publishing",
      "Automated Content Publishing",
      "Social Media Content Repurposing",
      "AI Content Distribution System",
    ],
    tiers: [
      { name: "Starter", price: "$599", delivery: "5–7 days", desc: "Script + publishing automation" },
      { name: "Professional", price: "$1,400", delivery: "10–14 days", desc: "AI video + repurposing + distribution" },
      { name: "Enterprise", price: "$2,800+", delivery: "3–4 weeks", desc: "Full content factory + multi-platform" },
    ],
  },
];

export default function ServicePackagesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "4rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div className="glow" style={{ top: "-6rem", right: "8%", width: "30rem", height: "22rem", background: "var(--primary)" }} aria-hidden />

        <div className="container-wide relative text-center">
          <div className="hero-in">
          <span className="eyebrow justify-center">Pricing</span>
          <h1 className="mb-6 mx-auto max-w-4xl" style={{ fontWeight: 800 }}>
            AI automation packages built for <span style={{ color: "var(--primary-text)" }}>your business</span>
          </h1>
          <p className="section-lead mx-auto mb-10 text-center">
            13 categories, transparent pricing and fixed delivery times. Every package is
            built custom — you pay for results, not hours.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { value: "13", label: "Service Categories" },
              { value: "50+", label: "Automation Types" },
              { value: "3–8 wks", label: "Avg Delivery" },
              { value: "100%", label: "Custom Built" },
            ].map((s) => (
              <div key={s.label} className="card px-6 py-4 rounded-2xl text-center" style={{ minWidth: "120px" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--primary-text)" }}>{s.value}</p>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
              <Calendar className="w-[18px] h-[18px]" /> Book a free consultation <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20am%20interested%20in%20your%20service%20packages" target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
              <MessageCircle className="w-[18px] h-[18px]" /> WhatsApp Israel
            </a>
          </div>
          </div>
        </div>
      </section>

      {/* ── Note ─────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 py-6" style={{ backgroundColor: "var(--bg-surface)", borderBlock: "1px solid var(--border)" }}>
        <div className="container-wide mx-auto flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4" style={{ color: "var(--primary-text)" }} /> All packages are <strong style={{ color: "var(--text-primary)" }}>custom built</strong> — no templates</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "var(--primary-text)" }} /> <strong style={{ color: "var(--text-primary)" }}>Free 30-min consultation</strong> before you commit</div>
          <div className="flex items-center gap-2"><Star className="w-4 h-4" style={{ color: "var(--primary-text)" }} /> Prices in <strong style={{ color: "var(--text-primary)" }}>USD</strong> — payment plans available</div>
        </div>
      </div>

      {/* ── Packages Grid ─────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className="card rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col"
                style={{ borderColor: pkg.color === "var(--accent)" ? "color-mix(in srgb, var(--accent) 26%, transparent)" : "var(--primary-soft)" }}
              >
                {/* Card header */}
                <div className="p-6 pb-4" style={{ background: pkg.color === "var(--accent)" ? "linear-gradient(135deg, var(--accent-soft), var(--accent-soft))" : "linear-gradient(135deg, var(--primary-soft), var(--primary-soft))" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{pkg.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{pkg.category}</h2>
                          {pkg.badge && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: pkg.badge === "Premium" || pkg.badge === "Advanced" ? "var(--accent-soft)" : "var(--primary-soft)",
                                color: pkg.badge === "Premium" || pkg.badge === "Advanced" ? "var(--accent-text)" : "var(--primary-text)",
                              }}>
                              {pkg.badge === "Best Seller" ? "⭐ " : ""}{pkg.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{pkg.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services included */}
                <div className="px-6 pb-4">
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pkg.color === "var(--accent)" ? "var(--accent-text)" : "var(--primary-text)" }}>What&apos;s Included</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {pkg.services.map((s) => (
                      <div key={s} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: pkg.color === "var(--accent)" ? "var(--accent-text)" : "var(--primary-text)" }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing tiers */}
                <div className="px-6 pb-6 mt-auto">
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: pkg.color === "var(--accent)" ? "var(--accent-text)" : "var(--primary-text)" }}>Pricing Tiers</p>
                  <div className="grid grid-cols-3 gap-2">
                    {pkg.tiers.map((tier, ti) => (
                      <div
                        key={ti}
                        className="rounded-xl p-3 text-center transition-all"
                        style={{
                          backgroundColor: ti === 1 ? (pkg.color === "var(--accent)" ? "var(--accent)" : "var(--primary-fill)") : "var(--bg-card)",
                          border: ti === 1 ? "none" : `1px solid ${pkg.color === "var(--accent)" ? "color-mix(in srgb, var(--accent) 26%, transparent)" : "var(--primary-soft)"}`,
                        }}
                      >
                        <p className="text-xs font-bold mb-1" style={{ color: ti === 1 ? "#ffffff" : "var(--text-muted)" }}>{tier.name}</p>
                        <p className="text-lg font-bold" style={{ color: ti === 1 ? "white" : "var(--text-primary)" }}>{tier.price}</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Clock className="w-3 h-3" style={{ color: ti === 1 ? "rgba(255,255,255,0.95)" : "var(--text-subtle)" }} />
                          <p className="text-xs" style={{ color: ti === 1 ? "rgba(255,255,255,0.95)" : "var(--text-subtle)" }}>{tier.delivery}</p>
                        </div>
                        <p className="text-xs mt-1.5 leading-tight" style={{ color: ti === 1 ? "rgba(255,255,255,0.92)" : "var(--text-subtle)" }}>{tier.desc}</p>
                      </div>
                    ))}
                  </div>

                  <a
                    href={`https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20am%20interested%20in%20your%20${encodeURIComponent(pkg.category)}%20package`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary-text)", border: "1px solid var(--primary-line)" }}
                  >
                    <MessageCircle className="w-4 h-4" /> Get a Quote
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--primary-soft) 0%, var(--accent-soft) 100%)" }} />
        <div className="container-wide px-4 sm:px-6 lg:px-8 mx-auto relative z-10 text-center">
          <span className="badge badge-blue mb-6">Not Sure Which Package?</span>
          <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Let&apos;s Talk About Your Business</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Book a free 30-minute consultation. I&apos;ll listen to your challenges and recommend exactly what you need — no upsells, no fluff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="btn-primary py-3.5 px-8">
              <Calendar className="w-5 h-5" /> Book Free Call <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you" target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-3.5 px-8">
              <MessageCircle className="w-5 h-5" /> WhatsApp Israel
            </a>
            <Link href="/services" className="btn-secondary py-3.5 px-8">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
