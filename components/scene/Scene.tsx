"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, Moon, Plus, Minus, Sun, X } from "lucide-react";
import Typewriter from "@/components/Typewriter";
import SceneArt from "./SceneArt";
import SceneIntro from "./SceneIntro";
import ScenePanel from "./ScenePanels";
import { hotspots, isSceneId, lampSpot, type SceneId } from "@/lib/scene";

const W = 1600;
const H = 900;
const SEEN_KEY = "scene_intro_seen_v1";

/* ── The real time in Lagos, for the wall clock ── */
const lagos = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "Africa/Lagos",
  hourCycle: "h23",
});
const lagosKey = () => lagos.format(new Date());
const subscribeSecond = (cb: () => void) => {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
};
function useLagosClock() {
  const key = useSyncExternalStore(subscribeSecond, lagosKey, () => "");
  if (!key) return null;
  const [h, m, s] = key.split(":").map(Number);
  return { h, m, s };
}

/**
 * The home page: an illustrated room you can drag around, zoom and click.
 * Each object opens a panel (work, calendar, about, and so on). Deep links
 * (/?open=work) open a panel directly, and "Overview" is always one click away
 * for anyone who prefers a plain page.
 */
export default function Scene({ children }: { children?: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const clock = useLagosClock();

  const [intro, setIntro] = useState(true);
  const [lamp, setLamp] = useState(false);
  const [open, setOpen] = useState<SceneId | null>(null);
  const [menu, setMenu] = useState(false);

  const viewport = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const view = useRef({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: 0, dragging: false, pinch: 0, justDragged: false });
  const userZoomed = useRef(false);

  /* ── Pan and zoom ── */
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

  const zoomBy = (factor: number) => {
    const vp = viewport.current!;
    zoomAt(factor, vp.clientWidth / 2, vp.clientHeight / 2, true);
  };

  useEffect(() => {
    fit();
    const onResize = () => (userZoomed.current ? apply() : fit());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fit, apply]);

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

  /* ── Panels, deep links and the intro ── */
  const openPanel = useCallback((id: SceneId | null) => {
    setOpen(id);
    setMenu(false);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("open", id);
    else url.searchParams.delete("open");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, []);

  useEffect(() => {
    // Decide, once, whether this visitor needs the doors.
    const param = new URLSearchParams(window.location.search).get("open");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage blocked: show the doors */
    }
    const t = window.setTimeout(() => {
      if (isSceneId(param)) setOpen(param);
      if (isSceneId(param) || reduced || seen) setIntro(false);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const finishIntro = useCallback(() => {
    setIntro(false);
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open && !menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) openPanel(null);
      else setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, menu, openPanel]);

  const current = hotspots.find((h) => h.id === open) ?? null;

  return (
    <div className={`scene ${lamp ? "lamp-on" : ""} ${menu ? "menu-open" : ""} ${open ? "panel-open" : ""}`}>
      {/* ── The room ── */}
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
              onClick={() => openPanel(h.id)}
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
            onClick={() => setLamp((v) => !v)}
            aria-pressed={lamp}
            aria-label="Switch the desk lamp"
          >
            <span className="hotspot-dot" />
            <span className="hotspot-label">{lamp ? "Lamp off" : "Lamp on"}</span>
          </button>
        </div>
      </div>

      {/* ── Controls laid over the room ── */}
      <header className="scene-top">
        <div className="scene-bar">
          <button type="button" className="scene-btn" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-controls="scene-menu">
            <span className="scene-burger" data-open={menu} aria-hidden><i /><i /></span>
            <span className="sr-only">{menu ? "Close contents" : "Open contents"}</span>
          </button>
          <span className="scene-name">Israel Afolabi</span>
          <div className="flex items-center gap-2">
            <Link href="/overview" className="scene-btn scene-link">Plain page</Link>
            <button
              type="button"
              className="scene-btn"
              onClick={() => setTheme(dark ? "light" : "dark")}
              aria-label={dark ? "Switch to day" : "Switch to night"}
            >
              {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
        <div className="scene-issue">{children}</div>
      </header>

      <section className="scene-title" aria-label="Introduction">
        <h1>
          Israel Afolabi
          <span className="sr-only">
            : AI Engineer, AI Automation Specialist and Agentic AI Builder. I build AI systems that make your
            business run itself.
          </span>
        </h1>
        {!intro && (
          <Typewriter
            text="AI engineer. This is my desk: have a look around."
            startDelay={500}
            speed={34}
            className="scene-sub"
          />
        )}
        <p className="scene-hint">Drag to look around · scroll to zoom · click anything</p>
        <Link href="/overview" className="scene-plain">
          Prefer a plain page? <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      <div className="scene-zoom" role="group" aria-label="Zoom">
        <button type="button" className="scene-btn" onClick={() => zoomBy(1 / 1.35)} aria-label="Zoom out"><Minus className="h-4 w-4" /></button>
        <button type="button" className="scene-btn scene-fit" onClick={() => fit(true)}>Fit</button>
        <button type="button" className="scene-btn" onClick={() => zoomBy(1.35)} aria-label="Zoom in"><Plus className="h-4 w-4" /></button>
      </div>

      {/* ── Contents (the menu) ── */}
      {menu && (
        <nav id="scene-menu" className="scene-menu" aria-label="Contents">
          <div className="container-wide pt-28 pb-16">
            <p className="mono-label mb-6">Contents</p>
            <ol>
              {hotspots.map((h, i) => (
                <li key={h.id}>
                  <button type="button" className="menu-item" onClick={() => openPanel(h.id)}>
                    <span className="menu-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="menu-title">{h.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mono-label mt-12 mb-4">Pages</p>
            <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[0.95rem]">
              {[
                ["/overview", "Plain overview"],
                ["/service-packages", "Pricing"],
                ["/projects", "All work"],
                ["/blog", "Blog"],
                ["/automation-audit", "Free audit"],
                ["/resume", "Résumé"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="link-arrow">{label} <ArrowRight className="h-4 w-4" /></Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* ── The panel that slides up ── */}
      {current && (
        <div className="scene-sheet-wrap" role="dialog" aria-modal="true" aria-label={current.title} onClick={() => openPanel(null)}>
          <article className="scene-sheet" onClick={(e) => e.stopPropagation()}>
            <span className="scene-sheet-grip" aria-hidden />
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="mono-label">{current.object}</p>
                <h2 className="mt-2 mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>{current.title}</h2>
              </div>
              <button type="button" className="sheet-close" onClick={() => openPanel(null)}>
                Close <X className="h-4 w-4" />
              </button>
            </div>
            <ScenePanel id={current.id} />
          </article>
        </div>
      )}

      {intro && <SceneIntro onDone={finishIntro} />}
    </div>
  );
}
