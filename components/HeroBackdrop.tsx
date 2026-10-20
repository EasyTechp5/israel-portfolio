"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; vx: number; vy: number; r: number };
type Packet = { a: number; b: number; t: number; speed: number };

/**
 * Animated "neural network" behind a page hero: drifting nodes joined by
 * faint links, bright data packets travelling along them, and a gentle
 * reaction to the cursor. It is decoration only (aria-hidden, no pointer
 * events), pauses when off-screen or in a background tab, uses fewer nodes on
 * phones, and draws one still frame for visitors who prefer reduced motion.
 */
export default function HeroBackdrop({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let link = 130;
    let raf = 0;
    let inView = true;
    let last = 0;
    let spawn = 0;
    let nodes: Dot[] = [];
    let packets: Packet[] = [];
    let rgb = "0,85,218";
    const mouse = { x: -9999, y: -9999 };

    const readTheme = () => {
      rgb = document.documentElement.classList.contains("dark") ? "110,168,255" : "0,85,218";
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const small = w < 640;
      link = small ? 95 : 135;
      const cap = small ? 26 : 62;
      const count = Math.max(16, Math.min(cap, Math.round(((w * h) / 17000) * density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.2 + Math.random() * 1.6,
      }));
      packets = [];
    };

    const frame = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        // Cursor gently pushes nearby nodes away.
        const mx = n.x - mouse.x;
        const my = n.y - mouse.y;
        const md = Math.hypot(mx, my);
        if (md < 120 && md > 0) {
          n.vx += (mx / md) * 0.012;
          n.vy += (my / md) * 0.012;
        }
        n.vx *= 0.995;
        n.vy *= 0.995;
        if (Math.abs(n.vx) < 0.05) n.vx += (Math.random() - 0.5) * 0.01;
        if (Math.abs(n.vy) < 0.05) n.vy += (Math.random() - 0.5) * 0.01;

        n.x += n.vx * dt * 0.06;
        n.y += n.vy * dt * 0.06;
        if (n.x < -10) n.x = w + 10;
        else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        else if (n.y > h + 10) n.y = -10;
      }

      // Links
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < link) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / link) * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        // Link to the cursor
        const cd = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
        if (cd < 150) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - cd / 150) * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${rgb},0.55)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Data packets travelling along links
      spawn -= dt;
      if (spawn <= 0 && packets.length < 7 && nodes.length > 2) {
        spawn = 500 + Math.random() * 700;
        const a = Math.floor(Math.random() * nodes.length);
        let best = -1;
        let bestD = link;
        for (let j = 0; j < nodes.length; j++) {
          if (j === a) continue;
          const d = Math.hypot(nodes[a].x - nodes[j].x, nodes[a].y - nodes[j].y);
          if (d < bestD && Math.random() > 0.35) {
            best = j;
            bestD = d;
          }
        }
        if (best >= 0) packets.push({ a, b: best, t: 0, speed: 0.0011 + Math.random() * 0.0012 });
      }
      packets = packets.filter((p) => p.t < 1);
      for (const p of packets) {
        p.t += p.speed * dt;
        const A = nodes[p.a];
        const B = nodes[p.b];
        const x = A.x + (B.x - A.x) * p.t;
        const y = A.y + (B.y - A.y) * p.t;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 11);
        glow.addColorStop(0, `rgba(${rgb},0.95)`);
        glow.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      raf = 0;
      if (!inView || document.hidden) return;
      const dt = Math.min(now - (last || now), 48);
      last = now;
      frame(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduce || raf || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    readTheme();
    build();
    if (reduce) frame(16);
    else start();

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) frame(16);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
    });
    io.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (reduce) frame(16);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        WebkitMaskImage: "radial-gradient(ellipse 95% 90% at 50% 38%, #000 35%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 95% 90% at 50% 38%, #000 35%, transparent 100%)",
      }}
    />
  );
}
