import type { Metadata } from "next";
import { MessageCircle, Calendar } from "lucide-react";
import { allPosts, formatDate } from "@/lib/posts";
import Reveal from "@/components/Reveal";
import BlogList from "@/components/BlogList";

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
            <h1 className="mb-6 mx-auto max-w-3xl">
              Practical guides on <em className="mark">AI automation</em>
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
          <BlogList posts={allPosts.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, readTime: p.readTime, date: p.date, dateLabel: formatDate(p.date) }))} />
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
