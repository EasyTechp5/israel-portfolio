import type { Metadata } from "next";
import { Calendar, MessageCircle, Mail, MapPin, Globe, Clock, Users, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact | Israel Afolabi",
  description: "Get in touch with Israel Afolabi — book a free 20-minute consultation, message on WhatsApp, or send an email. Based in Lagos, working globally.",
};

const CAL = "https://calendar.app.google/6EJ6aPfh3ScRUw6V9";
const WA = "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you";

const contactOptions = [
  {
    icon: Calendar,
    title: "Book a free call",
    desc: "A 20-minute discovery call. No pitch, no obligation — just honest advice.",
    note: "Fastest way to get started",
    href: CAL,
    label: "Book free 20-min call",
    variant: "btn-primary",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp me",
    desc: "Fastest response — typically under an hour during business hours.",
    note: "Quick questions welcome",
    href: WA,
    label: "Chat on WhatsApp",
    variant: "btn-whatsapp",
  },
  {
    icon: Mail,
    title: "Email me",
    desc: "For detailed project briefs, proposals or formal enquiries.",
    note: "Response within 24 hours",
    href: "mailto:afolabiisraelolajide@gmail.com",
    label: "Send an email",
    variant: "btn-secondary",
  },
];

const details = [
  { icon: MapPin, label: "Based in", value: "Lagos, Nigeria" },
  { icon: Globe, label: "Working with", value: "Clients worldwide, remotely" },
  { icon: Clock, label: "Typical response", value: "Under 1 hour on WhatsApp" },
  { icon: Users, label: "Availability", value: "Open for new projects" },
];

export default function ContactPage() {
  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "3rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div className="glow" style={{ top: "-6rem", left: "50%", transform: "translateX(-50%)", width: "32rem", height: "22rem", background: "var(--primary)" }} aria-hidden />

        <div className="container-wide relative text-center">
          <div className="hero-in">
            <span className="eyebrow justify-center">Contact</span>
            <h1 className="mb-6 mx-auto max-w-3xl" style={{ fontWeight: 800 }}>
              Let&apos;s talk about <span style={{ color: "var(--primary-text)" }}>your business</span>
            </h1>
            <p className="section-lead mx-auto text-center">
              Pick whichever way suits you. The first conversation is always free, and
              you will get a straight answer about whether I can help.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ OPTIONS ══════════════ */}
      <section className="section-padding" style={{ paddingTop: "3rem" }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {contactOptions.map((o, i) => {
              const Icon = o.icon;
              return (
                <Reveal key={o.title} delay={i * 70}>
                  <div className="card card-hover p-7 h-full flex flex-col text-center items-center">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: "var(--primary-soft)", border: "1px solid var(--primary-line)" }}
                    >
                      <Icon className="w-[22px] h-[22px]" style={{ color: "var(--primary-text)" }} />
                    </div>
                    <h3 className="mb-2">{o.title}</h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>{o.desc}</p>
                    <p className="text-xs font-medium mb-6" style={{ color: "var(--primary-text)" }}>{o.note}</p>
                    <a
                      href={o.href}
                      target={o.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className={`${o.variant} w-full mt-auto`}
                    >
                      {o.label}
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Details + community */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Reveal>
              <div className="card p-8 h-full">
                <h3 className="mb-6">Working details</h3>
                <ul className="space-y-5">
                  {details.map((d) => {
                    const Icon = d.icon;
                    return (
                      <li key={d.label} className="flex items-start gap-3.5">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "var(--primary-soft)", border: "1px solid var(--primary-line)" }}
                        >
                          <Icon className="w-4 h-4" style={{ color: "var(--primary-text)" }} />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "var(--text-subtle)" }}>{d.label}</p>
                          <p className="font-medium" style={{ color: "var(--text-primary)" }}>{d.value}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div
                className="rounded-2xl p-8 h-full flex flex-col justify-center"
                style={{ background: "linear-gradient(135deg, var(--primary-fill) 0%, #003a96 100%)", boxShadow: "var(--shadow-lg)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                >
                  <Users className="w-[22px] h-[22px]" style={{ color: "#fff" }} />
                </div>
                <h3 className="mb-3" style={{ color: "#fff" }}>Join the AI community</h3>
                <p className="mb-7 leading-relaxed" style={{ color: "rgba(255,255,255,0.82)" }}>
                  Learn AI and automation alongside 1,500+ professionals at EasyTech Academy —
                  practical training, real workflows, no theory for its own sake.
                </p>
                <a
                  href="https://easytech365.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl font-semibold self-start transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: "#fff", color: "var(--primary-text)" }}
                >
                  Visit EasyTech Academy <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
