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
    <footer className="bg-[#0d1540] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-[#1e3a8a] flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg text-white">
                Israel<span className="text-[#93b4f5]"> Afolabi</span>
              </span>
            </Link>
            <p className="text-[#8899cc] text-sm leading-relaxed mb-5">
              AI Automation Specialist helping businesses replace manual work with intelligent systems.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-green-400 text-xs font-medium">Available for projects</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[#8899cc] hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-[#8899cc] hover:text-white text-sm transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 mb-5">
              <li>
                <a href="mailto:afolabiisraelolajide@gmail.com" className="flex items-center gap-2 text-[#8899cc] hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  afolabiisraelolajide@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/2348139464398" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#8899cc] hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +2348139464398
                </a>
              </li>
              <li className="flex items-center gap-2 text-[#8899cc] text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Lagos, Nigeria
              </li>
            </ul>
            <a
              href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm py-2.5 w-full justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#6677aa] text-sm">© {new Date().getFullYear()} Israel Afolabi. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#6677aa] text-sm">
            <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Book Free Call
            </a>
            <span>·</span>
            <a href="https://chat.whatsapp.com/LYEMaXu2VBnByfxTnCRTIS" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Join Community
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
