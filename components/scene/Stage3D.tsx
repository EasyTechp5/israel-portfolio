"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { hotspots, type SceneId } from "@/lib/scene";
import type { StageProps } from "./stage";

/**
 * The live 3D room. Everything is built from code (boxes, cylinders, canvas
 * textures), so there are no model files to download: just this module and
 * three.js. Real lighting and soft shadows from the window, a lamp that lights
 * the desk, a laptop that runs a tiny workflow, and a wall clock showing the
 * actual time in Lagos.
 *
 * World units are metres. The room is open at the front (a cutaway) and the
 * camera orbits within limits, so the desk is always in view.
 */

type Anchor = [number, number, number];
const ANCHORS: Record<SceneId | "lamp", Anchor> = {
  work: [0.2, 0.93, -1.86],
  call: [0.2, 1.74, -2.36],
  about: [-0.75, 1.78, -2.36],
  services: [1.25, 1.78, -2.36],
  record: [2.02, 1.5, -2.36],
  writing: [2.72, 1.2, -2.0],
  resume: [1.9, 0.5, -1.72],
  contact: [0.95, 0.88, -1.7],
  lamp: [-0.05, 1.2, -2.0],
};
const FOCUS: Record<SceneId, number> = { work: 1.5, call: 1.7, about: 1.8, services: 2.2, record: 1.6, writing: 2.5, resume: 1.9, contact: 1.4 };

const HOME_TARGET = new THREE.Vector3(0.35, 1.34, -1.8);

