import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { bySlug, featuredSlugs } from "@/lib/projects";

/**
 * "Worked examples": a few builds, each one stated as the answer it gives.
 * Every row links straight to that project (/projects?project=slug).
 */
export default function FeaturedWork() {
  const items = featuredSlugs.map(bySlug).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section id="work" className="section-padding">
      <div className="container-wide">
        <Reveal variant="blur">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Worked examples</span>
            <h2 className="mb-4">The problem, and the answer</h2>
            <p className="section-lead">
              A few of the systems I have built, each one written the way a good teacher
              marks a solution: what was wrong, and what it does now.
            </p>
          </div>
        </Reveal>

        <div>
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Link href={`/projects?project=${p.slug}`} className="work-row group" aria-label={`${p.outcome} ${p.title}`}>
                <span className="work-num">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="work-outcome">{p.outcome}</span>
                  <span className="work-title">{p.title}</span>
                </span>
                <span className="work-meta">{p.category}</span>
                <ArrowUpRight className="work-arrow h-5 w-5 justify-self-end" aria-hidden />
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-9">
            <Link href="/projects" className="link-arrow">
              See all worked examples <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
