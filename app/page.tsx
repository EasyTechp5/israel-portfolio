import Link from "next/link";
import Scene from "@/components/scene/Scene";
import IssueBar from "@/components/IssueBar";
import { hotspots } from "@/lib/scene";

/**
 * Home: an illustrated desk you can look around and click. The plain-page
 * version lives at /overview. The list below is for search engines, screen
 * readers and anyone with scripts off: every page and every object in the room
 * is reachable as an ordinary link.
 */
export default function HomePage() {
  return (
    <>
      <Scene>
        <IssueBar />
      </Scene>

      <nav className="sr-only" aria-label="All pages">
        <p>
          Israel Afolabi is an AI engineer and automation specialist in Lagos, Nigeria. He designs AI automation
          systems and AI agents for businesses and trains teams to use AI.
        </p>
        <ul>
          {hotspots.map((h) => (
            <li key={h.id}>
              <Link href={`/?open=${h.id}`}>{h.label}</Link>
            </li>
          ))}
          <li><Link href="/overview">Overview</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/service-packages">Pricing</Link></li>
          <li><Link href="/projects">Work</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/resume">Résumé</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/automation-audit">Free automation audit</Link></li>
        </ul>
      </nav>
    </>
  );
}