/* ── small helpers ── */
function rand(seed: number) {
  // mulberry32: a tiny seeded random so the bookshelf is the same every visit
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type CanvasTex = { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture; draw: () => void };

export default function Stage3D({ lamp, dark, open, onOpen, onLamp, onReady, onFail, apiRef }: StageProps) {
  const host = useRef<HTMLDivElement>(null);
  const dotsHost = useRef<HTMLDivElement>(null);
  const live = useRef<{
    setDark: (d: boolean) => void;
    setLamp: (l: boolean) => void;
    focus: (id: SceneId | null) => void;
  } | null>(null);

  // Latest props for use inside the long-lived scene closure.
  const initial = useRef({ lamp, dark, open });

  useEffect(() => {
    const container = host.current;
    const dots = dotsHost.current;
    if (!container || !dots) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      onFail?.();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const canvas = renderer.domElement;
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;";
    container.appendChild(canvas);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);

    // Soft reflected light so materials look real, without any image files.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const disposables: { dispose: () => void }[] = [pmrem, envTex];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };
    const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    /* ── fonts for the textures drawn on walls and screens ── */
    const css = getComputedStyle(document.documentElement);
    const serif = css.getPropertyValue("--font-newsreader").trim() || "Georgia, serif";
    const mono = css.getPropertyValue("--font-plex-mono").trim() || "monospace";

    const texList: CanvasTex[] = [];
    const makeCanvas = (w: number, h: number, paint: (c: CanvasRenderingContext2D, w: number, h: number) => void): CanvasTex => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d")!;
      const tex = track(new THREE.CanvasTexture(c));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        paint(ctx, w, h);
        tex.needsUpdate = true;
      };
      const t = { canvas: c, ctx, tex, draw };
      draw();
      texList.push(t);
      return t;
    };

    const mat = (color: number, rough = 0.7, metal = 0): THREE.MeshStandardMaterial =>
      track(new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));
    const mesh = (g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0, shadow = true) => {
      track(g);
      const o = new THREE.Mesh(g, m);
      o.position.set(x, y, z);
      o.castShadow = shadow;
      o.receiveShadow = true;
      return o;
    };
    const box = (w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0, r = 0) =>
      mesh(r > 0 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d), m, x, y, z);

    /* ── palette ── */
    const BLUE = 0x0f52d2;
    const NAVY = 0x0a2d73;
    const CREAM = 0xf6efdc;
    const OAK = 0xd7ae72;
    const INK = 0x14161b;
    const RED = 0xd7262e;
    const WHITE = 0xf8f6f0;
    const leafMatShared = new THREE.MeshStandardMaterial({ color: 0x2fa86a, roughness: 0.6 });

    /* ───────── Room shell ───────── */
    const room = new THREE.Group();
    scene.add(room);

    // floor: procedural oak planks
    const planks = makeCanvas(1024, 1024, (c, w, h) => {
      const r = rand(7);
      c.fillStyle = "#d2a868";
      c.fillRect(0, 0, w, h);
      const rows = 32;
      for (let i = 0; i < rows; i++) {
        const y = (i * h) / rows;
        const tone = 190 + Math.floor(r() * 36);
        c.fillStyle = `rgb(${tone}, ${tone - 38}, ${tone - 92})`;
        c.fillRect(0, y, w, h / rows);
        let x = r() * 200;
        while (x < w) {
          c.fillStyle = "rgba(90,60,25,0.22)";
          c.fillRect(x, y, 2, h / rows);
          x += 260 + r() * 260;
        }
        c.fillStyle = "rgba(90,60,25,0.28)";
        c.fillRect(0, y, w, 1.5);
      }
    });
    planks.tex.wrapS = planks.tex.wrapT = THREE.RepeatWrapping;
    const floor = mesh(new THREE.PlaneGeometry(6.4, 4.8), track(new THREE.MeshPhysicalMaterial({ map: planks.tex, roughness: 0.55, clearcoat: 0.28, clearcoatRoughness: 0.4 })), 0, 0, 0, false);
    floor.rotation.x = -Math.PI / 2;
    room.add(floor);

    // subtle paint mottling so the blue reads as a painted wall, not a flat colour
    const paint = makeCanvas(512, 512, (c, w, h) => {
      c.fillStyle = "#fff";
      c.fillRect(0, 0, w, h);
      const r = rand(21);
      for (let i = 0; i < 2600; i++) {
        c.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,30,110"},${0.008 + r() * 0.016})`;
        const s = 6 + r() * 38;
        c.fillRect(r() * w, r() * h, s, s);
      }
    });
    const wallMat = track(new THREE.MeshStandardMaterial({ color: BLUE, map: paint.tex, roughness: 0.9 }));
    const trimMat = mat(WHITE, 0.5);

    // back wall with a window opening
    const WALL_Z = -2.5;
    const T = 0.2;
    room.add(box(0.63, 2.9, T, wallMat, -2.885, 1.45, WALL_Z));
    room.add(box(4.87, 2.9, T, wallMat, 0.765, 1.45, WALL_Z));
    room.add(box(0.9, 1.05, T, wallMat, -2.12, 0.525, WALL_Z));
    room.add(box(0.9, 0.65, T, wallMat, -2.12, 2.575, WALL_Z));
    // walls keep going up so a tall phone view never sees past the room
    room.add(box(6.4, 6, T, wallMat, 0, 5.9, WALL_Z));

    // side walls
    const sideL = mesh(new THREE.PlaneGeometry(4.8, 8.9), wallMat, -3.2, 4.45, 0, false);
    sideL.rotation.y = Math.PI / 2;
    const sideR = mesh(new THREE.PlaneGeometry(4.8, 8.9), wallMat, 3.2, 4.45, 0, false);
    sideR.rotation.y = -Math.PI / 2;
    room.add(sideL, sideR);

    // skirting and picture rail
    room.add(box(6.4, 0.12, 0.03, trimMat, 0, 0.06, -2.385));
    room.add(box(0.03, 0.12, 4.8, trimMat, -3.185, 0.06, 0));
    room.add(box(0.03, 0.12, 4.8, trimMat, 3.185, 0.06, 0));

    // white shaker panelling along the lower wall, with a rail on top
    const panelTex = makeCanvas(2048, 256, (c, w, h) => {
      c.fillStyle = "#faf8f3";
      c.fillRect(0, 0, w, h);
      const n = 10;
      const pw = w / n;
      for (let i = 0; i < n; i++) {
        const x = i * pw + 26;
        c.strokeStyle = "rgba(60,50,30,0.28)";
        c.lineWidth = 5;
        c.strokeRect(x, 40, pw - 52, h - 90);
        c.strokeStyle = "rgba(255,255,255,0.9)";
        c.lineWidth = 3;
        c.strokeRect(x + 5, 45, pw - 62, h - 100);
      }
    });
    const panelMat = track(new THREE.MeshStandardMaterial({ map: panelTex.tex, roughness: 0.55 }));
    const wainBack = new THREE.Mesh(track(new THREE.PlaneGeometry(6.4, 0.9)), panelMat);
    wainBack.position.set(0, 0.45, -2.388);
    wainBack.receiveShadow = true;
    const wainL = new THREE.Mesh(track(new THREE.PlaneGeometry(4.8, 0.9)), panelMat);
    wainL.position.set(-3.188, 0.45, 0);
    wainL.rotation.y = Math.PI / 2;
    wainL.receiveShadow = true;
    const wainR = new THREE.Mesh(track(new THREE.PlaneGeometry(4.8, 0.9)), panelMat);
    wainR.position.set(3.188, 0.45, 0);
    wainR.rotation.y = -Math.PI / 2;
    wainR.receiveShadow = true;
    room.add(wainBack, wainL, wainR);
    room.add(box(6.4, 0.035, 0.05, trimMat, 0, 0.905, -2.375));
    room.add(box(0.05, 0.035, 4.8, trimMat, -3.175, 0.905, 0));
    room.add(box(0.05, 0.035, 4.8, trimMat, 3.175, 0.905, 0));

    // window frame, mullions and sill
    room.add(box(0.05, 1.2, 0.06, trimMat, -2.57, 1.65, -2.4));
    room.add(box(0.05, 1.2, 0.06, trimMat, -1.67, 1.65, -2.4));
    room.add(box(0.95, 0.05, 0.06, trimMat, -2.12, 2.25, -2.4));
    room.add(box(0.95, 0.05, 0.06, trimMat, -2.12, 1.05, -2.4));
    room.add(box(0.035, 1.2, 0.04, trimMat, -2.12, 1.65, -2.4));
    room.add(box(0.9, 0.035, 0.04, trimMat, -2.12, 1.65, -2.4));
    room.add(box(1.1, 0.05, 0.2, trimMat, -2.12, 1.03, -2.33));

    // what you see through the window: three layers (sky, skyline over the lagoon, palms)
    // that shift against each other as you orbit, and change for night
    const night = () => initial.current.dark;
    const skyTex = makeCanvas(1536, 1100, (c, w, h) => {
      const dk = night();
      const g = c.createLinearGradient(0, 0, 0, h);
      if (dk) {
        g.addColorStop(0, "#020716");
        g.addColorStop(0.6, "#0a2260");
        g.addColorStop(1, "#1a4aa8");
      } else {
        g.addColorStop(0, "#3d8bf0");
        g.addColorStop(0.55, "#8fc2ff");
        g.addColorStop(1, "#e4f1ff");
      }
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      const r = rand(3);
      if (dk) {
        for (let i = 0; i < 220; i++) {
          c.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.7})`;
          const sz = r() > 0.92 ? 3 : 2;
          c.fillRect(r() * w, r() * h * 0.62, sz, sz);
        }
        const mg = c.createRadialGradient(1100, 260, 10, 1100, 260, 220);
        mg.addColorStop(0, "rgba(255,250,225,0.95)");
        mg.addColorStop(0.18, "rgba(255,246,210,0.6)");
        mg.addColorStop(1, "rgba(255,246,210,0)");
        c.fillStyle = mg;
        c.fillRect(800, 0, 600, 560);
        c.fillStyle = "#fdf6d8";
        c.beginPath();
        c.arc(1100, 260, 46, 0, Math.PI * 2);
        c.fill();
      } else {
        const sg = c.createRadialGradient(1180, 300, 10, 1180, 300, 420);
        sg.addColorStop(0, "rgba(255,250,225,1)");
        sg.addColorStop(0.15, "rgba(255,240,190,0.7)");
        sg.addColorStop(1, "rgba(255,240,190,0)");
        c.fillStyle = sg;
        c.fillRect(600, 0, 936, 760);
        c.save();
        c.filter = "blur(10px)";
        for (let i = 0; i < 16; i++) {
          const cx = r() * w;
          const cy = 120 + r() * 460;
          const n = 4 + Math.floor(r() * 4);
          for (let k = 0; k < n; k++) {
            c.fillStyle = `rgba(255,255,255,${0.55 + r() * 0.35})`;
            c.beginPath();
            c.ellipse(cx + k * 46 - n * 20, cy + Math.sin(k) * 10, 60 + r() * 40, 24 + r() * 14, 0, 0, Math.PI * 2);
            c.fill();
          }
        }
        c.restore();
      }
    });
    const cityTex = makeCanvas(2048, 1126, (c, w, h) => {
      const dk = night();
      const r = rand(31);
      const horizon = 790;
      // far hills
      c.fillStyle = dk ? "#0b2a6e" : "#a9c8f2";
      c.beginPath();
      c.moveTo(0, horizon);
      c.bezierCurveTo(300, horizon - 90, 600, horizon - 30, 900, horizon - 70);
      c.bezierCurveTo(1300, horizon - 120, 1600, horizon - 40, 2048, horizon - 80);
      c.lineTo(2048, horizon);
      c.fill();
      // skyline in three depth layers, paler the further away
      const layers = dk
        ? [{ col: "#0a2766", n: 34, hmin: 90, hmax: 280, base: horizon - 6 }, { col: "#081c4d", n: 26, hmin: 120, hmax: 380, base: horizon }, { col: "#050f30", n: 18, hmin: 160, hmax: 480, base: horizon + 4 }]
        : [{ col: "#8cb4ee", n: 34, hmin: 90, hmax: 280, base: horizon - 6 }, { col: "#6b9fe6", n: 26, hmin: 120, hmax: 380, base: horizon }, { col: "#4a82d8", n: 18, hmin: 160, hmax: 480, base: horizon + 4 }];
      layers.forEach((L, li) => {
        let x = -20;
        while (x < w) {
          const bw = 38 + r() * 80;
          const bh = L.hmin + r() * (L.hmax - L.hmin);
          c.fillStyle = L.col;
          c.fillRect(x, L.base - bh, bw, bh);
          // window grid
          for (let wy = L.base - bh + 14; wy < L.base - 10; wy += 20) {
            for (let wx = x + 8; wx < x + bw - 8; wx += 14) {
              if (dk) {
                if (r() > 0.55) {
                  c.fillStyle = r() > 0.8 ? "rgba(255,255,255,0.9)" : "rgba(255,214,120,0.9)";
                  c.fillRect(wx, wy, 6, 8);
                }
              } else if (r() > 0.5) {
                c.fillStyle = "rgba(255,255,255,0.28)";
                c.fillRect(wx, wy, 6, 8);
              }
            }
          }
          x += bw + 4 + r() * 10;
        }
        void li;
      });
      // a tall tower with a red aircraft light
      const tx = 1150;
      c.fillStyle = dk ? "#061640" : "#3c73cf";
      c.fillRect(tx, horizon - 620, 96, 620);
      c.fillRect(tx + 30, horizon - 760, 36, 140);
      c.fillRect(tx + 46, horizon - 860, 4, 100);
      c.fillStyle = "rgba(255,255,255,0.25)";
      c.fillRect(tx + 8, horizon - 620, 10, 620);
      c.fillStyle = "#ff2a35";
      c.beginPath();
      c.arc(tx + 48, horizon - 866, dk ? 9 : 6, 0, Math.PI * 2);
      c.fill();
      if (dk) {
        const rg = c.createRadialGradient(tx + 48, horizon - 866, 2, tx + 48, horizon - 866, 60);
        rg.addColorStop(0, "rgba(255,60,70,0.8)");
        rg.addColorStop(1, "rgba(255,60,70,0)");
        c.fillStyle = rg;
        c.fillRect(tx - 20, horizon - 930, 130, 130);
        for (let wy = horizon - 600; wy < horizon - 10; wy += 24) {
          for (let wx = tx + 22; wx < tx + 86; wx += 16) {
            if (r() > 0.4) {
              c.fillStyle = "rgba(255,214,120,0.95)";
              c.fillRect(wx, wy, 8, 10);
            }
          }
        }
      }
      // lagoon with glints
      const wg = c.createLinearGradient(0, horizon, 0, h);
      wg.addColorStop(0, dk ? "#0a2a70" : "#5fa0ee");
      wg.addColorStop(1, dk ? "#04123a" : "#2f74d8");
      c.fillStyle = wg;
      c.fillRect(0, horizon, w, h - horizon);
      for (let i = 0; i < 160; i++) {
        c.fillStyle = dk ? `rgba(255,224,150,${0.1 + r() * 0.35})` : `rgba(255,255,255,${0.15 + r() * 0.4})`;
        c.fillRect(r() * w, horizon + 12 + r() * (h - horizon - 20), 20 + r() * 80, 2);
      }
      // haze at the horizon so the skyline melts into the sky
      const hz = c.createLinearGradient(0, horizon - 200, 0, horizon + 20);
      hz.addColorStop(0, dk ? "rgba(26,74,168,0)" : "rgba(228,241,255,0)");
      hz.addColorStop(1, dk ? "rgba(26,74,168,0.55)" : "rgba(228,241,255,0.65)");
      c.fillStyle = hz;
      c.fillRect(0, horizon - 200, w, 220);
    });
    const palmTex = makeCanvas(1536, 1024, (c, w, h) => {
      const dk = night();
      const leaf = dk ? "#04241c" : "#1c7a55";
      const leaf2 = dk ? "#06322a" : "#2aa072";
      const palm = (bx: number, by: number, lean: number, size: number, seed: number) => {
        const r = rand(seed);
        const tx = bx + lean * size * 0.55;
        const ty = by - size;
        c.strokeStyle = dk ? "#0a1f1a" : "#6b5a3e";
        c.lineWidth = 16 * (size / 520);
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(bx, by);
        c.quadraticCurveTo(bx + lean * size * 0.1, by - size * 0.55, tx, ty);
        c.stroke();
        for (let i = 0; i < 11; i++) {
          const ang = -Math.PI * 0.95 + (i / 10) * Math.PI * 0.9 + (r() - 0.5) * 0.2;
          const len = size * (0.42 + r() * 0.18);
          const ex = tx + Math.cos(ang) * len;
          const ey = ty + Math.sin(ang) * len * 0.8 + len * 0.45;
          const mx = tx + Math.cos(ang) * len * 0.55;
          const my = ty + Math.sin(ang) * len * 0.8 - len * 0.1;
          c.strokeStyle = i % 2 ? leaf : leaf2;
          c.lineWidth = 4;
          c.beginPath();
          c.moveTo(tx, ty);
          c.quadraticCurveTo(mx, my, ex, ey);
          c.stroke();
          for (let k = 1; k < 18; k++) {
            const t = k / 18;
            const qx = (1 - t) * (1 - t) * tx + 2 * (1 - t) * t * mx + t * t * ex;
            const qy = (1 - t) * (1 - t) * ty + 2 * (1 - t) * t * my + t * t * ey;
            const nx = -(ey - ty);
            const ny = ex - tx;
            const nl = Math.hypot(nx, ny) || 1;
            const ll = (1 - t * 0.7) * size * 0.1;
            c.lineWidth = 3;
            c.beginPath();
            c.moveTo(qx, qy);
            c.lineTo(qx + (nx / nl) * ll, qy + (ny / nl) * ll + ll * 0.5);
            c.moveTo(qx, qy);
            c.lineTo(qx - (nx / nl) * ll, qy - (ny / nl) * ll + ll * 0.5);
            c.stroke();
          }
        }
      };
      palm(610, h + 40, -0.45, 520, 5);
      palm(930, h + 40, 0.4, 380, 9);
    });
    const winLayers = [skyTex, cityTex, palmTex];
    const skyPlane = new THREE.Mesh(track(new THREE.PlaneGeometry(7, 5.1)), track(new THREE.MeshBasicMaterial({ map: skyTex.tex, toneMapped: false })));
    skyPlane.position.set(-2.12, 1.55, -4.6);
    const cityPlane = new THREE.Mesh(track(new THREE.PlaneGeometry(4.6, 2.53)), track(new THREE.MeshBasicMaterial({ map: cityTex.tex, transparent: true, toneMapped: false })));
    cityPlane.position.set(-2.12, 1.83, -3.3);
    const palmPlane = new THREE.Mesh(track(new THREE.PlaneGeometry(3.0, 2.0)), track(new THREE.MeshBasicMaterial({ map: palmTex.tex, transparent: true, toneMapped: false })));
    palmPlane.position.set(-2.12, 1.5, -2.8);
    scene.add(cityPlane, palmPlane);
    const sky = { draw: () => winLayers.forEach((l) => l.draw()) };
    // glass: a faint diagonal reflection, plus a deep white casing and a sill with things on it
    {
      const streak = makeCanvas(128, 128, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, w, h);
        g.addColorStop(0.2, "rgba(255,255,255,0)");
        g.addColorStop(0.32, "rgba(255,255,255,0.55)");
        g.addColorStop(0.4, "rgba(255,255,255,0)");
        g.addColorStop(0.55, "rgba(255,255,255,0)");
        g.addColorStop(0.62, "rgba(255,255,255,0.3)");
        g.addColorStop(0.7, "rgba(255,255,255,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
      });
      const glass = new THREE.Mesh(track(new THREE.PlaneGeometry(0.9, 1.2)), track(new THREE.MeshBasicMaterial({ map: streak.tex, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
      glass.position.set(-2.12, 1.65, -2.45);
      glass.renderOrder = 3;
      room.add(glass);
      // reveals (the depth of the opening) and architrave on the room side
      room.add(box(0.9, 0.04, 0.2, trimMat, -2.12, 1.07, -2.5));
      room.add(box(0.9, 0.04, 0.2, trimMat, -2.12, 2.23, -2.5));
      room.add(box(0.04, 1.2, 0.2, trimMat, -2.55, 1.65, -2.5));
      room.add(box(0.04, 1.2, 0.2, trimMat, -1.69, 1.65, -2.5));
      room.add(box(1.08, 0.08, 0.035, trimMat, -2.12, 2.31, -2.372, 0.008));
      room.add(box(0.08, 1.36, 0.035, trimMat, -2.61, 1.65, -2.372, 0.008));
      room.add(box(0.08, 1.36, 0.035, trimMat, -1.63, 1.65, -2.372, 0.008));
      // things on the sill: a succulent in a red pot, a small black frame
      const pot = mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.05, 18), mat(RED, 0.5), -2.4, 1.055 + 0.025, -2.33);
      room.add(pot);
      for (let i = 0; i < 7; i++) {
        const lf = new THREE.Mesh(track(new THREE.SphereGeometry(0.5, 10, 8)), leafMatShared);
        lf.scale.set(0.02, 0.07, 0.012);
        const ang = (i / 7) * Math.PI * 2;
        lf.position.set(-2.4 + Math.cos(ang) * 0.018, 1.135, -2.33 + Math.sin(ang) * 0.018);
        lf.rotation.z = Math.cos(ang) * 0.5;
        lf.rotation.x = Math.sin(ang) * 0.5;
        lf.castShadow = true;
        room.add(lf);
      }
      room.add(box(0.12, 0.15, 0.012, mat(INK, 0.35), -1.88, 1.1, -2.31, 0.004));
      room.add(box(0.1, 0.13, 0.006, mat(WHITE, 0.8), -1.88, 1.1, -2.303));
    }

    // curtains: white linen on a black rod, held back with red ties
    const linen = makeCanvas(256, 512, (c, w, h) => {
      for (let x = 0; x < w; x += 8) {
        const k = 0.5 + 0.5 * Math.sin((x / w) * Math.PI * 8);
        c.fillStyle = `rgb(${236 + k * 16},${238 + k * 14},${244 + k * 10})`;
        c.fillRect(x, 0, 8, h);
      }
    });
    const linenMat = track(new THREE.MeshStandardMaterial({ map: linen.tex, roughness: 0.95 }));
    {
      const rod = mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.5, 12), mat(INK, 0.35, 0.6), -2.12, 2.45, -2.27);
      rod.rotation.z = Math.PI / 2;
      room.add(rod);
      room.add(mesh(new THREE.SphereGeometry(0.03, 12, 10), mat(RED, 0.4), -2.87, 2.45, -2.27));
      room.add(mesh(new THREE.SphereGeometry(0.03, 12, 10), mat(RED, 0.4), -1.37, 2.45, -2.27));
      [[-2.72, 0.26], [-1.52, 0.26]].forEach(([x, w]) => {
        const cur = box(w, 1.9, 0.07, linenMat, x, 1.48, -2.27);
        room.add(cur);
        room.add(box(w + 0.015, 0.045, 0.085, mat(RED, 0.6), x, 1.2, -2.27));
      });
    }

    // rug
    const rug = makeCanvas(1024, 700, (c, w, h) => {
      c.fillStyle = "#f6efdc";
      rr(c, 6, 6, w - 12, h - 12, 60);
      c.fill();
      c.strokeStyle = "#1763e8";
      c.lineWidth = 26;
      rr(c, 26, 26, w - 52, h - 52, 48);
      c.stroke();
      c.strokeStyle = "#d7262e";
      c.lineWidth = 7;
      rr(c, 74, 74, w - 148, h - 148, 30);
      c.stroke();
      c.strokeStyle = "#14161b";
      c.lineWidth = 3;
      rr(c, 96, 96, w - 192, h - 192, 22);
      c.stroke();
    });
    const rugMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(2.8, 1.9)), track(new THREE.MeshStandardMaterial({ map: rug.tex, transparent: true, roughness: 1 })));
    rugMesh.rotation.x = -Math.PI / 2;
    rugMesh.position.set(0.25, 0.006, -1.05);
    rugMesh.receiveShadow = true;
    room.add(rugMesh);

    /* ───────── Wall decor ───────── */
    const DECOR_Z = -2.385;
    const frameMat = mat(0xf1e4c4, 0.5);
    const goldMat = mat(0xe8c872, 0.4, 0.3);
    const flat = (w: number, h: number, tex: THREE.Texture, x: number, y: number, z: number, rotZ = 0, shadow = false) => {
      const m = new THREE.Mesh(track(new THREE.PlaneGeometry(w, h)), track(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })));
      m.position.set(x, y, z);
      m.rotation.z = rotZ;
      m.receiveShadow = true;
      m.castShadow = shadow;
      return m;
    };

    // portrait (About): black frame, brass inner line, white mat, name plate and a picture light
    {
      const g = new THREE.Group();
      const brass = mat(0xe2b95a, 0.28, 0.9);
      g.add(box(0.72, 0.9, 0.05, mat(INK, 0.3, 0.2), 0, 0, 0, 0.012));
      g.add(box(0.64, 0.82, 0.02, brass, 0, 0, 0.026, 0.004));
      g.add(box(0.62, 0.8, 0.02, mat(INK, 0.35), 0, 0, 0.03, 0.004));
      g.add(box(0.58, 0.76, 0.012, mat(0xfffdf6, 0.9), 0, 0, 0.038));
      const photoTex = track(new THREE.TextureLoader().load("/images/israel-logo.jpg"));
      photoTex.colorSpace = THREE.SRGBColorSpace;
      photoTex.anisotropy = maxAniso;
      g.add(flat(0.46, 0.46, photoTex, 0, 0.09, 0.046));
      g.add(box(0.47, 0.012, 0.004, mat(INK, 0.5), 0, -0.145, 0.047));
      const plate = makeCanvas(512, 128, (c, w, h) => {
        const gr = c.createLinearGradient(0, 0, w, h);
        gr.addColorStop(0, "#f1d98d");
        gr.addColorStop(0.5, "#cfa13f");
        gr.addColorStop(1, "#e8c874");
        c.fillStyle = gr;
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#3b2a08";
        c.textAlign = "center";
        c.font = `500 44px ${serif}`;
        c.fillText("ISRAEL AFOLABI", w / 2, 62);
        c.font = `500 24px ${mono}`;
        c.fillText("AI ENGINEER · LAGOS", w / 2, 100);
      });
      g.add(flat(0.3, 0.075, plate.tex, 0, -0.27, 0.046));
      // glass reflection
      const gl = makeCanvas(128, 128, (c, w, h) => {
        const gr = c.createLinearGradient(0, 0, w, h);
        gr.addColorStop(0.25, "rgba(255,255,255,0)");
        gr.addColorStop(0.38, "rgba(255,255,255,0.5)");
        gr.addColorStop(0.46, "rgba(255,255,255,0)");
        c.fillStyle = gr;
        c.fillRect(0, 0, w, h);
      });
      const glass2 = new THREE.Mesh(track(new THREE.PlaneGeometry(0.58, 0.76)), track(new THREE.MeshBasicMaterial({ map: gl.tex, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
      glass2.position.z = 0.05;
      glass2.renderOrder = 3;
      g.add(glass2);
      // picture light on a short arm
      g.add(box(0.012, 0.012, 0.09, mat(INK, 0.35, 0.5), 0, 0.5, 0.05));
      g.add(box(0.32, 0.024, 0.045, mat(INK, 0.35, 0.5), 0, 0.51, 0.095, 0.01));
      g.add(box(0.28, 0.006, 0.02, track(new THREE.MeshStandardMaterial({ color: 0xffe7b0, emissive: 0xffd58a, emissiveIntensity: 2 })), 0, 0.497, 0.1));
      const pl = new THREE.PointLight(0xffe0a8, 0.55, 1.4, 1.8);
      pl.position.set(0, 0.45, 0.2);
      g.add(pl);
      g.position.set(-0.75, 1.76, DECOR_Z + 0.025);
      room.add(g);
    }

    // calendar (Book a call)
    {
      const cal = makeCanvas(512, 640, (c, w, h) => {
        c.fillStyle = "#fffdf7";
        rr(c, 0, 0, w, h, 28);
        c.fill();
        c.fillStyle = "#0055da";
        c.beginPath();
        c.moveTo(0, 150);
        c.lineTo(0, 28);
        c.arcTo(0, 0, 28, 0, 28);
        c.lineTo(w - 28, 0);
        c.arcTo(w, 0, w, 28, 28);
        c.lineTo(w, 150);
        c.fill();
        c.fillStyle = "#f6efdc";
        [140, w - 140].forEach((x) => {
          c.beginPath();
          c.arc(x, 18, 16, 0, Math.PI * 2);
          c.fill();
        });
        c.fillStyle = "#fff";
        c.textAlign = "center";
        c.font = `500 44px ${mono}`;
        c.fillText("FREE CALL", w / 2, 106);
        c.fillStyle = "#14161b";
        c.font = `500 250px ${serif}`;
        c.fillText("20", w / 2, 440);
        c.strokeStyle = "#e24d4d";
        c.lineWidth = 10;
        c.setLineDash([22, 16]);
        c.beginPath();
        c.arc(w / 2, 340, 150, 0, Math.PI * 2);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = "#5f636b";
        c.font = `500 40px ${mono}`;
        c.fillText("MINUTES", w / 2, 556);
      });
      const g = new THREE.Group();
      g.add(box(0.44, 0.54, 0.02, mat(0xffffff, 0.8), 0, 0, 0, 0.012));
      g.add(flat(0.42, 0.525, cal.tex, 0, 0, 0.011));
      g.position.set(0.2, 1.74, DECOR_Z + 0.012);
      room.add(g);
    }

    // whiteboard (Services): a packet runs along the workflow
    const board = makeCanvas(1024, 640, (c, w, h) => {
      c.fillStyle = "#fbfdff";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#0a47b0";
      c.font = `italic 500 76px ${serif}`;
      c.fillText("Show your working.", 56, 118);
      c.strokeStyle = "rgba(243,220,114,0.95)";
      c.lineWidth = 16;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(60, 148);
      c.bezierCurveTo(300, 166, 560, 138, 760, 152);
      c.stroke();
      const labels = ["Discover", "Design", "Deploy", "Support"];
      labels.forEach((l, i) => {
        const x = 50 + i * 235;
        c.fillStyle = "#e9f0ff";
        rr(c, x, 270, 190, 110, 22);
        c.fill();
        c.strokeStyle = "#0055da";
        c.lineWidth = 5;
        rr(c, x, 270, 190, 110, 22);
        c.stroke();
        c.fillStyle = "#0a47b0";
        c.font = `500 38px ${mono}`;
        c.textAlign = "center";
        c.fillText(l, x + 95, 336);
        c.textAlign = "left";
        if (i < 3) {
          c.strokeStyle = "#0055da";
          c.lineWidth = 5;
          c.beginPath();
          c.moveTo(x + 190, 325);
          c.lineTo(x + 235, 325);
          c.stroke();
        }
      });
      c.fillStyle = "#5f636b";
      c.font = `500 34px ${mono}`;
      c.fillText("PROBLEM → METHOD → ANSWER", 56, 520);
      // moving packet
      const t = (performance.now() % 3600) / 3600;
      const px = 60 + t * 800;
      c.fillStyle = "#0055da";
      c.beginPath();
      c.arc(px, 325, 13, 0, Math.PI * 2);
      c.fill();
    });
    {
      const g = new THREE.Group();
      g.add(box(1.16, 0.74, 0.04, mat(INK, 0.35), 0, 0, 0, 0.012));
      g.add(flat(1.08, 0.675, board.tex, 0, 0.005, 0.021));
      g.add(box(1.0, 0.03, 0.06, mat(0xe6dcc2, 0.6), 0, -0.375, 0.04));
      g.position.set(1.25, 1.78, DECOR_Z + 0.02);
      room.add(g);
    }

    // sticky notes (Track record)
    const sticky = (text: string, sub: string, color: string, ink: string, x: number, y: number, rot: number) => {
      const t = makeCanvas(256, 256, (c, w, h) => {
        c.fillStyle = color;
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#14161b";
        c.textAlign = "center";
        c.font = `500 84px ${serif}`;
        c.fillText(text, w / 2, 140);
        c.fillStyle = ink;
        c.font = `500 28px ${mono}`;
        c.fillText(sub, w / 2, 196);
      });
      room.add(flat(0.17, 0.17, t.tex, x, y, DECOR_Z + 0.014, rot));
    };
    sticky("1,500+", "TRAINED", "#f3dc72", "#5a4a10", 1.93, 1.42, 0.1);
    sticky("10+", "ORGS", "#ffb3c4", "#6a2a3a", 2.12, 1.55, -0.08);
    sticky("3+", "YEARS", "#a8e6ff", "#1b4a63", 2.01, 1.66, 0.05);

    // clock (live Lagos time): black case, glass, numerals, a red second hand
    const clockFace = makeCanvas(1024, 1024, (c, w, h) => {
      const R = w / 2;
      c.fillStyle = "#fbf9f3";
      c.beginPath();
      c.arc(R, R, R, 0, Math.PI * 2);
      c.fill();
      const dg = c.createRadialGradient(R, R * 0.8, R * 0.1, R, R, R);
      dg.addColorStop(0, "rgba(255,255,255,0.6)");
      dg.addColorStop(1, "rgba(120,110,90,0.18)");
      c.fillStyle = dg;
      c.beginPath();
      c.arc(R, R, R, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#d7262e";
      c.lineWidth = 6;
      c.beginPath();
      c.arc(R, R, R - 120, 0, Math.PI * 2);
      c.stroke();
      for (let i = 0; i < 60; i++) {
        const a = (i * Math.PI) / 30;
        const hr = i % 5 === 0;
        c.strokeStyle = "#14161b";
        c.lineWidth = hr ? 10 : 3.5;
        const r1 = R - 26;
        const r2 = R - (hr ? 78 : 52);
        c.beginPath();
        c.moveTo(R + Math.sin(a) * r1, R - Math.cos(a) * r1);
        c.lineTo(R + Math.sin(a) * r2, R - Math.cos(a) * r2);
        c.stroke();
      }
      c.fillStyle = "#14161b";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = `500 96px ${serif}`;
      for (let n = 1; n <= 12; n++) {
        const a = (n * Math.PI) / 6;
        const rr2 = R - 170;
        c.fillText(String(n), R + Math.sin(a) * rr2, R - Math.cos(a) * rr2 + 6);
      }
      c.fillStyle = "#5f636b";
      c.font = `500 34px ${mono}`;
      c.fillText("LAGOS", R, R + 190);
      c.fillStyle = "#0055da";
      c.fillRect(R - 28, R + 214, 56, 5);
      c.textBaseline = "alphabetic";
    });
    const clockG = new THREE.Group();
    clockG.position.set(2.15, 2.28, DECOR_Z);
    {
      const caseM = mat(0x14161b, 0.35, 0.5);
      const caseMesh = mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.05, 48), caseM, 0, 0, 0.025);
      caseMesh.rotation.x = Math.PI / 2;
      clockG.add(caseMesh);
      const bezel = new THREE.Mesh(track(new THREE.TorusGeometry(0.215, 0.016, 16, 64)), mat(0x2a2d35, 0.25, 0.85));
      bezel.position.z = 0.052;
      bezel.castShadow = true;
      clockG.add(bezel);
      const dial = new THREE.Mesh(track(new THREE.CircleGeometry(0.205, 64)), track(new THREE.MeshStandardMaterial({ map: clockFace.tex, roughness: 0.7 })));
      dial.position.z = 0.0515;
      clockG.add(dial);
      const glassC = new THREE.Mesh(track(new THREE.CircleGeometry(0.205, 48)), track(new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0.02, clearcoat: 1, envMapIntensity: 2, depthWrite: false })));
      glassC.position.z = 0.072;
      glassC.renderOrder = 3;
      clockG.add(glassC);
    }
    const hand = (len: number, wd: number, color: number, tail: number) => {
      const p = new THREE.Group();
      const m = mat(color, 0.35, 0.3);
      const blade = new THREE.Mesh(track(new THREE.BoxGeometry(wd, len + tail, 0.004)), m);
      blade.position.y = (len - tail) / 2;
      blade.castShadow = true;
      p.add(blade);
      if (wd > 0.006) {
        const leaf = new THREE.Mesh(track(new THREE.BoxGeometry(wd * 2.2, len * 0.42, 0.004)), m);
        leaf.position.y = len * 0.62;
        p.add(leaf);
      }
      return p;
    };
    const hourH = hand(0.1, 0.012, INK, 0.02);
    const minH = hand(0.15, 0.009, INK, 0.025);
    const secH = hand(0.175, 0.0035, RED, 0.045);
    [hourH, minH, secH].forEach((h, i) => {
      h.position.z = 0.056 + i * 0.004;
      clockG.add(h);
    });
    {
      const cap = new THREE.Mesh(track(new THREE.SphereGeometry(0.011, 14, 10)), mat(RED, 0.3, 0.4));
      cap.position.z = 0.068;
      clockG.add(cap);
    }
    room.add(clockG);

    /* ───────── Desk and the things on it ───────── */
    const deskMat = mat(OAK, 0.55);
    const legMat = mat(NAVY, 0.5);
    const DESK_Y = 0.75;
    room.add(box(1.9, 0.045, 0.8, deskMat, 0.2, DESK_Y, -1.82, 0.012));
    [[-0.72, -2.14], [1.12, -2.14], [-0.72, -1.5], [1.12, -1.5]].forEach(([x, z]) => room.add(box(0.05, 0.73, 0.05, legMat, x, 0.365, z)));
    room.add(box(1.8, 0.05, 0.04, legMat, 0.2, 0.62, -2.14));
    const TOP = DESK_Y + 0.0225;

    // MacBook-style laptop: silver aluminium, black bezel with a notch, a wallpaper, menu bar and dock
    const screen = makeCanvas(1280, 800, (c, w, h) => {
      const bg = c.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#0a2a8c");
      bg.addColorStop(0.55, "#1b5be6");
      bg.addColorStop(1, "#d7262e");
      c.fillStyle = bg;
      c.fillRect(0, 0, w, h);
      // soft wallpaper waves
      for (let i = 0; i < 5; i++) {
        c.fillStyle = `rgba(255,255,255,${0.05 + i * 0.02})`;
        c.beginPath();
        c.moveTo(0, h * (0.5 + i * 0.1));
        c.bezierCurveTo(w * 0.3, h * (0.3 + i * 0.1), w * 0.6, h * (0.85 + i * 0.05), w, h * (0.45 + i * 0.1));
        c.lineTo(w, h);
        c.lineTo(0, h);
        c.fill();
      }
      // menu bar
      c.fillStyle = "rgba(255,255,255,0.22)";
      c.fillRect(0, 0, w, 40);
      c.fillStyle = "#fff";
      c.beginPath();
      c.arc(30, 20, 8, 0, Math.PI * 2);
      c.fill();
      c.font = `600 22px ${mono}`;
      c.textAlign = "left";
      ["Finder", "File", "Edit", "View"].forEach((t, i) => c.fillText(t, 64 + i * 86, 28));
      c.textAlign = "right";
      const d = new Date(Date.now() + 3600000);
      c.fillText(`${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`, w - 24, 28);
      c.textAlign = "left";
      // a window running a workflow
      const wx = 250;
      const wy = 110;
      const ww = 780;
      const wh = 460;
      c.save();
      c.shadowColor = "rgba(0,0,0,0.4)";
      c.shadowBlur = 40;
      c.fillStyle = "rgba(250,251,255,0.96)";
      rr(c, wx, wy, ww, wh, 22);
      c.fill();
      c.restore();
      ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
        c.fillStyle = col;
        c.beginPath();
        c.arc(wx + 30 + i * 28, wy + 28, 9, 0, Math.PI * 2);
        c.fill();
      });
      c.fillStyle = "#14161b";
      c.font = `600 26px ${mono}`;
      c.fillText("Invoice follow-up · live", wx + 140, wy + 36);
      const labels = ["Trigger", "AI draft", "Send", "Paid"];
      labels.forEach((l, i) => {
        const x = wx + 50 + i * 180;
        c.fillStyle = i === 3 ? "#16a34a" : i === 1 ? "#d7262e" : "#0055da";
        rr(c, x, wy + 170, 140, 90, 18);
        c.fill();
        c.fillStyle = "#fff";
        c.font = `600 26px ${mono}`;
        c.textAlign = "center";
        c.fillText(l, x + 70, wy + 224);
        c.textAlign = "left";
        if (i < 3) {
          c.strokeStyle = "#9aa3b5";
          c.lineWidth = 5;
          c.beginPath();
          c.moveTo(x + 140, wy + 215);
          c.lineTo(x + 180, wy + 215);
          c.stroke();
        }
      });
      const t = (performance.now() % 2800) / 2800;
      c.fillStyle = "#14161b";
      c.beginPath();
      c.arc(wx + 70 + t * 540, wy + 215, 12, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#e7ebf3";
      rr(c, wx + 50, wy + 330, 420, 16, 8);
      c.fill();
      rr(c, wx + 50, wy + 366, 300, 14, 7);
      c.fill();
      // dock
      const icons = ["#0055da", "#ffffff", "#14161b", "#d7262e", "#2fbf71", "#f3dc72", "#9cc3ff"];
      const dw = icons.length * 86 + 28;
      c.fillStyle = "rgba(255,255,255,0.3)";
      rr(c, (w - dw) / 2, h - 108, dw, 88, 26);
      c.fill();
      icons.forEach((col, i) => {
        c.fillStyle = col;
        rr(c, (w - dw) / 2 + 18 + i * 86, h - 96, 66, 66, 16);
        c.fill();
      });
    });
    {
      const g = new THREE.Group();
      g.position.set(0.2, TOP, -1.78);
      const alu = track(new THREE.MeshStandardMaterial({ color: 0xc8ccd3, roughness: 0.32, metalness: 0.92 }));
      // base: thin unibody with a keyboard deck
      g.add(box(0.34, 0.011, 0.235, alu, 0, 0.0055, 0.02, 0.004));
      const deck = makeCanvas(640, 440, (c, w, h) => {
        c.fillStyle = "#c8ccd3";
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#16181d";
        const rows = [14, 14, 14, 13, 11];
        rows.forEach((n, ri) => {
          const kw = (w - 60) / n;
          for (let i = 0; i < n; i++) {
            rr(c, 30 + i * kw + 2, 24 + ri * 52, kw - 4, 44, 6);
            c.fill();
          }
        });
        c.fillStyle = "rgba(120,126,138,0.55)";
        rr(c, w / 2 - 110, 296, 220, 120, 10);
        c.fill();
        c.strokeStyle = "rgba(90,96,108,0.6)";
        c.lineWidth = 2;
        rr(c, w / 2 - 110, 296, 220, 120, 10);
        c.stroke();
      });
      const kb = new THREE.Mesh(track(new THREE.PlaneGeometry(0.32, 0.22)), track(new THREE.MeshStandardMaterial({ map: deck.tex, roughness: 0.4, metalness: 0.5 })));
      kb.rotation.x = -Math.PI / 2;
      kb.position.set(0, 0.0112, 0.02);
      g.add(kb);
      // lid, with a black bezel, notch and glowing display
      const lid = new THREE.Group();
      lid.position.set(0, 0.011, -0.095);
      lid.rotation.x = -0.3;
      lid.add(box(0.34, 0.226, 0.007, alu, 0, 0.113, 0, 0.004));
      lid.add(box(0.332, 0.218, 0.002, mat(0x0a0b0e, 0.3), 0, 0.113, 0.0042));
      const scr = new THREE.Mesh(track(new THREE.PlaneGeometry(0.316, 0.1975)), track(new THREE.MeshBasicMaterial({ map: screen.tex, toneMapped: false })));
      scr.position.set(0, 0.1155, 0.0055);
      lid.add(scr);
      const notch = box(0.034, 0.008, 0.0015, mat(0x0a0b0e, 0.3), 0, 0.2095, 0.0057);
      lid.add(notch);
      g.add(lid);
      room.add(g);
    }

    // phone (Contact)
    const phoneScr = makeCanvas(240, 440, (c, w, h) => {
      c.fillStyle = "#0d1f4d";
      c.fillRect(0, 0, w, h);
      const bubble = (x: number, y: number, bw: number, color: string) => {
        c.fillStyle = color;
        rr(c, x, y, bw, 56, 22);
        c.fill();
      };
      bubble(20, 80, 150, "#2fbf71");
      bubble(70, 160, 150, "#fffdf7");
      bubble(20, 240, 120, "#2fbf71");
      c.fillStyle = "#e24d4d";
      c.beginPath();
      c.arc(w - 26, 28, 10, 0, Math.PI * 2);
      c.fill();
    });
    {
      const g = new THREE.Group();
      g.position.set(0.95, TOP, -1.7);
      g.add(box(0.07, 0.03, 0.06, legMat, 0, 0.015, 0.02, 0.008));
      const body = new THREE.Group();
      body.position.set(0, 0.09, 0);
      body.rotation.x = -0.28;
      body.add(box(0.078, 0.155, 0.009, mat(INK, 0.35, 0.5), 0, 0, 0, 0.012));
      const ps = new THREE.Mesh(track(new THREE.PlaneGeometry(0.068, 0.135)), track(new THREE.MeshBasicMaterial({ map: phoneScr.tex, toneMapped: false })));
      ps.position.z = 0.0052;
      body.add(ps);
      g.add(body);
      room.add(g);
    }

    // mug with steam
    const steamTex = makeCanvas(64, 64, (c, w, h) => {
      const g = c.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
      g.addColorStop(0, "rgba(255,255,255,0.9)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    });
    const steam: { s: THREE.Sprite; phase: number }[] = [];
    let sidePlant: THREE.Group | null = null;
    let moteUpdate: ((t: number) => void) | null = null;
    {
      const g = new THREE.Group();
      g.position.set(1.04, TOP, -1.96);
      g.add(mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.09, 28), mat(0xfffdf7, 0.35), 0, 0.045, 0));
      g.add(mesh(new THREE.CylinderGeometry(0.0415, 0.0365, 0.022, 28), mat(RED, 0.4), 0, 0.05, 0));
      const h = mesh(new THREE.TorusGeometry(0.026, 0.0065, 10, 20, Math.PI * 1.15), mat(0xfffdf7, 0.35), 0.043, 0.048, 0);
      h.rotation.z = -Math.PI * 0.575;
      g.add(h);
      g.add(mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.002, 24), mat(0x3a2412, 0.3), 0, 0.085, 0, false));
      for (let i = 0; i < 6; i++) {
        const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: steamTex.tex, transparent: true, depthWrite: false, opacity: 0 })));
        sp.scale.set(0.05, 0.05, 1);
        g.add(sp);
        steam.push({ s: sp, phase: i / 6 });
      }
      room.add(g);
    }

    // notebook and pen
    {
      room.add(box(0.2, 0.014, 0.15, mat(0xfffdf7, 0.8), -0.28, TOP + 0.007, -1.6));
      room.add(box(0.03, 0.016, 0.15, mat(0x1763e8, 0.6), -0.365, TOP + 0.008, -1.6));
      const pen = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.13, 10), mat(0xf3dc72, 0.4), -0.2, TOP + 0.018, -1.55);
      pen.rotation.z = Math.PI / 2;
      pen.rotation.y = 0.4;
      room.add(pen);
    }

    // plants
    const leafMat = [mat(0x2fa86a, 0.6), mat(0x37c27a, 0.6), mat(0x26905a, 0.6)];
    const makePlant = (s: number, leaves: number, seed: number) => {
      const g = new THREE.Group();
      g.add(mesh(new THREE.CylinderGeometry(0.06 * s, 0.045 * s, 0.1 * s, 20), mat(CREAM, 0.6), 0, 0.05 * s, 0));
      g.add(mesh(new THREE.CylinderGeometry(0.055 * s, 0.055 * s, 0.004, 20), mat(0x3a2412, 0.9), 0, 0.1 * s, 0, false));
      const sway = new THREE.Group();
      sway.position.y = 0.1 * s;
      const r = rand(seed);
      for (let i = 0; i < leaves; i++) {
        const leaf = new THREE.Mesh(track(new THREE.SphereGeometry(0.5, 12, 8)), leafMat[i % 3]);
        leaf.scale.set(0.045 * s, 0.17 * s, 0.012 * s);
        const a = (i / leaves) * Math.PI * 2 + r() * 0.5;
        const tilt = 0.35 + r() * 0.5;
        const holder = new THREE.Group();
        holder.rotation.y = a;
        leaf.position.set(0, 0.085 * s, 0);
        const tiltG = new THREE.Group();
        tiltG.rotation.z = tilt;
        tiltG.add(leaf);
        holder.add(tiltG);
        leaf.castShadow = true;
        sway.add(holder);
      }
      g.add(sway);
      return { g, sway };
    };
    const deskPlant = makePlant(1.1, 7, 5);
    deskPlant.g.position.set(0.66, TOP, -2.02);
    room.add(deskPlant.g);

    // desk lamp (toggles the light)
    const lampBulb = new THREE.Mesh(track(new THREE.SphereGeometry(0.026, 16, 12)), track(new THREE.MeshStandardMaterial({ color: 0xfff1c2, emissive: 0xffd47a, emissiveIntensity: 0 })));
    const lampShadeMat = mat(CREAM, 0.45);
    {
      const g = new THREE.Group();
      g.position.set(-0.55, TOP, -2.0);
      g.add(mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.02, 28), legMat, 0, 0.01, 0));
      const arm = (len: number, theta: number, x: number, y: number) => {
        const m = mesh(new THREE.CylinderGeometry(0.0075, 0.0075, len, 10), lampShadeMat, x + (Math.cos(theta) * len) / 2, y + (Math.sin(theta) * len) / 2, 0);
        m.rotation.z = theta - Math.PI / 2;
        return m;
      };
      const t1 = 1.08;
      const t2 = 0.26;
      const L1 = 0.38;
      const L2 = 0.34;
      g.add(arm(L1, t1, 0, 0.02));
      const ex = Math.cos(t1) * L1;
      const ey = 0.02 + Math.sin(t1) * L1;
      g.add(mesh(new THREE.SphereGeometry(0.014, 10, 8), mat(0xe8c872, 0.4, 0.4), ex, ey, 0));
      g.add(arm(L2, t2, ex, ey));
      const hx = ex + Math.cos(t2) * L2;
      const hy = ey + Math.sin(t2) * L2;
      const shade = mesh(new THREE.ConeGeometry(0.085, 0.12, 28, 1, true), track(new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.45, side: THREE.DoubleSide })), hx, hy, 0);
      shade.rotation.z = -0.22;
      g.add(shade);
      lampBulb.position.set(hx + 0.012, hy - 0.04, 0);
      g.add(lampBulb);
      room.add(g);
    }

    // office chair: red upholstery, black frame, chrome base on casters
    {
      const g = new THREE.Group();
      g.position.set(-0.7, 0, -1.05);
      g.rotation.y = 0.55;
      const upholstery = track(new THREE.MeshPhysicalMaterial({ color: RED, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5 }));
      const quilt = makeCanvas(256, 256, (c, w, h) => {
        c.fillStyle = "#d7262e";
        c.fillRect(0, 0, w, h);
        for (let x = 0; x < w; x += 64) {
          const gr = c.createLinearGradient(x, 0, x + 64, 0);
          gr.addColorStop(0, "rgba(0,0,0,0.18)");
          gr.addColorStop(0.12, "rgba(255,255,255,0.12)");
          gr.addColorStop(0.5, "rgba(255,255,255,0.05)");
          gr.addColorStop(1, "rgba(0,0,0,0.2)");
          c.fillStyle = gr;
          c.fillRect(x, 0, 64, h);
        }
        c.fillStyle = "rgba(60,0,4,0.55)";
        for (let y = 32; y < h; y += 64) for (let x = 0; x < w; x += 64) {
          c.beginPath();
          c.arc(x + 32, y, 3.5, 0, Math.PI * 2);
          c.fill();
        }
      });
      const quiltMat = track(new THREE.MeshPhysicalMaterial({ map: quilt.tex, roughness: 0.55, clearcoat: 0.2 }));
      const chrome = mat(0xd5d9e0, 0.22, 0.9);
      const black = mat(INK, 0.4, 0.4);
      // base: five-star legs with real casters
      g.add(mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.045, 20), black, 0, 0.1, 0));
      for (let i = 0; i < 5; i++) {
        const a2 = (i / 5) * Math.PI * 2 + 0.3;
        const leg = box(0.3, 0.026, 0.045, chrome, Math.cos(a2) * 0.15, 0.085, Math.sin(a2) * 0.15, 0.008);
        leg.rotation.y = -a2;
        g.add(leg);
        const fork = box(0.03, 0.045, 0.03, black, Math.cos(a2) * 0.29, 0.068, Math.sin(a2) * 0.29);
        g.add(fork);
        const wheel = mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.024, 16), black, Math.cos(a2) * 0.29, 0.03, Math.sin(a2) * 0.29);
        wheel.rotation.z = Math.PI / 2;
        wheel.rotation.y = -a2 + Math.PI / 2;
        wheel.rotation.order = "YXZ";
        g.add(wheel);
        const hub = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.028, 10), chrome, Math.cos(a2) * 0.29, 0.03, Math.sin(a2) * 0.29);
        hub.rotation.z = Math.PI / 2;
        hub.rotation.y = -a2 + Math.PI / 2;
        hub.rotation.order = "YXZ";
        g.add(hub);
      }
      // gas lift and sleeve
      g.add(mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.3, 14), chrome, 0, 0.27, 0));
      g.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 16), black, 0, 0.2, 0));
      g.add(box(0.3, 0.05, 0.26, black, 0, 0.41, 0, 0.012));
      // seat with a rolled front edge
      g.add(mesh(new RoundedBoxGeometry(0.54, 0.1, 0.52, 4, 0.04), upholstery, 0, 0.485, 0));
      g.add(mesh(new RoundedBoxGeometry(0.5, 0.04, 0.46, 3, 0.02), quiltMat, 0, 0.545, 0.0));
      // back rails and quilted back
      [-1, 1].forEach((sd) => {
        const rail = box(0.025, 0.5, 0.035, black, sd * 0.19, 0.78, 0.27, 0.008);
        rail.rotation.x = 0.22;
        g.add(rail);
      });
      const back = mesh(new RoundedBoxGeometry(0.5, 0.5, 0.1, 4, 0.04), quiltMat, 0, 0.88, 0.3);
      back.rotation.x = 0.2;
      g.add(back);
      const lumbar = mesh(new RoundedBoxGeometry(0.4, 0.14, 0.05, 3, 0.02), upholstery, 0, 0.68, 0.235);
      lumbar.rotation.x = 0.2;
      g.add(lumbar);
      // headrest on a post
      const post = box(0.03, 0.12, 0.03, black, 0, 1.18, 0.37, 0.006);
      post.rotation.x = 0.2;
      g.add(post);
      const head = mesh(new RoundedBoxGeometry(0.3, 0.14, 0.09, 4, 0.04), upholstery, 0, 1.27, 0.395);
      head.rotation.x = 0.22;
      g.add(head);
      // arms: posts and soft black pads
      [-1, 1].forEach((sd) => {
        g.add(box(0.03, 0.24, 0.04, black, sd * 0.3, 0.6, 0.08, 0.008));
        g.add(box(0.07, 0.035, 0.3, black, sd * 0.3, 0.73, 0.0, 0.016));
      });
      room.add(g);
    }

    // filing cabinet (Résumé)
    {
      const g = new THREE.Group();
      g.position.set(1.9, 0, -2.0);
      g.add(box(0.8, 0.7, 0.5, mat(CREAM, 0.55), 0, 0.35, 0, 0.015));
      const label = makeCanvas(256, 96, (c, w, h) => {
        c.fillStyle = "#eef2ff";
        c.fillRect(0, 0, w, h);
        c.strokeStyle = "#c9d6f5";
        c.lineWidth = 4;
        c.strokeRect(2, 2, w - 4, h - 4);
        c.fillStyle = "#0a47b0";
        c.textAlign = "center";
        c.font = `500 40px ${mono}`;
        c.fillText("RÉSUMÉ", w / 2, 62);
      });
      [0.52, 0.18].forEach((y, i) => {
        g.add(box(0.72, 0.28, 0.02, mat(0xfffdf7, 0.5), 0, y, 0.255, 0.008));
        const handle = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 12), mat(INK, 0.3, 0.6), 0, y + 0.03, 0.285);
        handle.rotation.z = Math.PI / 2;
        g.add(handle);
        if (i === 0) g.add(flat(0.2, 0.075, label.tex, 0, y - 0.06, 0.267));
      });
      g.add(box(0.26, 0.04, 0.2, mat(0xfffdf7, 0.8), -0.2, 0.72, 0));
      g.add(box(0.24, 0.02, 0.18, mat(0xffffff, 0.8), -0.2, 0.75, 0));
      g.add(box(0.14, 0.08, 0.1, mat(RED, 0.5), 0.2, 0.74, 0.05, 0.01));
      room.add(g);
    }

    // bookshelf (Writing): black frame, white back, warm LED strips, a full library
    {
      const g = new THREE.Group();
      g.position.set(2.74, 0, -2.1);
      const frame = mat(0x181b22, 0.45, 0.2);
      const H = 2.0;
      const W = 0.86;
      g.add(box(0.04, H, 0.34, frame, -W / 2 + 0.02, H / 2, 0));
      g.add(box(0.04, H, 0.34, frame, W / 2 - 0.02, H / 2, 0));
      g.add(box(W, 0.05, 0.34, frame, 0, H, 0));
      g.add(box(W - 0.06, H, 0.02, mat(0xf2efe6, 0.85), 0, H / 2, -0.155));
      const shelves = [0.05, 0.49, 0.93, 1.35, 1.72];
      shelves.forEach((y) => g.add(box(W - 0.06, 0.035, 0.34, frame, 0, y, 0)));
      // warm LED strips under each shelf (they glow, they don't light the room)
      const ledMat = track(new THREE.MeshStandardMaterial({ color: 0xffe7b0, emissive: 0xffd58a, emissiveIntensity: 1.6, roughness: 0.5 }));
      shelves.slice(1).forEach((y) => g.add(box(W - 0.12, 0.006, 0.012, ledMat, 0, y - 0.022, 0.15)));
      // spines: a handful of printed designs, reused across books
      const spinePalette: { base: string; band: string; title: string }[] = [
        { base: "#0f52d2", band: "#ffffff", title: "#f8f6f0" },
        { base: "#d7262e", band: "#14161b", title: "#fff" },
        { base: "#14161b", band: "#d7262e", title: "#f8f6f0" },
        { base: "#f8f6f0", band: "#0f52d2", title: "#14161b" },
        { base: "#0a2d73", band: "#e8c872", title: "#f8f6f0" },
        { base: "#ffffff", band: "#d7262e", title: "#14161b" },
        { base: "#2b7bff", band: "#14161b", title: "#fff" },
        { base: "#3a3f4b", band: "#f8f6f0", title: "#fff" },
      ];
      const spineMats = spinePalette.map((sp, i) => {
        const t = makeCanvas(64, 256, (c, w, h) => {
          c.fillStyle = sp.base;
          c.fillRect(0, 0, w, h);
          const rg = rand(40 + i);
          c.fillStyle = sp.band;
          c.fillRect(0, 22, w, 5);
          c.fillRect(0, h - 30, w, 5);
          if (i % 2 === 0) c.fillRect(0, 34, w, 2);
          c.fillStyle = sp.title;
          c.globalAlpha = 0.85;
          c.fillRect(w * 0.3, 70 + rg() * 20, w * 0.4, 12);
          c.fillRect(w * 0.38, 100 + rg() * 20, w * 0.24, 6);
          c.fillRect(w * 0.3, 130 + rg() * 20, w * 0.4, 6);
          c.globalAlpha = 1;
          const sh = c.createLinearGradient(0, 0, w, 0);
          sh.addColorStop(0, "rgba(0,0,0,0.28)");
          sh.addColorStop(0.2, "rgba(255,255,255,0.12)");
          sh.addColorStop(0.8, "rgba(0,0,0,0.05)");
          sh.addColorStop(1, "rgba(0,0,0,0.3)");
          c.fillStyle = sh;
          c.fillRect(0, 0, w, h);
        });
        return track(new THREE.MeshStandardMaterial({ map: t.tex, roughness: 0.6 }));
      });
      const bookBody = spinePalette.map((sp) => mat(parseInt(sp.base.slice(1), 16), 0.7));
      const spineGeo = track(new THREE.PlaneGeometry(1, 1));
      const r = rand(11);
      const addBook = (x: number, y: number, w: number, h: number, d: number, kind: number, tilt = 0) => {
        const bk = new THREE.Group();
        bk.add(box(w, h, d, bookBody[kind], 0, h / 2, 0, 0.003));
        const sp = new THREE.Mesh(spineGeo, spineMats[kind]);
        sp.scale.set(w * 0.98, h * 0.98, 1);
        sp.position.set(0, h / 2, d / 2 + 0.0015);
        bk.add(sp);
        bk.position.set(x, y, 0.01);
        bk.rotation.z = tilt;
        g.add(bk);
      };
      const innerL = -W / 2 + 0.05;
      const innerR = W / 2 - 0.05;
      // rows one to three: tightly packed books of different heights, some leaning
      [shelves[0], shelves[1], shelves[2]].forEach((y, si) => {
        const top = shelves[si + 1] - 0.018;
        const maxH = top - (y + 0.018) - 0.03;
        let x = innerL;
        const stopAt = si === 1 ? innerR - 0.17 : innerR - 0.02;
        while (x < stopAt - 0.03) {
          const w = 0.024 + r() * 0.03;
          const h = Math.min(maxH, 0.22 + r() * 0.17);
          if (x + w > stopAt) break;
          addBook(x + w / 2, y + 0.0175, w, h, 0.2 + r() * 0.04, Math.floor(r() * spinePalette.length));
          x += w + 0.003;
        }
        // the last book leans on the rest
        if (si !== 1) addBook(stopAt - 0.02, y + 0.0175, 0.03, maxH - 0.04, 0.22, (si * 3 + 1) % 8, 0.0);
      });
      // shelf two: a stack of flat books and a small trophy at the right end
      {
        const y = shelves[1] + 0.0175;
        let sy = y;
        [[0.2, 0.03, 3], [0.18, 0.026, 1], [0.16, 0.024, 5], [0.15, 0.02, 0]].forEach(([w, h, k], i) => {
          const bk = new THREE.Group();
          bk.add(box(w, h, 0.2, bookBody[k], 0, h / 2, 0, 0.003));
          bk.position.set(innerR - 0.1 + (i % 2) * 0.006, sy, 0.01);
          bk.rotation.y = (i - 1.5) * 0.1;
          g.add(bk);
          sy += h;
        });
        const trophy = new THREE.Group();
        const gold = mat(0xe4b94c, 0.25, 0.9);
        trophy.add(mesh(new THREE.CylinderGeometry(0.03, 0.036, 0.016, 20), mat(INK, 0.4), 0, 0.008, 0));
        trophy.add(mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.05, 12), gold, 0, 0.04, 0));
        trophy.add(mesh(new THREE.CylinderGeometry(0.036, 0.016, 0.06, 18, 1, true), track(new THREE.MeshStandardMaterial({ color: 0xe4b94c, roughness: 0.25, metalness: 0.9, side: THREE.DoubleSide })), 0, 0.1, 0));
        trophy.position.set(innerR - 0.14, sy, 0.01);
        g.add(trophy);
      }
      // top compartments: a globe and a framed photo, bookends and a few horizontal books
      {
        const y3 = shelves[3] + 0.0175;
        // bookends (black L brackets) holding a short row
        let x = innerL + 0.02;
        for (let i = 0; i < 6; i++) {
          const w = 0.028 + r() * 0.02;
          const h = 0.2 + r() * 0.1;
          addBook(x + w / 2, y3, w, h, 0.2, [1, 3, 0, 5, 2, 4][i]);
          x += w + 0.003;
        }
        g.add(box(0.012, 0.16, 0.16, frame, x + 0.006, y3 + 0.08, 0));
        // globe on a stand
        const globe = new THREE.Group();
        const gTex = makeCanvas(256, 128, (c, w, h) => {
          c.fillStyle = "#0f52d2";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#f8f6f0";
          [[40, 40, 30, 20], [110, 58, 36, 26], [170, 38, 28, 18], [210, 80, 22, 16], [80, 92, 20, 12]].forEach(([cx, cy, rx, ry]) => {
            c.beginPath();
            c.ellipse(cx, cy, rx, ry, 0.3, 0, Math.PI * 2);
            c.fill();
          });
          c.fillStyle = "#d7262e";
          c.fillRect(0, h / 2 - 1, w, 2);
        });
        const ball = new THREE.Mesh(track(new THREE.SphereGeometry(0.07, 28, 20)), track(new THREE.MeshStandardMaterial({ map: gTex.tex, roughness: 0.4, metalness: 0.1 })));
        ball.position.y = 0.105;
        ball.rotation.z = 0.4;
        ball.castShadow = true;
        globe.add(ball);
        globe.add(mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.012, 20), mat(INK, 0.4, 0.4), 0, 0.006, 0));
        const ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.083, 0.004, 8, 40, Math.PI * 1.2)), mat(0xd5d9e0, 0.25, 0.9));
        ring.position.y = 0.105;
        ring.rotation.y = Math.PI / 2;
        ring.rotation.x = 0.1;
        globe.add(ring);
        globe.position.set(innerR - 0.12, y3, 0.02);
        g.add(globe);
        // framed picture on the very top compartment, red vase beside it
        const y4 = shelves[4] + 0.0175;
        const fr = new THREE.Group();
        fr.add(box(0.2, 0.15, 0.015, mat(INK, 0.35), 0, 0.075, 0, 0.004));
        const pic = makeCanvas(160, 120, (c, w, h) => {
          c.fillStyle = "#f8f6f0";
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#0f52d2";
          c.fillRect(0, h * 0.55, w, h * 0.45);
          c.fillStyle = "#d7262e";
          c.beginPath();
          c.arc(w * 0.7, h * 0.32, 18, 0, Math.PI * 2);
          c.fill();
        });
        const pp = flat(0.17, 0.12, pic.tex, 0, 0.075, 0.009);
        fr.add(pp);
        fr.position.set(innerL + 0.14, y4, 0.02);
        fr.rotation.x = -0.08;
        g.add(fr);
        const vase = mesh(new THREE.LatheGeometry([new THREE.Vector2(0.02, 0), new THREE.Vector2(0.034, 0.05), new THREE.Vector2(0.024, 0.1), new THREE.Vector2(0.016, 0.13), new THREE.Vector2(0.024, 0.15)], 22), track(new THREE.MeshPhysicalMaterial({ color: RED, roughness: 0.2, clearcoat: 1 })), innerL + 0.34, y4, 0.02);
        g.add(vase);
        // a horizontal stack in the top compartment
        let sy = y4;
        [[0.2, 0.028, 2], [0.17, 0.024, 3], [0.18, 0.022, 4]].forEach(([w, h, k], i) => {
          const bk = new THREE.Group();
          bk.add(box(w, h, 0.2, bookBody[k], 0, h / 2, 0, 0.003));
          bk.position.set(innerR - 0.12, sy, 0.01);
          bk.rotation.y = (i - 1) * 0.15;
          g.add(bk);
          sy += h;
        });
      }
      const plant = makePlant(1.5, 9, 9);
      plant.g.position.set(0.12, H + 0.025, 0);
      g.add(plant.g);
      room.add(g);
      // keep a reference so the shelf plant sways too
      (g.userData as { sway?: THREE.Group }).sway = plant.sway;
      deskPlant.sway.userData.other = plant.sway;
    }

    /* ───────── More to look at ───────── */
    // black desk mat, headphones, a stack of books and a pencil pot
    room.add(box(0.62, 0.004, 0.36, mat(0x1b1e25, 0.9), 0.2, TOP + 0.002, -1.74, 0.002));
    {
      const g = new THREE.Group();
      g.position.set(0.66, TOP, -1.56);
      g.rotation.y = -0.5;
      const band = new THREE.Mesh(track(new THREE.TorusGeometry(0.07, 0.008, 10, 28, Math.PI)), mat(INK, 0.4, 0.3));
      band.position.y = 0.04;
      band.castShadow = true;
      g.add(band);
      [-1, 1].forEach((sd) => {
        const cup = mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.026, 24), mat(INK, 0.35, 0.3), sd * 0.07, 0.04, 0);
        cup.rotation.z = Math.PI / 2;
        g.add(cup);
        const ring = mesh(new THREE.TorusGeometry(0.03, 0.004, 8, 24), mat(RED, 0.4), sd * 0.0845, 0.04, 0, false);
        ring.rotation.y = Math.PI / 2;
        g.add(ring);
      });
      g.rotation.x = 0;
      room.add(g);
    }
    {
      const stackBooks: [number, number, number, number][] = [[INK, 0.2, 0.026, 0.14], [RED, 0.18, 0.022, 0.13], [WHITE, 0.19, 0.02, 0.14], [BLUE, 0.17, 0.018, 0.12]] as unknown as [number, number, number, number][];
      let y = TOP;
      stackBooks.forEach(([c, w, hh, d], i) => {
        const b = box(w, hh, d, mat(c, 0.65), -0.2 + (i % 2) * 0.01, y + hh / 2, -2.06, 0.004);
        b.rotation.y = (i - 1.5) * 0.12;
        room.add(b);
        y += hh;
      });
      const pot = mesh(new THREE.CylinderGeometry(0.03, 0.026, 0.07, 18), mat(INK, 0.5), 0.45, TOP + 0.035, -2.1);
      room.add(pot);
      [[RED, 0.012, 0.3], [BLUE, -0.008, -0.2], [0xf3dc72, 0.004, 0.05]].forEach(([c, dx, tilt], i) => {
        const pen2 = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.11, 8), mat(c, 0.4), 0.45 + dx, TOP + 0.09, -2.1 + (i - 1) * 0.006);
        pen2.rotation.z = tilt;
        room.add(pen2);
      });
    }

    // red armchair and a small black side table with a plant
    {
      const g = new THREE.Group();
      g.position.set(-2.05, 0, -1.45);
      g.rotation.y = 1.7;
      const fabric = mat(RED, 0.88);
      g.add(box(0.66, 0.16, 0.62, fabric, 0, 0.3, 0, 0.05));
      g.add(box(0.66, 0.54, 0.14, fabric, 0, 0.62, -0.26, 0.05));
      g.add(box(0.12, 0.28, 0.62, fabric, -0.33, 0.44, 0, 0.04));
      g.add(box(0.12, 0.28, 0.62, fabric, 0.33, 0.44, 0, 0.04));
      g.add(box(0.5, 0.07, 0.44, mat(0xb81f27, 0.9), 0, 0.41, 0.04, 0.03));
      g.add(box(0.28, 0.2, 0.08, mat(WHITE, 0.9), 0.05, 0.58, -0.17, 0.035));
      [[-0.27, -0.22], [0.27, -0.22], [-0.27, 0.22], [0.27, 0.22]].forEach(([x, z]) => {
        const leg = mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.2, 10), mat(INK, 0.4, 0.4), x, 0.1, z);
        g.add(leg);
      });
      room.add(g);
      const t = new THREE.Group();
      t.position.set(-2.78, 0, -2.0);
      t.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 32), mat(INK, 0.35, 0.2), 0, 0.5, 0));
      t.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.49, 12), mat(INK, 0.4, 0.5), 0, 0.25, 0));
      t.add(mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.02, 24), mat(INK, 0.4, 0.5), 0, 0.01, 0));
      const side = makePlant(1.3, 8, 13);
      side.g.position.set(0, 0.515, 0);
      t.add(side.g);
      room.add(t);
      sidePlant = side.sway;
    }

    // three black-framed prints on the side wall
    {
      const art = (draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, z: number, y: number, w2: number, h2: number) => {
        const tex = makeCanvas(256, Math.round((256 * h2) / w2), draw);
        const g = new THREE.Group();
        g.add(box(0.03, h2 + 0.06, w2 + 0.06, mat(INK, 0.35), 0, 0, 0));
        g.add(box(0.012, h2 + 0.01, w2 + 0.01, mat(WHITE, 0.9), 0.012, 0, 0));
        const pl = flat(w2 - 0.06, h2 - 0.06, tex.tex, 0.02, 0, 0);
        pl.rotation.y = Math.PI / 2;
        g.add(pl);
        g.position.set(-3.18, y, z);
        room.add(g);
      };
      art((c, w, h) => {
        c.fillStyle = "#f8f6f0";
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#0f52d2";
        c.beginPath();
        c.arc(w / 2, h * 0.42, w * 0.3, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#d7262e";
        c.fillRect(w * 0.18, h * 0.78, w * 0.64, 14);
      }, -1.55, 1.75, 0.34, 0.44);
      art((c, w, h) => {
        c.fillStyle = "#14161b";
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#f8f6f0";
        c.fillRect(w * 0.16, h * 0.14, w * 0.68, h * 0.5);
        c.fillStyle = "#d7262e";
        c.fillRect(w * 0.16, h * 0.7, w * 0.3, h * 0.14);
      }, -1.1, 1.75, 0.34, 0.34);
      art((c, w, h) => {
        c.fillStyle = "#f8f6f0";
        c.fillRect(0, 0, w, h);
        for (let i = 0; i < 6; i++) {
          c.fillStyle = i % 3 === 0 ? "#0f52d2" : i % 3 === 1 ? "#14161b" : "#d7262e";
          c.fillRect(24 + i * 34, 28, 22, h - 56);
        }
      }, -0.65, 1.75, 0.3, 0.42);
    }

    // soft contact shadows so nothing seems to float
    const blobTex = makeCanvas(128, 128, (c, w, h) => {
      const g = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
      g.addColorStop(0, "rgba(10,15,40,0.55)");
      g.addColorStop(0.6, "rgba(10,15,40,0.2)");
      g.addColorStop(1, "rgba(10,15,40,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    });
    const blobMat = track(new THREE.MeshBasicMaterial({ map: blobTex.tex, transparent: true, depthWrite: false }));
    const blob = (x: number, z: number, bw: number, bd: number, o = 1) => {
      const m = new THREE.Mesh(track(new THREE.PlaneGeometry(bw, bd)), o === 1 ? blobMat : track(new THREE.MeshBasicMaterial({ map: blobTex.tex, transparent: true, depthWrite: false, opacity: o })));
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.009, z);
      m.renderOrder = 1;
      room.add(m);
    };
    blob(0.2, -1.82, 2.6, 1.4, 0.7);
    blob(-0.7, -1.05, 0.95, 0.95);
    blob(1.9, -2.0, 1.2, 0.85);
    blob(2.72, -2.1, 1.0, 0.7);
    blob(-2.05, -1.45, 1.0, 1.0);
    blob(-2.78, -2.0, 0.6, 0.6);

    // sunbeam from the window, with dust drifting through it
    const beamTex = makeCanvas(8, 128, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(255,244,214,0.9)");
      g.addColorStop(0.6, "rgba(255,240,200,0.35)");
      g.addColorStop(1, "rgba(255,240,200,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    });
    const sunDir = new THREE.Vector3(3.2, -3.4, 6.1).normalize();
    const beamGroup = new THREE.Group();
    {
      const tl = new THREE.Vector3(-2.53, 2.2, -2.38);
      const tr = new THREE.Vector3(-1.71, 2.2, -2.38);
      const bl = new THREE.Vector3(-2.53, 1.1, -2.38);
      const br = new THREE.Vector3(-1.71, 1.1, -2.38);
      const proj = (v: THREE.Vector3) => v.clone().add(sunDir.clone().multiplyScalar(v.y / -sunDir.y));
      const top = [tl, tr, br, bl];
      const bottom = top.map(proj);
      const pos: number[] = [];
      const uv: number[] = [];
      const idx: number[] = [];
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4;
        const base = pos.length / 3;
        [top[i], top[j], bottom[j], bottom[i]].forEach((v, k) => {
          pos.push(v.x, v.y, v.z);
          uv.push(k === 0 || k === 3 ? 0 : 1, k < 2 ? 0 : 1);
        });
        idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
      }
      const geo = track(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx);
      const beam = new THREE.Mesh(geo, track(new THREE.MeshBasicMaterial({ map: beamTex.tex, color: 0xfff1cc, transparent: true, opacity: 0.075, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })));
      beam.renderOrder = 2;
      beamGroup.add(beam);
      const N = 70;
      const dp = new Float32Array(N * 3);
      const seeds = rand(77);
      const seed: number[] = [];
      for (let i = 0; i < N; i++) {
        seed.push(seeds(), seeds(), seeds());
        dp[i * 3] = dp[i * 3 + 1] = dp[i * 3 + 2] = 0;
      }
      const dg = track(new THREE.BufferGeometry());
      dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
      const motes = new THREE.Points(dg, track(new THREE.PointsMaterial({ map: steamTex.tex, size: 0.035, color: 0xfff3d0, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })));
      motes.frustumCulled = false;
      beamGroup.add(motes);
      moteUpdate = (t: number) => {
        for (let i = 0; i < N; i++) {
          const u = seed[i * 3];
          const v = seed[i * 3 + 1];
          const k = (t * 0.015 + seed[i * 3 + 2]) % 1;
          // a point on the window, carried along the sun's direction
          const x = -2.53 + 0.82 * u + Math.sin(t * 0.4 + i) * 0.03;
          const y = 1.1 + 1.1 * v;
          const base = new THREE.Vector3(x, y, -2.38).add(sunDir.clone().multiplyScalar(((y / -sunDir.y) * k)));
          dp[i * 3] = base.x;
          dp[i * 3 + 1] = base.y + Math.sin(t * 0.6 + i * 1.7) * 0.02;
          dp[i * 3 + 2] = base.z;
        }
        dg.attributes.position.needsUpdate = true;
      };
    }
    scene.add(beamGroup);

    /* ───────── Light ───────── */
    const hemi = new THREE.HemisphereLight(0xcfe3ff, 0xd9c7a0, 0.42);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff1d6, 3.4);
    sun.position.set(-3.6, 3.4, -7.5);
    sun.target.position.set(-0.4, 0, -1.4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
    sun.shadow.camera.left = -5;
    sun.shadow.camera.right = 5;
    sun.shadow.camera.top = 5;
    sun.shadow.camera.bottom = -5;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 18;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 5;
    scene.add(sun, sun.target);
    const fill = new THREE.DirectionalLight(0xbfd6ff, 0.55);
    fill.position.set(2.5, 4, 6);
    scene.add(fill);

    const lampSpotLight = new THREE.SpotLight(0xffd79a, 0, 5, 0.95, 0.75, 1.5);
    lampSpotLight.position.set(ANCHORS.lamp[0], ANCHORS.lamp[1] - 0.05, ANCHORS.lamp[2]);
    lampSpotLight.target.position.set(0.15, TOP, -1.8);
    scene.add(lampSpotLight, lampSpotLight.target);
    const lampGlow = new THREE.PointLight(0xffc77a, 0, 2.6, 1.6);
    lampGlow.position.copy(lampSpotLight.position);
    scene.add(lampGlow);

    const glowTex = makeCanvas(128, 128, (c, w, h) => {
      const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      g.addColorStop(0, "rgba(255,226,160,1)");
      g.addColorStop(0.25, "rgba(255,200,110,0.5)");
      g.addColorStop(1, "rgba(255,190,90,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    });
    const lampHalo = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: glowTex.tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })));
    lampHalo.scale.setScalar(0.5);
    lampHalo.position.copy(lampSpotLight.position).add(new THREE.Vector3(0.02, -0.01, 0.02));
    scene.add(lampHalo);

    let isDark = initial.current.dark;
    let isLamp = initial.current.lamp;
    const bg = new THREE.Color();
    const applyLight = () => {
      const on = isLamp;
      if (isDark) {
        scene.background = bg.set(0x041334);
        hemi.intensity = 0.16;
        sun.intensity = 0.55;
        sun.color.set(0x7e9cff);
        fill.intensity = 0.1;
        scene.environmentIntensity = 0.12;
        renderer.toneMappingExposure = 0.95;
        lampSpotLight.intensity = on ? 55 : 0;
        lampGlow.intensity = on ? 7 : 0;
      } else {
        scene.background = bg.set(0x0a3b9c);
        hemi.intensity = 0.42;
        sun.intensity = 3.4;
        sun.color.set(0xfff1d6);
        fill.intensity = 0.55;
        scene.environmentIntensity = 0.38;
        renderer.toneMappingExposure = 0.92;
        lampSpotLight.intensity = on ? 14 : 0;
        lampGlow.intensity = on ? 1.6 : 0;
      }
      (lampBulb.material as THREE.MeshStandardMaterial).emissiveIntensity = on ? 3 : 0;
      (lampHalo.material as THREE.SpriteMaterial).opacity = on ? (isDark ? 0.95 : 0.55) : 0;
      beamGroup.visible = !isDark;
    };
    applyLight();

    /* ───────── Camera and controls ───────── */
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.8;
    controls.screenSpacePanning = true;
    controls.minAzimuthAngle = -0.8;
    controls.maxAzimuthAngle = 0.8;
    controls.minPolarAngle = 0.95;
    controls.maxPolarAngle = 1.62;
    controls.target.copy(HOME_TARGET);

    const home = { pos: new THREE.Vector3(), target: HOME_TARGET.clone(), dist: 6 };
    let w = 1;
    let h = 1;
    const computeHome = () => {
      const aspect = w / h;
      camera.aspect = aspect;
      camera.fov = aspect < 1 ? 62 : 42;
      camera.updateProjectionMatrix();
      const wantWidth = aspect >= 1.2 ? 5.4 : aspect >= 0.8 ? 4.4 : 3.2;
      const dist = wantWidth / (2 * Math.tan((camera.fov * Math.PI) / 360) * aspect);
      home.dist = dist;
      home.pos.set(0.35, 1.78, HOME_TARGET.z + dist);
      controls.minDistance = 1.2;
      controls.maxDistance = dist * 1.35;
    };

    const resize = () => {
      w = container.clientWidth || 1;
      h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      const had = userMoved;
      computeHome();
      if (!had) {
        camera.position.copy(home.pos);
        controls.target.copy(home.target);
      }
    };
    let userMoved = false;
    controls.addEventListener("start", () => {
      userMoved = true;
      tween = null;
    });

    /* ── tweening the camera (focus on an object, return home) ── */
    let tween: null | { fp: THREE.Vector3; ft: THREE.Vector3; tp: THREE.Vector3; tt: THREE.Vector3; t0: number; dur: number } = null;
    let saved: { pos: THREE.Vector3; target: THREE.Vector3 } | null = null;
    const flyTo = (pos: THREE.Vector3, target: THREE.Vector3, dur = 1100) => {
      tween = {
        fp: camera.position.clone(),
        ft: controls.target.clone(),
        tp: pos.clone(),
        tt: target.clone(),
        t0: performance.now(),
        dur: reduced ? 0 : dur,
      };
    };

    const focus = (id: SceneId | null) => {
      if (id) {
        if (!saved) saved = { pos: camera.position.clone(), target: controls.target.clone() };
        const a = new THREE.Vector3(...ANCHORS[id]);
        const d = FOCUS[id];
        const dir = camera.position.clone().sub(a);
        dir.y = Math.max(dir.y, 0.05);
        dir.normalize();
        const target = a.clone().add(new THREE.Vector3(0, -0.34 * (d / 1.5), 0));
        flyTo(target.clone().add(dir.multiplyScalar(d)), target);
        controls.enabled = false;
      } else {
        controls.enabled = true;
        if (saved) flyTo(saved.pos, saved.target, 900);
        saved = null;
      }
    };

    const fitHome = () => {
      userMoved = false;
      saved = null;
      controls.enabled = true;
      flyTo(home.pos, home.target, 900);
    };

    const zoomBy = (f: number) => {
      const off = camera.position.clone().sub(controls.target);
      const len = Math.min(controls.maxDistance, Math.max(controls.minDistance, off.length() / f));
      flyTo(controls.target.clone().add(off.normalize().multiplyScalar(len)), controls.target.clone(), 450);
      userMoved = true;
    };

    live.current = {
      setDark: (d) => {
        isDark = d;
        applyLight();
        sky.draw();
      },
      setLamp: (l) => {
        isLamp = l;
        applyLight();
      },
      focus,
    };
    apiRef.current = { zoomBy, fit: fitHome };

    /* ── hotspots, projected from 3D into the page ── */
    const dotEls = new Map<string, HTMLButtonElement>();
    dots.querySelectorAll<HTMLButtonElement>("button[data-id]").forEach((b) => dotEls.set(b.dataset.id!, b));
    const v3 = new THREE.Vector3();
    const placeDots = () => {
      dotEls.forEach((el, id) => {
        const a = ANCHORS[id as keyof typeof ANCHORS];
        v3.set(a[0], a[1], a[2]).project(camera);
        const visible = v3.z < 1 && Math.abs(v3.x) < 1.15 && Math.abs(v3.y) < 1.15;
        const x = (v3.x * 0.5 + 0.5) * w;
        const y = (-v3.y * 0.5 + 0.5) * h;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
        el.style.opacity = visible ? "1" : "0";
        el.style.pointerEvents = visible ? "auto" : "none";
      });
    };

    /* ── the loop ── */
    let raf = 0;
    let running = true;
    let lastTex = 0;
    const clock = new THREE.Clock();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      const now = performance.now();
      const t = clock.getElapsedTime();

      if (tween) {
        const k = tween.dur === 0 ? 1 : Math.min(1, (now - tween.t0) / tween.dur);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        camera.position.lerpVectors(tween.fp, tween.tp, e);
        controls.target.lerpVectors(tween.ft, tween.tt, e);
        if (k >= 1) tween = null;
      }
      controls.update();
      // keep the look-at point inside the room
      controls.target.x = Math.min(2.2, Math.max(-1.6, controls.target.x));
      controls.target.y = Math.min(1.9, Math.max(0.3, controls.target.y));
      controls.target.z = Math.min(-0.2, Math.max(-2.2, controls.target.z));

      // live textures (about 20 fps is plenty)
      if (now - lastTex > 50) {
        lastTex = now;
        screen.draw();
        board.draw();
      }

      // the real time in Lagos (UTC+1, no daylight saving)
      const d = new Date();
      const hh = (d.getUTCHours() + 1) % 24;
      const mm = d.getUTCMinutes();
      const ss = d.getUTCSeconds() + d.getUTCMilliseconds() / 1000;
      hourH.rotation.z = -((hh % 12) + mm / 60) * (Math.PI / 6);
      minH.rotation.z = -(mm + ss / 60) * (Math.PI / 30);
      secH.rotation.z = -ss * (Math.PI / 30);

      if (!reduced) {
        steam.forEach((p) => {
          const k = (t * 0.28 + p.phase) % 1;
          p.s.position.set(Math.sin(k * 7 + p.phase * 6) * 0.012, 0.1 + k * 0.17, 0);
          (p.s.material as THREE.SpriteMaterial).opacity = Math.sin(k * Math.PI) * 0.35;
          p.s.scale.setScalar(0.035 + k * 0.05);
        });
        const sw = Math.sin(t * 0.9) * 0.035;
        deskPlant.sway.rotation.z = sw;
        if (sidePlant) sidePlant.rotation.z = sw * 0.7;
        const other = deskPlant.sway.userData.other as THREE.Group | undefined;
        if (other) other.rotation.z = -sw * 0.8;
      }

      if (!reduced && moteUpdate && beamGroup.visible) moteUpdate(t);
      renderer.render(scene, camera);
      placeDots();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    camera.position.copy(home.pos);
    controls.target.copy(home.target);
    controls.update();
    if (initial.current.open) focus(initial.current.open);

    const onVis = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e: Event) => {
      e.preventDefault();
      onFail?.();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    // draw the textures again once the site fonts have loaded
    Promise.all([document.fonts.load(`italic 500 40px ${serif}`), document.fonts.load(`500 20px ${mono}`)])
      .then(() => document.fonts.ready)
      .then(() => texList.forEach((x) => x.draw()))
      .catch(() => undefined);

    frame();
    // the first frame is up: let the doors open
    requestAnimationFrame(() => requestAnimationFrame(() => onReady()));

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      renderer.dispose();
      canvas.remove();
      live.current = null;
      apiRef.current = null;
    };
    // The scene is built once; props flow in through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    live.current?.setDark(dark);
  }, [dark]);
  useEffect(() => {
    live.current?.setLamp(lamp);
  }, [lamp]);
  useEffect(() => {
    live.current?.focus(open);
  }, [open]);

  return (
    <div ref={host} className="scene-viewport scene-3d">
      <div ref={dotsHost} className="scene-dots">
        {hotspots.map((h) => (
          <button
            key={h.id}
            type="button"
            data-id={h.id}
            className="hotspot"
            style={{ left: 0, top: 0 }}
            onClick={() => onOpen(h.id)}
            aria-label={`${h.label}: ${h.object.toLowerCase()}`}
          >
            <span className="hotspot-dot" />
            <span className="hotspot-label">{h.label}</span>
          </button>
        ))}
        <button
          type="button"
          data-id="lamp"
          className="hotspot lamp-spot"
          style={{ left: 0, top: 0 }}
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

