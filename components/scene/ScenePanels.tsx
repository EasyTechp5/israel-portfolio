"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calendar, Download, Mail, MapPin, MessageCircle } from "lucide-react";
import CountUp from "@/components/CountUp";
import { IntroPlayer } from "@/components/IntroVideo";
import LagosClock from "@/components/LagosClock";
import { bySlug, featuredSlugs } from "@/lib/projects";
import { allPosts, formatDate } from "@/lib/posts";
import { links, services, stats, type SceneId } from "@/lib/scene";

const lead = "text-[1.0625rem] leading-relaxed max-w-2xl";

function Rows({ children }: { children: React.ReactNode }) {
  return <div className="mt-2">{children}</div>;
}

/** The content that slides up when an object in the room is clicked. */
export default function ScenePanel({ id }: { id: SceneId }) {
  switch (id) {
    case "work": {
      const items = featuredSlugs.map(bySlug).filter((p): p is NonNullable<typeof p> => Boolean(p));
      return (
        <>
          <p className={lead} style={{ color: "var(--text-muted)" }}>
            A few of the systems I have built, each written the way a good teacher marks a solution:
            what was wrong, and what it does now.
          </p>
          <Rows>
            {items.map((p, i) => (
              <Link key={p.slug} href={`/projects?project=${p.slug}`} className="work-row group mt-0">
                <span className="work-num">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="work-outcome">{p.outcome}</span>
                  <span className="work-title">{p.title}</span>
                </span>
                <span className="work-meta">{p.category}</span>
                <ArrowUpRight className="work-arrow h-5 w-5 justify-self-end" aria-hidden />
              </Link>
            ))}
          </Rows>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/projects" className="link-arrow">
              See all worked examples <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/automation-audit" className="link-arrow">
              Free automation audit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      );
    }

    case "call":
      return (
        <>
          <p className={lead} style={{ color: "var(--text-muted)" }}>
            Walk me through the task that eats your week. It takes twenty minutes, there is no pitch and
            no obligation, and you leave with an honest answer on whether automation is worth it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={links.cal} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
              <Calendar className="h-[18px] w-[18px]" /> Pick a time
            </a>
            <a href={links.wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
              <MessageCircle className="h-[18px] w-[18px]" /> Or message me on WhatsApp
            </a>
          </div>
        </>
      );

    case "about":
      return (
        <>
          <p
            className="italic"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", lineHeight: 1.2, color: "var(--text-primary)" }}
          >
            &ldquo;I didn&apos;t start my career in AI.&rdquo;
          </p>
          <p className={`${lead} mt-3`} style={{ color: "var(--text-muted)" }}>
            I started in the classroom. My journey from teaching Mathematics to building AI-powered systems and
            advising businesses has been one of continuous learning, problem-solving, and transformation.
          </p>
          <div className="mt-8 max-w-3xl">
            <IntroPlayer />
          </div>
          <div className="mt-8">
            <Link href="/about" className="link-arrow">
              Read the full story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      );

    case "services":
      return (
        <>
          <p className={lead} style={{ color: "var(--text-muted)" }}>
            Fixed scope, fixed price, fixed date. Three ways to work together, quoted in writing before anything
            is built.
          </p>
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.title} className="py-5" style={{ borderTop: "1px solid var(--border-strong)" }}>
                <h3 className="mb-1.5">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/service-packages" className="btn-primary">
              See pricing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services" className="btn-secondary">All services</Link>
          </div>
        </>
      );

    case "record": {
      // One line under each number, drawn from what the rest of the site already says.
      const notes = [
        { tone: "yellow", r: "-1.6deg", desc: "Live cohorts, the AI Mastery Program and team workshops." },
        { tone: "pink", r: "1.4deg", desc: "Training and automation work for businesses." },
        { tone: "blue", r: "-1deg", desc: "Building AI-powered systems since leaving the classroom." },
        { tone: "white", r: "1.8deg", desc: "Working remotely, across time zones." },
      ];
      const proof = [
        { src: "/images/gallery/training-staff.jpg", caption: "Delivering the AI Mastery Program", r: "-2deg" },
        { src: "/images/gallery/live-class.jpg", caption: "Teaching a live cohort", r: "1.5deg" },
        { src: "/images/gallery/ai-summit.jpg", caption: "Data & AI Leadership Summit", r: "-1deg" },
      ];
      return (
        <>
          <p className={lead} style={{ color: "var(--text-muted)" }}>
            The numbers behind the notes on the wall, and a few of the rooms they came from.
          </p>
          <dl className="notes-grid">
            {stats.map((st, i) => (
              <div key={st.label} className={`note-card note-${notes[i].tone}`} style={{ "--r": notes[i].r, "--d": `${i * 90}ms` } as React.CSSProperties}>
                <dd className="note-num">
                  <CountUp value={st.value} />
                </dd>
                <dt className="note-label">{st.label}</dt>
                <p className="note-desc">{notes[i].desc}</p>
              </div>
            ))}
          </dl>
          <ul className="polaroids" aria-label="Photos from events and classes">
            {proof.map((ph, i) => (
              <li key={ph.src} className="polaroid" style={{ "--r": ph.r, "--d": `${400 + i * 120}ms` } as React.CSSProperties}>
                <Image src={ph.src} alt={ph.caption} width={600} height={450} sizes="(max-width: 640px) 45vw, 260px" />
                <span>{ph.caption}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/projects" className="link-arrow">
              See the work behind it <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={links.cal} target="_blank" rel="noopener noreferrer" className="link-arrow">
              Book a free call <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </>
      );
    }

    case "writing": {
      const latest = allPosts.slice(0, 4);
      return (
        <>
          <p className={lead} style={{ color: "var(--text-muted)" }}>
            Plain-language guides on AI automation, written to be useful before you spend any money.
          </p>
          <div className="mt-2">
            {latest.map((p, i) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="work-row group">
                <span className="work-num">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="work-outcome" style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.8rem)" }}>{p.h1}</span>
                  <span className="work-title">{p.category} · {p.readTime} · {formatDate(p.date)}</span>
                </span>
                <span className="work-meta" />
                <ArrowUpRight className="work-arrow h-5 w-5 justify-self-end" aria-hidden />
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/blog" className="link-arrow">
              All posts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      );
    }

    case "resume":
      return (
        <>
          <p className={lead} style={{ color: "var(--text-muted)" }}>
            AI Engineer and Automation Specialist. I design intelligent systems that replace manual work with
            automation, and train teams to thrive in an AI-first world.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/resume" className="btn-primary btn-lg">
              Open the résumé <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="/resume.pdf" download className="btn-secondary btn-lg">
              <Download className="h-[18px] w-[18px]" /> Download PDF
            </a>
          </div>
        </>
      );

    case "contact":
      return (
        <>
          <p className={lead} style={{ color: "var(--text-muted)" }}>
            WhatsApp is the fastest way to reach me. I work remotely with clients across time zones.
          </p>
          <ul className="mt-6 max-w-xl">
            <li style={{ borderTop: "1px solid var(--border-strong)" }}>
              <a href={links.wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-4">
                <MessageCircle className="h-5 w-5" style={{ color: "var(--primary-text)" }} />
                <span><strong style={{ color: "var(--text-primary)" }}>+234 813 946 4398</strong><br /><span className="mono-label">WhatsApp, preferred</span></span>
              </a>
            </li>
            <li style={{ borderTop: "1px solid var(--border-strong)" }}>
              <a href={links.email} className="flex items-center gap-4 py-4 break-all">
                <Mail className="h-5 w-5 flex-shrink-0" style={{ color: "var(--primary-text)" }} />
                <span style={{ color: "var(--text-primary)" }}>afolabiisraelolajide@gmail.com</span>
              </a>
            </li>
            <li style={{ borderTop: "1px solid var(--border-strong)", borderBottom: "1px solid var(--border-strong)" }}>
              <div className="flex items-center gap-4 py-4">
                <MapPin className="h-5 w-5" style={{ color: "var(--primary-text)" }} />
                <span>
                  <strong style={{ color: "var(--text-primary)" }}>Lagos, Nigeria</strong><br />
                  <span className="mono-label"><LagosClock /> · working with clients worldwide</span>
                </span>
              </div>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="link-arrow">LinkedIn <ArrowUpRight className="h-4 w-4" /></a>
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="link-arrow">GitHub <ArrowUpRight className="h-4 w-4" /></a>
            <Link href="/contact" className="link-arrow">Contact page <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </>
      );
  }
}
