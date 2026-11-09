import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata = { title: "Page not found | Israel Afolabi" };

const LINKS = [
  { href: "/projects", label: "Selected work" },
  { href: "/services", label: "Services" },
  { href: "/service-packages", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="relative overflow-hidden" style={{ paddingTop: "10rem", paddingBottom: "6rem" }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
      <div className="container-wide relative text-center hero-in">
        <span className="eyebrow justify-center">404</span>
        <h1 className="mb-5 mx-auto max-w-3xl">
          That door leads <em className="mark">nowhere</em>
        </h1>
        <p className="section-lead mx-auto text-center mb-8">
          The page you were after has moved, or never existed. The room is still open, and so is everything else.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link href="/" className="btn-primary btn-lg">Back to the room <ArrowRight className="w-4 h-4" /></Link>
          <a href="https://calendar.app.google/8Pfj98atpuSk14RH9" target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
            <Calendar className="w-[18px] h-[18px]" /> Book a free call
          </a>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="topic-chip">{l.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
