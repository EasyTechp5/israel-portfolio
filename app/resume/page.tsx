import type { Metadata } from "next";
import { Download, FileText, Calendar, MessageCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume | Israel Afolabi",
  description: "View and download the resume of Israel Afolabi — AI Engineer, AI Automation Specialist, and Agentic AI Builder.",
};

export default function ResumePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-[40vh] flex items-center overflow-hidden pt-24 pb-12 section-padding"
        style={{ background: "linear-gradient(135deg, var(--bg) 0%, rgba(0,85,218,0.08) 100%)" }}
      >
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: "rgba(0,85,218,0.08)" }} />
        <div className="container-wide relative z-10 text-center">
          <span className="badge badge-blue mb-6">Resume</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
            Israel <span style={{ color: "#0055DA" }}>Afolabi</span>
          </h1>
          <p className="text-lg mb-2 font-semibold" style={{ color: "#0055DA" }}>
            AI Engineer &nbsp;·&nbsp; AI Automation Specialist &nbsp;·&nbsp; Agentic AI Builder
          </p>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            View my full resume below or download a copy to your device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/resume.pdf"
              download="Israel_Afolabi_Resume.pdf"
              className="btn-primary py-3.5 px-8"
            >
              <Download className="w-5 h-5" />
              Download Resume (PDF)
            </a>
            <a
              href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary py-3.5 px-8"
            >
              <Calendar className="w-5 h-5" />
              Book a Call Instead
            </a>
          </div>
        </div>
      </section>

      {/* PDF Viewer */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="glass-card p-4 sm:p-6 rounded-2xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: "1px solid var(--border-card)" }}>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: "#0055DA" }} />
                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  Israel_Afolabi_Resume.pdf
                </span>
              </div>
              <a
                href="/resume.pdf"
                download="Israel_Afolabi_Resume.pdf"
                className="btn-primary py-2 px-4 text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>

            {/* Embedded PDF */}
            <div className="w-full rounded-xl overflow-hidden" style={{ height: "90vh", minHeight: "600px" }}>
              <iframe
                src="/resume.pdf"
                className="w-full h-full"
                title="Israel Afolabi Resume"
                style={{ border: "none" }}
              />
            </div>

            {/* Mobile fallback */}
            <div className="mt-4 text-center text-sm" style={{ color: "var(--text-subtle)" }}>
              Can&apos;t see the PDF?{" "}
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: "#0055DA" }}>
                Open in a new tab
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,85,218,0.12), rgba(0,85,218,0.04))" }} />
        <div className="container-wide relative z-10 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Work Together?</h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
            Book a free 20-minute call and let&apos;s discuss how I can help your business run on autopilot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="btn-primary py-3.5 px-8">
              <Calendar className="w-5 h-5" /> Book Free Call <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you" target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-3.5 px-8">
              <MessageCircle className="w-5 h-5" /> WhatsApp Israel
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
