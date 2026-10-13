"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Calendar, Loader2 } from "lucide-react";

const VIDEO_ID = "IHGpIBAgcnQ";
const TITLE = "Build Smart Systems That Work While You Sleep";
const DURATION = "2:11";
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const BOOK_URL =
  "https://wa.me/2348139464398?text=Hi%20Israel%2C%20how%20are%20you%20doing%3F%20I%20would%20love%20to%20discuss%20a%20project%20with%20you.%20Let%20me%20know%20when%20you%27ll%20be%20available.";

/**
 * Intro video with a custom cover.
 *
 * The cover is a still from the video, hosted on this site, so YouTube is NOT
 * contacted until the visitor presses play. That keeps the page fast and sets
 * no third-party cookies on first load. The embed uses the privacy-enhanced
 * youtube-nocookie.com domain and starts playing as soon as it has loaded.
 */
export function IntroPlayer({ priority = false }: { priority?: boolean }) {
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [coverGone, setCoverGone] = useState(false);

  // Once the player is ready: fade the cover, then remove it from the DOM so
  // nothing sits on top of the player.
  useEffect(() => {
    if (!loaded) return;
    const fade = setTimeout(() => setCoverGone(true), 550);
    return () => clearTimeout(fade);
  }, [loaded]);

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
      {started && (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={TITLE}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
        />
      )}

      {/* Cover. Stays up (with a spinner) until the player has loaded, then fades away. */}
      {!coverGone && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: loaded ? 0 : 1,
            pointerEvents: loaded ? "none" : "auto",
            background: "linear-gradient(120deg, #06090f 0%, #0a1a3d 50%, #0b5ed7 140%)",
            color: "#fff",
          }}
          aria-hidden={loaded}
        >
          <button
            type="button"
            onClick={() => setStarted(true)}
            disabled={started}
            aria-label={`Play video: ${TITLE} (${DURATION})`}
            className="group absolute inset-0 block h-full w-full text-left disabled:cursor-default"
          >
            {/* Still from the video. Full-bleed on phones, right-hand panel from sm up. */}
            <span className="absolute inset-0 overflow-hidden sm:left-auto sm:w-[52%]">
              <Image
                src="/images/intro-video-poster.jpg"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 52vw, 560px"
                priority={priority}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: "50% 30%" }}
              />
              {/* Phones: darken the bottom edge so the badge reads. */}
              <span
                aria-hidden
                className="absolute inset-0 sm:hidden"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(6,9,15,0.7) 0%, rgba(6,9,15,0.1) 45%, rgba(6,9,15,0.35) 100%)",
                }}
              />
              {/* sm and up: melt the still into the dark panel on the left. */}
              <span
                aria-hidden
                className="absolute inset-0 hidden sm:block"
                style={{
                  background:
                    "linear-gradient(90deg, #0a1a3d 0%, rgba(10,26,61,0.7) 18%, rgba(10,26,61,0.15) 50%, transparent 70%), linear-gradient(0deg, rgba(6,9,15,0.45) 0%, transparent 35%)",
                }}
              />
            </span>

            {/* Dotted texture, left side only */}
            <span
              aria-hidden
              className="absolute inset-0 hidden opacity-50 sm:block"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage: "linear-gradient(90deg, #000 0%, transparent 55%)",
                WebkitMaskImage: "linear-gradient(90deg, #000 0%, transparent 55%)",
              }}
            />

            {/* Copy: title and subline, left aligned. Hidden on phones, where only the play button shows. */}
            <span className="relative z-10 flex h-full flex-col justify-between p-4 sm:w-[54%] sm:p-6 md:p-9">
              <span aria-hidden />

              <span className="hidden sm:block">
                <span
                  className="block font-bold leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)",
                    textWrap: "balance",
                  }}
                >
                  {TITLE}
                </span>
                <span
                  className="mt-3 hidden text-sm md:block lg:text-base"
                  style={{ color: "rgba(255,255,255,0.8)", maxWidth: "26rem" }}
                >
                  Who I am, the tools I work in, and how I help businesses automate the work that eats their
                  week.
                </span>
              </span>

              {/* Play control. Centered on phones, bottom-left from sm up. */}
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:static sm:left-auto sm:top-auto sm:translate-x-0 sm:translate-y-0 sm:mt-6 sm:flex sm:items-center sm:gap-4">
                <span className="relative inline-flex h-16 w-16 items-center justify-center sm:h-[4.5rem] sm:w-[4.5rem]">
                  {!started && (
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-ping rounded-full opacity-40"
                      style={{ background: "#fff" }}
                    />
                  )}
                  <span
                    className="relative inline-flex h-full w-full items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "#fff", boxShadow: "0 10px 34px rgba(0,0,0,0.45)" }}
                  >
                    {started ? (
                      <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#0b5ed7" }} />
                    ) : (
                      <Play className="ml-1 h-7 w-7" style={{ color: "#0b5ed7", fill: "#0b5ed7" }} />
                    )}
                  </span>
                </span>
                <span className="hidden text-base font-semibold sm:block">
                  {started ? "Loading video…" : "Watch the intro"}
                </span>
              </span>
            </span>
          </button>
        </div>
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
            <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Calendar className="h-4 w-4" /> Book a free call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
