"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Portrait that dissolves into the page instead of sitting in a box: the photo
 * is feathered at the sides and bottom, and a slow colour aura sits behind it.
 * It tilts toward the cursor and drifts slightly as the page scrolls, and both
 * effects are switched off for visitors who prefer reduced motion.
 */
export default function HeroPortrait({
  alt,
  priority = false,
}: {
  alt: string;
  priority?: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rx = 0;
    let ry = 0;
    let tx = 0;
    let ty = 0;
    let py = 0;
    let raf = 0;

    const paint = () => {
      raf = 0;
      // Ease toward the target for a smooth, weighted feel.
      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;
      el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(${py.toFixed(1)}px)`;
      if (Math.abs(tx - rx) > 0.02 || Math.abs(ty - ry) > 0.02) raf = requestAnimationFrame(paint);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      ty = Math.max(-1, Math.min(1, nx * 2)) * 7;
      tx = Math.max(-1, Math.min(1, ny * 2)) * -5;
      schedule();
    };
    const onScroll = () => {
      py = Math.min(window.scrollY, 700) * -0.07;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative mx-auto lg:ml-auto lg:mr-0" style={{ maxWidth: "24rem" }}>
      {/* Behind the photo: slow colour aura */}
      <div className="portrait-aura" aria-hidden />

      <div ref={stage} className="relative will-change-transform">
        <div className="portrait-feather relative aspect-[4/5]">
          <Image
            src="/images/israel-hero.jpg"
            alt={alt}
            fill
            sizes="24rem"
            className="object-cover object-top"
            priority={priority}
          />
        </div>
      </div>
    </div>
  );
}
