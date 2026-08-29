"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bot, Calendar } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#07091f]/90 backdrop-blur-xl border-b border-white/10 shadow-xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white text-lg">
              Israel<span className="text-[#93b4f5]"> Afolabi</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === l.href
                    ? "bg-[#1e3a8a]/20 text-[#93b4f5]"
                    : "text-[#c0cee8] hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-2 text-sm"
            >
              <Calendar className="w-4 h-4" />
              Book Free Call
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-[#c0cee8] hover:text-white hover:bg-white/10 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#07091f]/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 py-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === l.href
                    ? "bg-[#1e3a8a]/20 text-[#93b4f5]"
                    : "text-[#c0cee8] hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2">
              <a
                href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center py-2.5 text-sm"
              >
                <Calendar className="w-4 h-4" />
                Book Free Call
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
