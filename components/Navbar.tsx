"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Calendar, ArrowRight, MessageCircle } from "lucide-react";

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

const CAL = "https://calendar.app.google/8Pfj98atpuSk14RH9";
const WA = "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you";

// A blog post counts as being on "Blog", and so on for every section.
const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export default function Navbar() {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so it closes by itself on navigation.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  const pillRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const placed = useRef(false);

  const activeHref = links.find((l) => isActive(pathname, l.href))?.href ?? null;
  const target = hover ?? activeHref;
  const navH = scrolled ? 60 : 68;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll while the mobile menu is open, and let Escape close it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenedOn(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Slide the highlight pill under the hovered link (or the current page).
  // Written straight to the element so it never triggers a re-render.
  const placePill = useCallback(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const el = target ? itemRefs.current[target] : null;
    if (!el) {
      pill.style.opacity = "0";
      return;
    }
    if (!placed.current) {
      // First placement: jump into position rather than sliding in from the left.
      pill.style.transition = "none";
      pill.style.transform = `translateX(${el.offsetLeft}px)`;
      pill.style.width = `${el.offsetWidth}px`;
      pill.style.opacity = "1";
      void pill.offsetWidth;
      pill.style.transition = "";
      placed.current = true;
      return;
    }
    pill.style.transform = `translateX(${el.offsetLeft}px)`;
    pill.style.width = `${el.offsetWidth}px`;
    pill.style.opacity = "1";
  }, [target]);

  useLayoutEffect(() => {
    placePill();
  }, [placePill]);

  useEffect(() => {
    // Fonts can change link widths after first paint.
    const refit = () => {
      placed.current = false;
      placePill();
    };
    window.addEventListener("resize", refit);
    document.fonts?.ready.then(refit);
    return () => window.removeEventListener("resize", refit);
  }, [placePill]);

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
        <div
          className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]"
          style={{ height: navH, transition: "height 0.3s ease" }}
        >
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0 justify-self-start" aria-label="Israel Afolabi — home">
            <Image
              src="/images/israel-logo.jpg"
              alt=""
              width={40}
              height={40}
              priority
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover transition-transform group-hover:scale-105"
              style={{ boxShadow: "0 0 0 2px var(--bg), 0 0 0 3.5px var(--primary-fill), var(--shadow-brand)" }}
            />
            <span
              className="font-bold text-[0.9375rem] tracking-tight leading-none hidden sm:block"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              Israel Afolabi
            </span>
          </Link>

          {/* Desktop nav: glass pill with a highlight that glides between links */}
          <nav
            className="relative hidden lg:flex items-center gap-0.5"
            aria-label="Main"
            onMouseLeave={() => setHover(null)}
          >
            <span ref={pillRef} className="nav-pill" style={{ opacity: 0 }} aria-hidden />
            {links.map((l) => {
              const active = isActive(pathname, l.href);
              const lit = active || hover === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  ref={(el) => {
                    itemRefs.current[l.href] = el;
                  }}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setHover(l.href)}
                  onFocus={() => setHover(l.href)}
                  onBlur={() => setHover(null)}
                  className="relative z-10 rounded-md px-3.5 py-2.5 text-[0.875rem] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  style={{
                    color: lit ? "var(--text-primary)" : "var(--text-muted)",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:justify-self-end">
            <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary hidden sm:inline-flex text-sm">
              <Calendar className="w-4 h-4" /> Book a call
            </a>
            <button
              type="button"
              className="lg:hidden relative h-10 w-10 rounded-lg"
              style={{ color: "var(--text-primary)" }}
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <span className="burger-bar" style={{ top: open ? 19 : 12, transform: open ? "rotate(45deg)" : "none" }} />
              <span className="burger-bar" style={{ top: 19, opacity: open ? 0 : 1 }} />
              <span className="burger-bar" style={{ top: open ? 19 : 26, transform: open ? "rotate(-45deg)" : "none" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden sheet-in overflow-y-auto"
          style={{
            backgroundColor: "var(--bg)",
            borderTop: "1px solid var(--border)",
            height: `calc(100dvh - ${navH}px)`,
          }}
        >
          <nav className="container-wide pt-4 pb-12 flex flex-col" aria-label="Mobile">
            {links.map((l, i) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="nav-link-in group flex items-center gap-4 py-4"
                  style={{ "--i": i, borderBottom: "1px solid var(--border)" } as React.CSSProperties}
                >
                  <span className="w-6 text-xs font-semibold tabular-nums" style={{ color: "var(--text-subtle)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="flex-1 text-[1.9rem] font-medium leading-none tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: active ? "var(--primary-text)" : "var(--text-primary)" }}
                  >
                    {l.label}
                  </span>
                  {active && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }}
                      aria-hidden
                    />
                  )}
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    style={{ color: active ? "var(--primary-text)" : "var(--text-subtle)" }}
                  />
                </Link>
              );
            })}

            <div className="nav-link-in mt-8 flex flex-col gap-3" style={{ "--i": links.length } as React.CSSProperties}>
              <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg w-full">
                <Calendar className="w-[18px] h-[18px]" /> Book a free call
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg w-full">
                <MessageCircle className="w-[18px] h-[18px]" /> Chat on WhatsApp
              </a>
              <p className="pt-2 text-center text-xs" style={{ color: "var(--text-subtle)" }}>
                Lagos, Nigeria · Working with clients worldwide
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
