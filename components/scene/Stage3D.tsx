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
    const floor = mesh(new THREE.PlaneGeometry(6.4, 4.8), track(new THREE.MeshStandardMaterial({ map: planks.tex, roughness: 0.62 })), 0, 0, 0, false);
    floor.rotation.x = -Math.PI / 2;
    room.add(floor);

    const wallMat = mat(BLUE, 0.92);
    const trimMat = mat(CREAM, 0.6);

    // back wall with a window opening
    const WALL_Z = -2.5;
    const T = 0.2;
    room.add(box(0.7, 2.9, T, wallMat, -2.85, 1.45, WALL_Z));
    room.add(box(4.3, 2.9, T, wallMat, 1.05, 1.45, WALL_Z));
    room.add(box(1.4, 0.95, T, wallMat, -1.8, 0.475, WALL_Z));
    room.add(box(1.4, 0.55, T, wallMat, -1.8, 2.625, WALL_Z));
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

    // window frame, mullions and sill
    room.add(box(0.05, 1.4, 0.06, trimMat, -2.5, 1.65, -2.4));
    room.add(box(0.05, 1.4, 0.06, trimMat, -1.1, 1.65, -2.4));
    room.add(box(1.45, 0.05, 0.06, trimMat, -1.8, 2.35, -2.4));
    room.add(box(1.45, 0.05, 0.06, trimMat, -1.8, 0.95, -2.4));
    room.add(box(0.035, 1.4, 0.04, trimMat, -1.8, 1.65, -2.4));
    room.add(box(1.4, 0.035, 0.04, trimMat, -1.8, 1.65, -2.4));
    room.add(box(1.6, 0.05, 0.2, trimMat, -1.8, 0.93, -2.33));

    // what you see through the window (swapped for a night sky after dark)
    const sky = makeCanvas(1024, 512, (c, w, h) => {
      const night = initial.current.dark;
      const g = c.createLinearGradient(0, 0, 0, h);
      if (night) {
        g.addColorStop(0, "#040c28");
        g.addColorStop(1, "#0d2f78");
      } else {
        g.addColorStop(0, "#9ccaff");
        g.addColorStop(1, "#eaf4ff");
      }
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      if (night) {
        const r = rand(3);
        for (let i = 0; i < 90; i++) {
          c.fillStyle = `rgba(255,255,255,${0.4 + r() * 0.6})`;
          c.fillRect(r() * w, r() * h * 0.7, 2, 2);
        }
        c.fillStyle = "#fdf6d8";
        c.beginPath();
        c.arc(780, 110, 34, 0, Math.PI * 2);
        c.fill();
      } else {
        c.fillStyle = "rgba(255,255,255,0.9)";
        [[220, 120, 90, 26], [300, 100, 60, 24], [700, 190, 80, 22]].forEach(([x, y, rx, ry]) => {
          c.beginPath();
          c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
          c.fill();
        });
      }
      c.fillStyle = night ? "#0a2a6a" : "#86b5ee";
      c.beginPath();
      c.moveTo(0, 360);
      c.bezierCurveTo(200, 290, 360, 350, 560, 300);
      c.bezierCurveTo(760, 250, 900, 320, 1024, 290);
      c.lineTo(1024, 512);
      c.lineTo(0, 512);
      c.fill();
      c.fillStyle = night ? "#07204f" : "#68a0e4";
      c.beginPath();
      c.moveTo(0, 420);
      c.bezierCurveTo(240, 370, 460, 420, 700, 380);
      c.bezierCurveTo(860, 356, 940, 390, 1024, 372);
      c.lineTo(1024, 512);
      c.lineTo(0, 512);
      c.fill();
    });
    const skyPlane = new THREE.Mesh(track(new THREE.PlaneGeometry(10, 5)), track(new THREE.MeshBasicMaterial({ map: sky.tex, toneMapped: false })));
    skyPlane.position.set(-1.8, 1.6, -4.2);
    scene.add(skyPlane);

    // rug
    const rug = makeCanvas(1024, 700, (c, w, h) => {
      c.fillStyle = "#f6efdc";
      rr(c, 6, 6, w - 12, h - 12, 60);
      c.fill();
      c.strokeStyle = "#1763e8";
      c.lineWidth = 26;
      rr(c, 26, 26, w - 52, h - 52, 48);
      c.stroke();
      c.lineWidth = 4;
      rr(c, 74, 74, w - 148, h - 148, 30);
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

    // portrait (About)
    {
      const g = new THREE.Group();
      g.add(box(0.56, 0.68, 0.04, frameMat, 0, 0, 0, 0.01));
      const photoTex = track(new THREE.TextureLoader().load("/images/israel-logo.jpg"));
      photoTex.colorSpace = THREE.SRGBColorSpace;
      g.add(box(0.46, 0.58, 0.012, mat(0xfffdf6, 0.9), 0, 0, 0.022));
      g.add(flat(0.38, 0.38, photoTex, 0, 0.05, 0.03));
      g.add(box(0.2, 0.05, 0.015, goldMat, 0, -0.22, 0.03));
      g.position.set(-0.75, 1.78, DECOR_Z + 0.02);
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
      g.add(box(1.16, 0.74, 0.04, frameMat, 0, 0, 0, 0.012));
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

    // clock (live Lagos time)
    const clockFace = makeCanvas(512, 512, (c, w, h) => {
      c.fillStyle = "#f6efdc";
      c.beginPath();
      c.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#fffdf7";
      c.beginPath();
      c.arc(w / 2, h / 2, w / 2 - 26, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#14161b";
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        const big = i % 3 === 0;
        c.lineWidth = big ? 12 : 6;
        c.beginPath();
        c.moveTo(w / 2 + Math.sin(a) * (w / 2 - 50), h / 2 - Math.cos(a) * (h / 2 - 50));
        c.lineTo(w / 2 + Math.sin(a) * (w / 2 - (big ? 96 : 78)), h / 2 - Math.cos(a) * (h / 2 - (big ? 96 : 78)));
        c.stroke();
      }
      c.fillStyle = "#5f636b";
      c.textAlign = "center";
      c.font = `500 34px ${mono}`;
      c.fillText("LAGOS", w / 2, h / 2 + 120);
    });
    const clockG = new THREE.Group();
    clockG.position.set(2.15, 2.28, DECOR_Z + 0.01);
    clockG.add(flat(0.42, 0.42, clockFace.tex, 0, 0, 0));
    const hand = (len: number, wd: number, color: number) => {
      const p = new THREE.Group();
      const m = new THREE.Mesh(track(new THREE.BoxGeometry(wd, len, 0.004)), track(new THREE.MeshBasicMaterial({ color })));
      m.position.y = len / 2 - 0.01;
      p.add(m);
      return p;
    };
    const hourH = hand(0.1, 0.012, INK);
    const minH = hand(0.15, 0.008, INK);
    const secH = hand(0.17, 0.004, 0xe24d4d);
    [hourH, minH, secH].forEach((h, i) => {
      h.position.z = 0.003 + i * 0.002;
      clockG.add(h);
    });
    room.add(clockG);

    /* ───────── Desk and the things on it ───────── */
    const deskMat = mat(OAK, 0.55);
    const legMat = mat(NAVY, 0.5);
    const DESK_Y = 0.75;
    room.add(box(1.9, 0.045, 0.8, deskMat, 0.2, DESK_Y, -1.82, 0.012));
    [[-0.72, -2.14], [1.12, -2.14], [-0.72, -1.5], [1.12, -1.5]].forEach(([x, z]) => room.add(box(0.05, 0.73, 0.05, legMat, x, 0.365, z)));
    room.add(box(1.8, 0.05, 0.04, legMat, 0.2, 0.62, -2.14));
    const TOP = DESK_Y + 0.0225;

    // laptop with a screen that runs a workflow
    const screen = makeCanvas(640, 420, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0d2a6e");
      g.addColorStop(1, "#081a47");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      c.fillStyle = "rgba(156,195,255,0.7)";
      rr(c, 40, 36, 170, 16, 8);
      c.fill();
      c.fillStyle = "rgba(156,195,255,0.32)";
      rr(c, 40, 66, 280, 12, 6);
      c.fill();
      const nodes = [60, 190, 320, 450];
      nodes.forEach((x, i) => {
        c.fillStyle = i === 3 ? "#37c27a" : "#2b7bff";
        rr(c, x, 170, 100, 70, 16);
        c.fill();
        if (i < 3) {
          c.strokeStyle = "#9cc3ff";
          c.lineWidth = 5;
          c.beginPath();
          c.moveTo(x + 100, 205);
          c.lineTo(x + 130, 205);
          c.stroke();
        }
      });
      const t = (performance.now() % 2600) / 2600;
      c.fillStyle = "#fff";
      c.beginPath();
      c.arc(70 + t * 450, 205, 11, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#37c27a";
      rr(c, 40, 320, 110, 14, 7);
      c.fill();
      c.fillStyle = "rgba(156,195,255,0.3)";
      rr(c, 40, 346, 220, 10, 5);
      c.fill();
    });
    {
      const g = new THREE.Group();
      g.position.set(0.2, TOP, -1.78);
      g.add(box(0.34, 0.014, 0.23, mat(0xdfe3ea, 0.35, 0.6), 0, 0.007, 0.02, 0.005));
      const lid = new THREE.Group();
      lid.position.set(0, 0.014, -0.095);
      lid.rotation.x = -0.28;
      lid.add(box(0.34, 0.225, 0.01, mat(INK, 0.4, 0.4), 0, 0.1125, 0, 0.004));
      const scr = new THREE.Mesh(track(new THREE.PlaneGeometry(0.31, 0.2)), track(new THREE.MeshBasicMaterial({ map: screen.tex, toneMapped: false })));
      scr.position.set(0, 0.112, 0.0055);
      lid.add(scr);
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
    {
      const g = new THREE.Group();
      g.position.set(1.04, TOP, -1.96);
      g.add(mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.09, 28), mat(0xfffdf7, 0.35), 0, 0.045, 0));
      g.add(mesh(new THREE.CylinderGeometry(0.0415, 0.0365, 0.022, 28), mat(0x1763e8, 0.4), 0, 0.05, 0));
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

    // chair, pulled out at the left end of the desk
    {
      const g = new THREE.Group();
      g.position.set(-0.7, 0, -1.05);
      g.rotation.y = 0.18;
      const seatMat = mat(0x134fc2, 0.75);
      g.add(box(0.5, 0.08, 0.5, seatMat, 0, 0.47, 0, 0.03));
      g.add(box(0.46, 0.5, 0.07, mat(0x0b3a8f, 0.75), 0, 0.82, 0.23, 0.03));
      g.add(box(0.3, 0.12, 0.06, mat(CREAM, 0.6), 0, 1.16, 0.24, 0.03));
      g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.34, 12), mat(INK, 0.4, 0.6), 0, 0.26, 0));
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const leg = box(0.3, 0.03, 0.04, mat(INK, 0.4, 0.5), Math.cos(a) * 0.14, 0.06, Math.sin(a) * 0.14);
        leg.rotation.y = -a;
        g.add(leg);
        g.add(mesh(new THREE.SphereGeometry(0.03, 10, 8), mat(INK, 0.5), Math.cos(a) * 0.28, 0.03, Math.sin(a) * 0.28));
      }
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
        const handle = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 12), mat(0x0055da, 0.35, 0.4), 0, y + 0.03, 0.285);
        handle.rotation.z = Math.PI / 2;
        g.add(handle);
        if (i === 0) g.add(flat(0.2, 0.075, label.tex, 0, y - 0.06, 0.267));
      });
      g.add(box(0.26, 0.04, 0.2, mat(0xfffdf7, 0.8), -0.2, 0.72, 0));
      g.add(box(0.24, 0.02, 0.18, mat(0xffffff, 0.8), -0.2, 0.75, 0));
      g.add(box(0.14, 0.08, 0.1, mat(0x0055da, 0.5), 0.2, 0.74, 0.05, 0.01));
      room.add(g);
    }

    // bookshelf (Writing)
    {
      const g = new THREE.Group();
      g.position.set(2.72, 0, -2.1);
      const frame = mat(NAVY, 0.6);
      const H = 1.8;
      g.add(box(0.04, H, 0.34, frame, -0.34, H / 2, 0));
      g.add(box(0.04, H, 0.34, frame, 0.34, H / 2, 0));
      g.add(box(0.72, 0.04, 0.34, frame, 0, H, 0));
      g.add(box(0.7, H, 0.02, mat(0x0c3688, 0.8), 0, H / 2, -0.16));
      const shelves = [0.04, 0.5, 0.95, 1.38];
      shelves.forEach((y) => g.add(box(0.68, 0.04, 0.34, frame, 0, y, 0)));
      const colors = [0xf6efdc, 0xf3dc72, 0x9cc3ff, 0xffb3c4, 0x2b7bff, 0xffffff, 0xe24d4d, 0x37c27a];
      const r = rand(11);
      shelves.slice(0, 3).forEach((y, si) => {
        let x = -0.3;
        while (x < 0.27) {
          const w = 0.025 + r() * 0.03;
          const h = 0.22 + r() * 0.16;
          const b = box(w, h, 0.22, mat(colors[Math.floor(r() * colors.length)], 0.7), x + w / 2, y + 0.02 + h / 2, 0.01);
          if (si === 1 && x > 0.1) b.rotation.z = -0.16;
          g.add(b);
          x += w + 0.004;
        }
      });
      g.add(box(0.2, 0.2, 0.2, mat(CREAM, 0.7), -0.18, 1.38 + 0.12, 0, 0.01));
      g.add(box(0.12, 0.12, 0.12, mat(0xf3dc72, 0.6), 0.1, 1.38 + 0.08, 0, 0.012));
      const plant = makePlant(1.5, 9, 9);
      plant.g.position.set(0, H + 0.02, 0);
      g.add(plant.g);
      room.add(g);
      // keep a reference so the shelf plant sways too
      (g.userData as { sway?: THREE.Group }).sway = plant.sway;
      deskPlant.sway.userData.other = plant.sway;
    }

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
        const other = deskPlant.sway.userData.other as THREE.Group | undefined;
        if (other) other.rotation.z = -sw * 0.8;
      }

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

