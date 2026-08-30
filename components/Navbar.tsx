"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/service-packages", label: "Pricing" },
  { href: "/projects", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

const CAL = "https://calendar.app.google/6EJ6aPfh3ScRUw6V9";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{
        backgroundColor: scrolled || open ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled || open ? "blur(14px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled || open ? "blur(14px) saturate(180%)" : "none",
        borderBottom: `1px solid ${scrolled || open ? "var(--border)" : "transparent"}`,
        transition: "background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-[68px]">

          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="Israel Afolabi — home">
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, var(--primary-fill), #0043ae)",
                color: "#fff",
                fontFamily: "var(--font-display)",
                boxShadow: "var(--shadow-brand)",
              }}
            >
              IA
            </span>
            <span
              className="font-bold text-[0.9375rem] tracking-tight leading-none hidden sm:block"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              Israel Afolabi
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className="relative px-3.5 py-2 rounded-lg text-[0.875rem] font-medium transition-colors"
                  style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}
                >
                  {l.label}
                  {active && (
                    <span
                      className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary hidden sm:inline-flex text-sm">
              <Calendar className="w-4 h-4" /> Book a call
            </a>
            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ color: "var(--text-primary)" }}
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div
          className="lg:hidden"
          style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)", height: "calc(100dvh - 68px)" }}
        >
          <nav className="container-wide py-6 flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium"
                  style={{
                    color: active ? "var(--primary)" : "var(--text-body)",
                    backgroundColor: active ? "var(--primary-soft)" : "transparent",
                  }}
                >
                  {l.label}
                  <ArrowRight className="w-4 h-4 opacity-40" />
                </Link>
              );
            })}
            <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg w-full mt-4">
              <Calendar className="w-[18px] h-[18px]" /> Book a free call
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
