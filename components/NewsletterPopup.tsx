"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Mail, Check, Loader2 } from "lucide-react";
import { subscribe, isValidEmail } from "@/lib/newsletter";

/**
 * First-visit newsletter popup.
 *
 * Behaviour (per Israel's choice — "dismissible, keeps asking"):
 *  - Appears once the visitor has scrolled a little way down the page.
 *  - Can be closed (X, backdrop, Esc). Closing without subscribing hides it
 *    for the rest of the session, but it returns on the next visit.
 *  - Subscribing sets a permanent flag, so subscribers are never asked again.
 *
 * It never blocks content and only mounts after scroll, so there is no SEO or
 * consent-gating problem.
 */

const SUBSCRIBED_KEY = "pf_newsletter_subscribed_v1"; // localStorage — permanent
const DISMISSED_KEY = "pf_newsletter_dismissed_v1"; // sessionStorage — this visit
const SCROLL_TRIGGER_PX = 500;

function safeGet(store: Storage | undefined, key: string): string | null {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
}
function safeSet(store: Storage | undefined, key: string, value: string) {
  try {
    store?.setItem(key, value);
  } catch {
    /* private mode / blocked storage — fail silently */
  }
}

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const armed = useRef(false); // has the scroll trigger been evaluated already

  // Decide whether to arm the scroll trigger at all.
  useEffect(() => {
    const ls = typeof window !== "undefined" ? window.localStorage : undefined;
    const ss = typeof window !== "undefined" ? window.sessionStorage : undefined;
    if (safeGet(ls, SUBSCRIBED_KEY) === "1") return; // already a subscriber
    if (safeGet(ss, DISMISSED_KEY) === "1") return; // dismissed this session

    const onScroll = () => {
      if (armed.current) return;
      if (window.scrollY > SCROLL_TRIGGER_PX) {
        armed.current = true;
        window.removeEventListener("scroll", onScroll);
        setOpen(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    safeSet(typeof window !== "undefined" ? window.sessionStorage : undefined, DISMISSED_KEY, "1");
  }, []);

  // Esc to close, focus the first field, lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "submitting") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => nameRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
  }, [open, status, close]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    // Bot trap — real users never fill a hidden field.
    if (honeypotRef.current?.value) {
      markSubscribed();
      setStatus("done");
      return;
    }
    if (name.trim().length < 2) {
      setErrorMsg("Please enter your name.");
      setStatus("error");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await subscribe(name, email);
      markSubscribed();
      setStatus("done");
      window.setTimeout(() => setOpen(false), 2600);
    } catch {
      setErrorMsg("Something went wrong. Please try again in a moment.");
      setStatus("error");
    }
  }

  function markSubscribed() {
    safeSet(typeof window !== "undefined" ? window.localStorage : undefined, SUBSCRIBED_KEY, "1");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(4,7,12,0.55)", backdropFilter: "blur(3px)" }}
      onClick={() => status !== "submitting" && close()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nl-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden animate-fade-up"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent header */}
        <div
          className="px-7 pt-7 pb-6"
          style={{ background: "linear-gradient(135deg, var(--primary-fill) 0%, #003a96 100%)" }}
        >
          <button
            onClick={close}
            aria-label="Close"
            disabled={status === "submitting"}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.16)", color: "#fff" }}
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
          >
            <Mail className="w-5 h-5" style={{ color: "#fff" }} />
          </div>
          <h2 id="nl-title" className="text-white" style={{ fontSize: "1.4rem", lineHeight: 1.25 }}>
            AI automation that actually works — in your inbox
          </h2>
        </div>

        {/* Body */}
        <div className="p-7">
          {status === "done" ? (
            <div className="text-center py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "var(--success-soft)" }}
              >
                <Check className="w-6 h-6" style={{ color: "var(--success)" }} />
              </div>
              <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                You&apos;re on the list.
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Thanks — I&apos;ll be in touch with something useful soon.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                Occasional, practical emails on AI and automation for your business —
                real systems, honest advice, no spam. Unsubscribe anytime.
              </p>

              <form onSubmit={onSubmit} noValidate>
                {/* Honeypot — visually hidden, off-screen, ignored by real users */}
                <input
                  ref={honeypotRef}
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />

                <label htmlFor="nl-name" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-body)" }}>
                  Your name
                </label>
                <input
                  id="nl-name"
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (status === "error") setStatus("idle"); }}
                  autoComplete="name"
                  className="w-full mb-4 px-3.5 py-2.5 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: "var(--bg-inset)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  placeholder="Your full name"
                />

                <label htmlFor="nl-email" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-body)" }}>
                  Email address
                </label>
                <input
                  id="nl-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  autoComplete="email"
                  className="w-full mb-4 px-3.5 py-2.5 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: "var(--bg-inset)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  placeholder="you@company.com"
                />

                {status === "error" && (
                  <p className="text-sm mb-4" style={{ color: "var(--accent-text)" }}>{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary w-full"
                  style={status === "submitting" ? { opacity: 0.75 } : undefined}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Subscribing…
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" /> Subscribe
                    </>
                  )}
                </button>
              </form>

              <button
                onClick={close}
                className="w-full mt-3 text-xs transition-colors"
                style={{ color: "var(--text-subtle)" }}
              >
                No thanks, maybe later
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
