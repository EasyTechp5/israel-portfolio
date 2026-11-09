"use client";

import { useEffect } from "react";

/**
 * Primary buttons lean a few pixels toward the pointer. Off on touch screens
 * and for people who asked for less motion.
 */
export default function MagneticButtons() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const SEL = ".btn-primary, .btn-whatsapp, .room-cta-btn, .btn-secondary";
    let current: HTMLElement | null = null;
    const reset = () => {
      if (current) {
        current.style.translate = "";
        current = null;
      }
    };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(SEL) as HTMLElement | null;
      if (!el) {
        reset();
        return;
      }
      if (current && current !== el) reset();
      current = el;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.translate = `${(dx * 8).toFixed(1)}px ${(dy * 6).toFixed(1)}px`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", reset);
      reset();
    };
  }, []);
  return null;
}
