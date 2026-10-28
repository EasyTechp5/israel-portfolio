"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, Moon, Plus, Minus, Sun, Volume2, VolumeX, X } from "lucide-react";
import { startAmbient, stopAmbient } from "@/lib/ambient";
import Typewriter from "@/components/Typewriter";
import SceneIntro from "./SceneIntro";
import ScenePanel from "./ScenePanels";
import Stage2D from "./Stage2D";
import type { StageApi } from "./stage";
import { hotspots, isSceneId, type SceneId } from "@/lib/scene";

// The 3D room (three.js) is its own chunk: it loads only here, never on other pages.
const Stage3D = dynamic(() => import("./Stage3D"), { ssr: false });

const SEEN_KEY = "scene_intro_seen_v1";
const MUTE_KEY = "scene_muted_v1";

/**
 * The home page shell: doors, contents menu, panels, controls. It hosts either
 * the live 3D room or, when 3D can't run, the illustrated room. Deep links
 * (/?open=work) open a panel directly; ?view=2d / ?view=3d force a stage.
 */
export default function Scene({ children }: { children?: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const [mode, setMode] = useState<"2d" | "3d" | null>(null);
  const [stageReady, setStageReady] = useState(false);
  const [intro, setIntro] = useState(true);
  const [lamp, setLamp] = useState(false);
  const [open, setOpen] = useState<SceneId | null>(null);
  const [menu, setMenu] = useState(false);
  const api = useRef<StageApi | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  // Sound: browsers need a gesture first, so the beat starts on the visitor's first
  // click or key (the "Come in" button, usually). The choice to mute is remembered.
  useEffect(() => {
    let saved = false;
    try {
      saved = window.localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      /* ignore */
    }
    mutedRef.current = saved;
    const t = window.setTimeout(() => setMuted(saved), 0);
    const kick = () => {
      if (!mutedRef.current) startAmbient();
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      stopAmbient();
    };
  }, []);

  const toggleSound = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    try {
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (next) stopAmbient();
    else startAmbient();
  }, []);

  /* ── Panels and deep links ── */
  const openPanel = useCallback((id: SceneId | null) => {
    setOpen(id);
    setMenu(false);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("open", id);
    else url.searchParams.delete("open");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, []);

  useEffect(() => {
    // Decide, once: which stage to run, and whether this visitor needs the doors.
    const params = new URLSearchParams(window.location.search);
    const param = params.get("open");
    const force = params.get("view");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const weak = (nav.deviceMemory ?? 8) < 3 || nav.connection?.saveData === true;
    const next: "2d" | "3d" = force === "2d" ? "2d" : force === "3d" ? "3d" : webgl && !weak ? "3d" : "2d";

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage blocked: show the doors */
    }

    const t = window.setTimeout(() => {
      setMode(next);
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

  const onReady = useCallback(() => setStageReady(true), []);
  const onFail = useCallback(() => setMode("2d"), []);
  const onLamp = useCallback(() => setLamp((v) => !v), []);

  const current = hotspots.find((h) => h.id === open) ?? null;
  const stageProps = { lamp, dark, open, onOpen: openPanel, onLamp, onReady, onFail, apiRef: api };

  return (
    <div className={`scene ${lamp ? "lamp-on" : ""} ${menu ? "menu-open" : ""} ${open ? "panel-open" : ""}`}>
      {mode === "3d" && <Stage3D {...stageProps} />}
      {mode === "2d" && <Stage2D {...stageProps} />}

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
              onClick={toggleSound}
              aria-pressed={!muted}
              aria-label={muted ? "Turn the music on" : "Turn the music off"}
            >
              {muted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
            </button>
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
        <button type="button" className="scene-btn" onClick={() => api.current?.zoomBy(1 / 1.35)} aria-label="Zoom out"><Minus className="h-4 w-4" /></button>
        <button type="button" className="scene-btn scene-fit" onClick={() => api.current?.fit()}>Fit</button>
        <button type="button" className="scene-btn" onClick={() => api.current?.zoomBy(1.35)} aria-label="Zoom in"><Plus className="h-4 w-4" /></button>
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

      {intro && <SceneIntro onDone={finishIntro} ready={stageReady} />}
    </div>
  );
}
