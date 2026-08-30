import type { Metadata } from "next";
import { Download, FileText, Calendar, MessageCircle, ArrowRight, ExternalLink } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Resume | Israel Afolabi",
  description: "View and download the resume of Israel Afolabi — AI Engineer, AI Automation Specialist and Agentic AI Builder.",
};

const CAL = "https://calendar.app.google/6EJ6aPfh3ScRUw6V9";
const WA = "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you";

export default function ResumePage() {
  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "3rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div className="glow" style={{ top: "-6rem", left: "50%", transform: "translateX(-50%)", width: "30rem", height: "20rem", background: "var(--primary)" }} aria-hidden />

        <div className="container-wide relative text-center">
          <div className="hero-in">
            <span className="eyebrow justify-center">Resume</span>
            <h1 className="mb-4" style={{ fontWeight: 800 }}>Israel Afolabi</h1>
            <p className="text-base font-medium mb-5" style={{ color: "var(--primary-text)" }}>
              AI Engineer &nbsp;·&nbsp; AI Automation Specialist &nbsp;·&nbsp; Agentic AI Builder
            </p>
            <p className="section-lead mx-auto mb-9 text-center">
              Read the full resume below, or download a copy to keep.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/resume.pdf" download="Israel_Afolabi_Resume.pdf" className="btn-primary btn-lg">
                <Download className="w-[18px] h-[18px]" /> Download resume (PDF)
              </a>
              <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
                <Calendar className="w-[18px] h-[18px]" /> Book a call instead
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ VIEWER ══════════════ */}
      <section className="section-padding" style={{ paddingTop: "2.5rem" }}>
        <div className="container-wide">
          <Reveal>
            <div className="card overflow-hidden">
              {/* Toolbar */}
              <div
                className="flex items-center justify-between gap-4 px-5 py-3.5"
                style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-inset)" }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "var(--primary-text)" }} />
                  <span className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                    Israel_Afolabi_Resume.pdf
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-sm hidden sm:inline-flex"
                  >
                    <ExternalLink className="w-4 h-4" /> Open
                  </a>
                  <a href="/resume.pdf" download="Israel_Afolabi_Resume.pdf" className="btn-primary text-sm">
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              </div>

              {/* Embed */}
              <div className="w-full" style={{ height: "min(88vh, 1000px)", minHeight: "520px", backgroundColor: "var(--bg-inset)" }}>
                <iframe
                  src="/resume.pdf"
                  className="w-full h-full"
                  title="Israel Afolabi resume"
                  style={{ border: "none" }}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-4 text-center text-sm" style={{ color: "var(--text-subtle)" }}>
              Cannot see the PDF?{" "}
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="font-medium underline" style={{ color: "var(--primary-text)" }}>
                Open it in a new tab
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="section-padding section-alt" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container-wide">
          <Reveal>
            <div className="card p-10 sm:p-14 text-center">
              <h2 className="mb-4">Ready to work together?</h2>
              <p className="section-lead mx-auto mb-9 text-center">
                Book a free 20-minute call and let&apos;s talk about how automation could
                change the way your business runs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
                  <Calendar className="w-[18px] h-[18px]" /> Book free call <ArrowRight className="w-4 h-4" />
                </a>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
                  <MessageCircle className="w-[18px] h-[18px]" /> WhatsApp Israel
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
