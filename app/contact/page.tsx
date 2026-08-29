import type { Metadata } from "next";
import { Calendar, MessageCircle, Mail, MapPin, Globe, Clock, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Israel Afolabi",
  description: "Get in touch with Israel Afolabi — book a free 20-minute consultation, WhatsApp directly, or send an email. Based in Lagos, available globally.",
};

const contactOptions = [
  {
    icon: Calendar,
    title: "Book a Free Call",
    desc: "20-minute discovery call. No pitch, no obligation — just honest advice.",
    note: "Fastest way to get started",
    href: "https://calendar.app.google/6EJ6aPfh3ScRUw6V9",
    label: "Book Free 20-Min Call",
    style: "btn-primary",
    color: "bg-[#0055DA]/20 border-[#0055DA]/30 text-muted",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Me",
    desc: "Fastest response — typically under 1 hour during business hours.",
    note: "Quick questions welcome",
    href: "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you",
    label: "Chat on WhatsApp",
    style: "btn-whatsapp",
    color: "bg-green-500/10 border-green-500/20 text-green-400",
  },
  {
    icon: Mail,
    title: "Email Me",
    desc: "For detailed project briefs, proposals, or formal enquiries.",
    note: "Response within 24 hours",
    href: "mailto:afolabiisraelolajide@gmail.com",
    label: "afolabiisraelolajide@gmail.com",
    style: "btn-secondary",
    color: "bg-slate-500/10 border-slate-500/20 text-subtle",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-[var(--bg)] via-[#0055DA]/20 to-[var(--bg)]">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0055DA]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container-wide section-padding pt-32 w-full text-center">
          <span className="badge badge-blue mb-6">Contact</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6">
            Let&apos;s Work{" "}
            <span className="gradient-text">Together</span>
          </h1>
          <p className="text-muted text-xl max-w-xl mx-auto">
            Whether you have a project in mind or just want to explore what&apos;s possible — reach out and let&apos;s talk.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactOptions.map((o) => {
              const Icon = o.icon;
              return (
                <div key={o.title} className="glass-card p-8 text-center flex flex-col items-center hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${o.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{o.title}</h3>
                  <p className="text-subtle text-sm mb-1 flex-1">{o.desc}</p>
                  <p className="text-[#5566aa] text-xs mb-6">{o.note}</p>
                  <a href={o.href} target={o.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" className={`${o.style} w-full justify-center text-sm py-3`}>
                    <Icon className="w-4 h-4" />
                    {o.label}
                  </a>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Location & Availability */}
            <div className="glass-card p-8 rounded-2xl">
              <h4 className="text-white font-black text-lg mb-6">Location &amp; Availability</h4>
              <ul className="space-y-4 mb-6">
                <li className="flex items-center gap-3 text-muted">
                  <div className="w-9 h-9 rounded-xl bg-[#0055DA]/20 border border-[#0055DA]/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-muted" />
                  </div>
                  Lagos, Nigeria
                </li>
                <li className="flex items-center gap-3 text-muted">
                  <div className="w-9 h-9 rounded-xl bg-[#0055DA]/20 border border-[#0055DA]/30 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-muted" />
                  </div>
                  Available globally for remote projects
                </li>
                <li className="flex items-center gap-3 text-muted">
                  <div className="w-9 h-9 rounded-xl bg-[#0055DA]/20 border border-[#0055DA]/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-muted" />
                  </div>
                  Mon–Fri, 9am–6pm WAT (UTC+1)
                </li>
              </ul>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span className="text-green-400 text-sm font-medium">Currently available for new projects</span>
              </div>
            </div>

            {/* Community */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-black">Join the AI Community</h4>
                  <p className="text-subtle text-sm">Free WhatsApp group</p>
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Connect with 1000+ professionals learning AI and automation — tips, resources, and live Q&A sessions with Israel.
              </p>
              <a
                href="https://chat.whatsapp.com/LYEMaXu2VBnByfxTnCRTIS"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center py-3"
              >
                <Users className="w-4 h-4" />
                Join Free Community
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
