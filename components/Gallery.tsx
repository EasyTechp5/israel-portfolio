"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
          <button
            key={s.src}
            onClick={() => setOpen(i)}
            aria-label={`View photo: ${s.caption}`}
            className="group relative block w-full overflow-hidden rounded-xl text-left"
            style={{
              aspectRatio: s.portrait ? "4 / 5" : "16 / 10",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-inset)",
            }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />

            {/* Caption overlay — always dark, it sits on the photo */}
            <div
              className="absolute inset-x-0 bottom-0 p-3 sm:p-4"
              style={{
                background:
                  "linear-gradient(to top, rgba(6,9,15,0.88) 0%, rgba(6,9,15,0.45) 55%, transparent 100%)",
              }}
            >
              <p className="font-semibold text-xs sm:text-sm leading-tight" style={{ color: "#fff" }}>
                {s.caption}
              </p>
              <p className="text-[0.7rem] sm:text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.72)" }}>
                {s.meta}
              </p>
            </div>
          </button>
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
