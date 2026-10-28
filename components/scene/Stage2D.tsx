"use client";

import { useCallback, useEffect, useRef } from "react";
import SceneArt from "./SceneArt";
import { useLagosClock } from "./useLagosClock";
import { hotspots, lampSpot } from "@/lib/scene";
import type { StageProps } from "./stage";

const W = 1600;
const H = 900;

/**
 * The illustrated room: a 1600 x 900 SVG you can drag, wheel-zoom and pinch.
 * Used as the fallback when the 3D room can't run (no WebGL, low-power device).
 */
export default function Stage2D({ lamp, onOpen, onLamp, onReady, apiRef }: StageProps) {
  const clock = useLagosClock();

  const viewport = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const view = useRef({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: 0, dragging: false, pinch: 0, justDragged: false });
  const userZoomed = useRef(false);

  const bounds = () => {
    const vp = viewport.current!;
    const cover = Math.max(vp.clientWidth / W, vp.clientHeight / H);
    // On a tall phone "cover" shows only a sliver of the room, so allow zooming out further.
    const portrait = vp.clientHeight > vp.clientWidth;
    return { vw: vp.clientWidth, vh: vp.clientHeight, min: portrait ? cover * 0.6 : cover, max: cover * 3.2 };
  };

  const apply = useCallback((animate = false) => {
    const el = stage.current;
    if (!el) return;
    const { vw, vh } = bounds();
    const v = view.current;
    // Pan within the room; if the room is smaller than the screen on an axis, centre it.
    const axis = (pos: number, view: number, size: number) =>
      size >= view ? Math.min(0, Math.max(view - size, pos)) : (view - size) / 2;
    v.x = axis(v.x, vw, W * v.s);
    v.y = axis(v.y, vh, H * v.s);
    el.style.transition = animate ? "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)" : "none";
    el.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
    el.style.setProperty("--inv", String(1 / v.s));
  }, []);

  const fit = useCallback(
    (animate = false) => {
      const { vw, vh, min } = bounds();
      view.current = { s: min, x: (vw - W * min) / 2, y: (vh - H * min) / 2 };
      userZoomed.current = false;
      apply(animate);
    },
    [apply]
  );

  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number, animate = false) => {
      const { min, max } = bounds();
      const v = view.current;
      const next = Math.min(max, Math.max(min, v.s * factor));
      const k = next / v.s;
      v.x = cx - (cx - v.x) * k;
      v.y = cy - (cy - v.y) * k;
      v.s = next;
      userZoomed.current = next > min * 1.01;
      apply(animate);
    },
    [apply]
  );

  useEffect(() => {
    apiRef.current = {
      zoomBy: (f) => {
        const vp = viewport.current!;
        zoomAt(f, vp.clientWidth / 2, vp.clientHeight / 2, true);
      },
      fit: () => fit(true),
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, zoomAt, fit]);

  useEffect(() => {
    fit();
    onReady();
    const onResize = () => (userZoomed.current ? apply() : fit());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fit, apply, onReady]);

  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0016), e.clientX - r.left, e.clientY - r.top);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture.current.moved = 0;
    gesture.current.justDragged = false;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };
    const g = gesture.current;

    if (pointers.current.size === 2) {
      pointers.current.set(e.pointerId, next);
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const r = viewport.current!.getBoundingClientRect();
      if (g.pinch) zoomAt(dist / g.pinch, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      g.pinch = dist;
      g.dragging = true;
      return;
    }

    g.moved += Math.abs(next.x - prev.x) + Math.abs(next.y - prev.y);
    if (!g.dragging && g.moved > 8) {
      g.dragging = true;
      viewport.current?.setPointerCapture(e.pointerId);
    }
    if (g.dragging) {
      view.current.x += next.x - prev.x;
      view.current.y += next.y - prev.y;
      apply();
    }
    pointers.current.set(e.pointerId, next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (g.dragging) {
      g.justDragged = true;
      window.setTimeout(() => (g.justDragged = false), 80);
    }
    if (pointers.current.size < 2) g.pinch = 0;
    if (pointers.current.size === 0) g.dragging = false;
  };

  // A drag that ends on a hotspot must not also click it.
  const swallowClickAfterDrag = (e: React.MouseEvent) => {
    if (gesture.current.justDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={viewport}
      className="scene-viewport"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={swallowClickAfterDrag}
    >
      <div ref={stage} className="scene-stage" style={{ width: W, height: H }}>
        <SceneArt lamp={lamp} clock={clock} />

        {hotspots.map((h) => (
          <button
            key={h.id}
            type="button"
            className="hotspot"
            style={{ left: h.x, top: h.y }}
            onClick={() => onOpen(h.id)}
            aria-label={`${h.label}: ${h.object.toLowerCase()}`}
          >
            <span className="hotspot-dot" />
            <span className="hotspot-label">{h.label}</span>
          </button>
        ))}

        <button
          type="button"
          className="hotspot lamp-spot"
          style={{ left: lampSpot.x, top: lampSpot.y }}
          onClick={onLamp}
          aria-pressed={lamp}
          aria-label="Switch the desk lamp"
        >
          <span className="hotspot-dot" />
          <span className="hotspot-label">{lamp ? "Lamp off" : "Lamp on"}</span>
        </button>
      </div>
    </div>
  );
}
