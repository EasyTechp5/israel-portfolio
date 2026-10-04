"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, Calendar } from "lucide-react";

const VIDEO_ID = "IHGpIBAgcnQ";
const TITLE = "Build Smart Systems That Work While You Sleep";
const DURATION = "2:11";
const CHANNEL_URL = "https://www.youtube.com/@afolabiisraelolajide949";
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const CAL = "https://calendar.app.google/8Pfj98atpuSk14RH9";

/** lucide has no brand icons, so the YouTube mark is inline. */
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}

/**
 * Intro video with a custom cover.
 *
 * YouTube is NOT loaded until the visitor presses play: that keeps the page
 * fast, avoids third-party cookies on first load, and lets the cover be on-brand
 * instead of YouTube's auto-picked thumbnail. The embed uses the privacy-enhanced
 * youtube-nocookie.com domain.
 */
export function IntroPlayer({ priority = false }: { priority?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl"
      style={{
        aspectRatio: "16 / 9",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border)",
        background: "#06090f",
      }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={TITLE}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${TITLE} (${DURATION})`}
          className="group absolute inset-0 block h-full w-full text-left"
          style={{
            background: "linear-gradient(120deg, #06090f 0%, #0a1a3d 45%, #0b5ed7 130%)",
            color: "#fff",
          }}
        >
          {/* dotted texture */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage: "linear-gradient(90deg, #000 0%, transparent 70%)",
              WebkitMaskImage: "linear-gradient(90deg, #000 0%, transparent 70%)",
            }}
          />

          {/* glow behind the portrait */}
          <span
            aria-hidden
            className="absolute -right-10 top-1/2 h-[120%] w-[55%] -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: "rgba(43,123,255,0.45)" }}
          />

          {/* portrait, right-aligned, fading into the background */}
          <span className="absolute inset-y-0 right-0 hidden sm:block" style={{ width: "46%" }}>
            <Image
              src="/images/israel-hero.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 40vw, 480px"
              priority={priority}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ objectPosition: "50% 18%" }}
            />
            <span
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, #0a1a3d 0%, rgba(10,26,61,0.55) 22%, transparent 55%), linear-gradient(0deg, rgba(6,9,15,0.55) 0%, transparent 35%)",
              }}
            />
          </span>

          {/* copy */}
          <span className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-9 sm:w-[62%]">
            <span className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] sm:text-xs"
                style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                Intro video
              </span>
              <span className="text-xs font-medium sm:text-sm" style={{ color: "rgba(255,255,255,0.78)" }}>
                {DURATION}
              </span>
            </span>

            <span className="block">
              <span
                className="block font-bold leading-[1.1] tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.25rem, 3.4vw, 2.6rem)",
                  textWrap: "balance",
                }}
              >
                {TITLE}
              </span>
              <span
                className="mt-2 hidden text-sm sm:block lg:text-base"
                style={{ color: "rgba(255,255,255,0.8)", maxWidth: "32rem" }}
              >
                Who I am, the tools I work in, and how I help businesses automate the work that eats their week.
              </span>
            </span>

            <span className="flex items-center gap-3 sm:gap-4">
              <span className="relative inline-flex h-14 w-14 items-center justify-center sm:h-[4.5rem] sm:w-[4.5rem]">
                <span
                  aria-hidden
                  className="absolute inset-0 animate-ping rounded-full opacity-40"
                  style={{ background: "#fff" }}
                />
                <span
                  className="relative inline-flex h-full w-full items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "#fff", boxShadow: "0 10px 34px rgba(0,0,0,0.45)" }}
                >
                  <Play className="ml-1 h-6 w-6 sm:h-7 sm:w-7" style={{ color: "#0b5ed7", fill: "#0b5ed7" }} />
                </span>
              </span>
              <span className="text-sm font-semibold sm:text-base">Watch the intro</span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

/** Heading + player + links, ready to drop into a page. */
export default function IntroVideoSection({
  eyebrow = "Meet Israel",
  heading = "Two minutes to see how I work",
  lead = "A quick, honest introduction: what I build, the tools I use, and the kind of problems I like solving.",
  priority = false,
}: {
  eyebrow?: string;
  heading?: string;
  lead?: string;
  priority?: boolean;
}) {
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: TITLE,
    description:
      "A two-minute introduction to Israel Afolabi, an automation expert working with Zapier, n8n, Make and Google Apps Script, and how he helps businesses automate their workflows.",
    thumbnailUrl: [`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`],
    uploadDate: "2025-11-12T09:01:45.000Z",
    duration: "PT2M11S",
    contentUrl: WATCH_URL,
    embedUrl: `https://www.youtube.com/embed/${VIDEO_ID}`,
  };

  return (
    <section className="section-padding" style={{ paddingBlock: "clamp(3.5rem, 7vw, 6rem)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <div className="container-wide">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <span className="eyebrow justify-center">{eyebrow}</span>
          <h2 className="mb-4">{heading}</h2>
          <p className="section-lead mx-auto text-center">{lead}</p>
        </div>

        <div className="mx-auto max-w-5xl">
          <IntroPlayer priority={priority} />

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a href={CAL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Calendar className="h-4 w-4" /> Book a free call
            </a>
            <a href={WATCH_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <ExternalLink className="h-4 w-4" /> Watch on YouTube
            </a>
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <YoutubeIcon className="h-4 w-4" /> Subscribe to the channel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
