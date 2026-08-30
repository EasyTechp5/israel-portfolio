import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Calendar as CalIcon, Tag } from "lucide-react";
import { posts, getPost, relatedPosts, formatDate } from "@/lib/posts";
import PostCta from "@/components/PostCta";
import Faq from "@/components/Faq";

const SITE = "https://israel.easytech365.com";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };

  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: `${post.title} | Israel Afolabi`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: "Israel Afolabi", url: SITE }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: ["Israel Afolabi"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = relatedPosts(slug);

  // Article + FAQ structured data so this can win rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.h1,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Person",
          name: "Israel Afolabi",
          url: SITE,
          jobTitle: "AI Engineer & AI Automation Specialist",
        },
        publisher: { "@type": "Person", name: "Israel Afolabi", url: SITE },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${post.slug}` },
        keywords: post.keywords.join(", "),
      },
      ...(post.faq
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ══════════════ HEADER ══════════════ */}
      <header className="relative overflow-hidden" style={{ paddingTop: "8rem", paddingBottom: "2.5rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div
          className="glow"
          style={{ top: "-7rem", left: "50%", transform: "translateX(-50%)", width: "30rem", height: "20rem", background: "var(--primary)" }}
          aria-hidden
        />

        <div className="container-narrow relative hero-in">
          <Link href="/blog" className="link-arrow mb-7" style={{ flexDirection: "row" }}>
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap mb-5 mt-5">
            <span className="badge badge-blue">{post.category}</span>
            <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: "var(--text-subtle)" }}>
              <CalIcon className="w-3.5 h-3.5" /> {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: "var(--text-subtle)" }}>
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
          </div>

          <h1 className="mb-5" style={{ fontSize: "clamp(2rem, 4.2vw, 3.1rem)", fontWeight: 800 }}>
            {post.h1}
          </h1>

          <p className="text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {post.description}
          </p>

          <div
            className="flex items-center gap-3 mt-8 pt-6"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--primary-fill), #0043ae)",
                color: "#fff",
                fontFamily: "var(--font-display)",
              }}
            >
              IA
            </span>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Israel Afolabi
              </p>
              <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
                AI Engineer &amp; Automation Specialist
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════ BODY ══════════════ */}
      <div className="container-narrow" style={{ paddingBottom: "4rem" }}>
        {/* Contents */}
        {post.toc.length > 0 && (
          <nav
            className="card p-6 mb-12"
            aria-label="Table of contents"
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.12em] mb-4"
              style={{ color: "var(--text-subtle)" }}
            >
              In this article
            </p>
            <ol className="space-y-2.5">
              {post.toc.map((t, i) => (
                <li key={t.id} className="flex gap-3 text-sm">
                  <span style={{ color: "var(--primary-text)", fontVariantNumeric: "tabular-nums" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${t.id}`}
                    className="hover:underline"
                    style={{ color: "var(--text-body)", textUnderlineOffset: "3px" }}
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />

        {/* FAQ */}
        {post.faq && post.faq.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6" style={{ fontSize: "clamp(1.5rem, 2.6vw, 1.95rem)" }}>
              Frequently asked questions
            </h2>
            <Faq items={post.faq} />
          </section>
        )}

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mt-12">
          <Tag className="w-4 h-4" style={{ color: "var(--text-subtle)" }} aria-hidden />
          {post.tags.map((t) => (
            <span key={t} className="chip text-xs">{t}</span>
          ))}
        </div>

        {/* The DM call to action */}
        <PostCta postTitle={post.title} />
      </div>

      {/* ══════════════ RELATED ══════════════ */}
      {related.length > 0 && (
        <section className="section-padding section-alt" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="container-wide">
            <h2 className="mb-10" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}>
              Keep reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block h-full">
                  <article className="card card-hover p-6 h-full flex flex-col">
                    <span className="badge badge-blue mb-4 self-start">{p.category}</span>
                    <h3 className="mb-3" style={{ fontSize: "1.05rem", lineHeight: 1.35 }}>
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "var(--text-muted)" }}>
                      {p.excerpt}
                    </p>
                    <span className="link-arrow text-sm mt-auto">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
