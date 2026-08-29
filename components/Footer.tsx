import Link from "next/link";
import { Bot, Mail, Phone, MapPin, MessageCircle, Calendar } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "AI & Automation Solutions",
  "AI Training & Consulting",
  "Personal Training",
  "AI Projects & Consultations",
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--footer-bg)", borderTop: "1px solid var(--border-card)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: "#0055DA" }}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg" style={{ color: "var(--text-primary)" }}>
                Israel<span style={{ color: "#0055DA" }}> Afolabi</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
              AI Automation Specialist helping businesses replace manual work with intelligent systems.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-green-500 text-xs font-medium">Available for projects</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:opacity-100" style={{ color: "var(--text-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Services</h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Get in Touch</h4>
            <ul className="space-y-3 mb-5">
              <li>
                <a href="mailto:afolabiisraelolajide@gmail.com" className="flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#0055DA" }} />
                  afolabiisraelolajide@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/2348139464398" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#0055DA" }} />
                  +2348139464398
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#0055DA" }} />
                Lagos, Nigeria
              </li>
            </ul>
            <a href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you" target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-sm py-2.5 w-full justify-center">
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border-card)" }}>
          <p className="text-sm" style={{ color: "var(--text-subtle)" }}>© {new Date().getFullYear()} Israel Afolabi. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-subtle)" }}>
            <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Book Free Call
            </a>
            <span>·</span>
            <a href="https://chat.whatsapp.com/LYEMaXu2VBnByfxTnCRTIS" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              Join Community
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
