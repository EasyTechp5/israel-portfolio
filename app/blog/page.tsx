import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, Calendar } from "lucide-react";
import { allPosts, formatDate } from "@/lib/posts";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "AI Automation Blog | Israel Afolabi",
  description:
    "Practical guides on AI automation, AI agents and building automated business systems — written by a working AI automation engineer.",
  keywords: [
    "AI automation blog",
    "AI agents",
    "n8n tutorials",
    "workflow automation",
    "AI automation engineer",
  ],
  alternates: { canonical: "https://israel.easytech365.com/blog" },
  openGraph: {
    title: "AI Automation Blog | Israel Afolabi",
    description:
      "Practical guides on AI automation, AI agents and building automated business systems.",
    url: "https://israel.easytech365.com/blog",
    type: "website",
  },
};

const CAL = "https://calendar.app.google/8Pfj98atpuSk14RH9";
const WA =
  "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20read%20your%20blog%20and%20I%20am%20interested%20in%20your%20AI%20automation%20services";

export default function BlogIndex() {

  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "3rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div
          className="glow"
          style={{ top: "-6rem", left: "50%", transform: "translateX(-50%)", width: "32rem", height: "22rem", background: "var(--primary)" }}
          aria-hidden
        />
        <div className="container-wide relative text-center">
          <div className="hero-in">
            <span className="eyebrow justify-center">Blog</span>
            <h1 className="mb-6 mx-auto max-w-3xl" style={{ fontWeight: 800 }}>
              Practical guides on <span style={{ color: "var(--primary-text)" }}>AI automation</span>
            </h1>
            <p className="section-lead mx-auto text-center">
              No hype and no theory for its own sake — just what I have learned building
              automation systems that businesses actually depend on.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ GRID ══════════════ */}
      <section className="section-padding" style={{ paddingTop: "2rem" }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allPosts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 60}>
                <Link href={`/blog/${p.slug}`} className="block h-full group">
                  <article className="card card-hover p-7 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="badge badge-blue">{p.category}</span>
                      <span
                        className="inline-flex items-center gap-1 text-xs"
                        style={{ color: "var(--text-subtle)" }}
                      >
                        <Clock className="w-3.5 h-3.5" /> {p.readTime}
                      </span>
                    </div>

                    <h2 className="mb-3" style={{ fontSize: "1.2rem", lineHeight: 1.3 }}>
                      {p.title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--text-muted)" }}>
                      {p.excerpt}
                    </p>

                    <div
                      className="flex items-center justify-between pt-4"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
                        {formatDate(p.date)}
                      </span>
                      <span className="link-arrow text-sm">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="section-padding section-alt" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container-wide">
          <Reveal>
            <div className="card p-10 sm:p-14 text-center">
              <h2 className="mb-4">Reading is good. Building is better.</h2>
              <p className="section-lead mx-auto mb-9 text-center">
                If something here described your business, send me a DM. Tell me what is
                eating your week and I will tell you honestly whether automation is worth it.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
                  <MessageCircle className="w-[18px] h-[18px]" /> DM me on WhatsApp
                </a>
                <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
                  <Calendar className="w-[18px] h-[18px]" /> Book a free call
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
