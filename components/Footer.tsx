import Link from "next/link";
import { Mail, MapPin, MessageCircle, Calendar, ArrowUpRight } from "lucide-react";

const CAL = "https://calendar.app.google/6EJ6aPfh3ScRUw6V9";
const WA = "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you";

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/service-packages", label: "Pricing" },
  { href: "/projects", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

const expertise = [
  "AI Automation",
  "Agentic AI Systems",
  "Workflow Automation",
  "AI Training",
  "Business Intelligence",
  "AI Consulting",
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/helloisrael/",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z",
  },
  {
    label: "GitHub",
    href: "https://github.com/EasyTechp5",
    path: "M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .3Z",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--footer-bg)", color: "#93a2b8" }}>
      <div className="container-wide">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pt-16 pb-12">

          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #0055DA, #0043ae)", color: "#fff", fontFamily: "var(--font-display)" }}
              >
                IA
              </span>
              <span className="font-bold text-[0.9375rem]" style={{ color: "#fff", fontFamily: "var(--font-display)" }}>
                Israel Afolabi
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-sm mb-6">
              AI Engineer and Automation Specialist. I design intelligent systems that
              replace manual work with automation — and train teams to thrive in an AI-first world.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                <Calendar className="w-4 h-4" /> Book a call
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-sm">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>

            {/* Social profiles */}
            <div className="flex items-center gap-2.5 mt-6">
              {socials.map((sn) => (
                <a
                  key={sn.label}
                  href={sn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={sn.label}
                  title={sn.label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#c8d3e3",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[18px] h-[18px]"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={sn.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "#fff" }}>
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "#fff" }}>
              Expertise
            </h4>
            <ul className="space-y-2.5">
              {expertise.map((e) => (
                <li key={e} className="text-sm">{e}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "#fff" }}>
              Get in touch
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-sm transition-colors hover:text-white">
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#2b7bff" }} />
                  <span>+234 813 946 4398<br /><span className="text-xs opacity-70">WhatsApp preferred</span></span>
                </a>
              </li>
              <li>
                <a href="mailto:afolabiisraelolajide@gmail.com" className="flex items-start gap-2.5 text-sm transition-colors hover:text-white break-all">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#2b7bff" }} />
                  afolabiisraelolajide@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#2b7bff" }} />
                <span>Lagos, Nigeria<br /><span className="text-xs opacity-70">Working with clients worldwide</span></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p>© {year} Israel Afolabi. All rights reserved.</p>
          <a
            href="https://easytech365.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-white"
          >
            EasyTech Academy <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
