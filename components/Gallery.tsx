"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  meta: string;
  portrait: boolean;
};

/**
 * Photo grid with a lightbox. Portrait shots keep a 4:5 frame, landscape 16:10,
 * so the masonry-ish grid stays tidy without cropping faces out.
 */
export default function Gallery({ shots }: { shots: Shot[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + shots.length) % shots.length)),
    [shots.length]
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % shots.length)),
    [shots.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {shots.map((s, i) => (
          <Reveal key={s.src} variant="scale" delay={(i % 3) * 90}>
          <button
            onClick={() => setOpen(i)}
            aria-label={`View photo: ${s.caption}`}
            className="gallery-tile group block w-full text-left"
          >
            <span className="gallery-glow" aria-hidden />
            <span
              className="gallery-frame relative block"
              style={{ aspectRatio: s.portrait ? "4 / 5" : "16 / 10" }}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
              />
            </span>
            <span className="relative -mt-3 block px-2 sm:px-3">
              <span
                className="block text-xs font-semibold leading-tight sm:text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {s.caption}
              </span>
              <span className="mt-0.5 block text-[0.7rem] sm:text-xs" style={{ color: "var(--text-subtle)" }}>
                {s.meta}
              </span>
            </span>
          </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          style={{ backgroundColor: "rgba(4,7,12,0.94)", backdropFilter: "blur(6px)" }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={shots[open].caption}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}
          >
            <X className="w-5 h-5" />
          </button>

          {shots.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-6 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next photo"
                className="absolute right-3 sm:right-6 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <figure
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full"
              style={{ height: "min(76vh, 900px)" }}
            >
              <Image
                src={shots[open].src}
                alt={shots[open].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <figcaption className="mt-5 text-center px-4">
              <p className="font-semibold" style={{ color: "#fff" }}>{shots[open].caption}</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.66)" }}>
                {shots[open].meta}
              </p>
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                {open + 1} of {shots.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
