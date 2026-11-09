"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";

type P = { slug: string; title: string; excerpt: string; category: string; readTime: string; date: string; dateLabel: string };

export default function BlogList({ posts }: { posts: P[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const shown = posts.filter(
    (p) => (cat === "All" || p.category === cat) && (!term || `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(term)),
  );
  const feature = cat === "All" && !term ? shown[0] : undefined;
  const rest = feature ? shown.slice(1) : shown;

  return (
    <>
      <div className="flex flex-col gap-4 mb-8">
        <label className="project-search">
          <Search className="w-4 h-4" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides" aria-label="Search guides" />
        </label>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} type="button" className="topic-chip" aria-pressed={c === cat} data-on={c === cat} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <p className="text-sm" style={{ color: "var(--text-subtle)" }} aria-live="polite">
          {shown.length} {shown.length === 1 ? "guide" : "guides"}
        </p>
      </div>

      {feature && (
        <Link href={`/blog/${feature.slug}`} className="block group mb-6">
          <article className="card card-hover p-8 sm:p-10" style={{ borderTop: "3px solid var(--primary-fill)" }}>
            <span className="mono-label" style={{ color: "var(--primary-text)" }}>Latest</span>
            <h2 className="my-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", lineHeight: 1.2 }}>{feature.title}</h2>
            <p className="mb-5 max-w-3xl" style={{ color: "var(--text-muted)" }}>{feature.excerpt}</p>
            <div className="flex items-center gap-3 text-sm flex-wrap" style={{ color: "var(--text-subtle)" }}>
              <span className="badge badge-blue">{feature.category}</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {feature.readTime}</span>
              <span>{feature.dateLabel}</span>
              <span className="link-arrow ml-auto">Read <ArrowRight className="w-3.5 h-3.5" /></span>
            </div>
          </article>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block h-full group">
            <article className="card card-hover p-7 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="badge badge-blue">{p.category}</span>
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--text-subtle)" }}><Clock className="w-3.5 h-3.5" /> {p.readTime}</span>
              </div>
              <h2 className="mb-3" style={{ fontSize: "1.2rem", lineHeight: 1.3 }}>{p.title}</h2>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--text-muted)" }}>{p.excerpt}</p>
              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{p.dateLabel}</span>
                <span className="link-arrow text-sm">Read <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            </article>
          </Link>
        ))}
      </div>
      {shown.length === 0 && (
        <p className="text-center py-12" style={{ color: "var(--text-muted)" }}>Nothing matched. Try a broader word, or clear the filter.</p>
      )}
    </>
  );
}
