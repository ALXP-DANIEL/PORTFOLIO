"use client";

import { useEffect, useRef } from "react";

const CELL = 35;
const WARP_RADIUS = 220;
const WARP_STRENGTH = 55;
const LERP = 0.09;
const STEP = 5;
const CURSOR_ARM = 9;
const RETICLE_PAD = 8; // breathing room between brackets and target
const RETICLE_ARM = 14; // length of each corner bracket arm
const RETICLE_SELECTOR = "a, button, [role='button'], [data-reticle]";
const LOCK_LERP = 0.18; // crossfade speed between crosshair and brackets
const BOX_LERP = 0.22; // how fast the brackets snap onto the target
const RETICLE_RGB = "240,236,228";
const PULSE_LIFETIME = 90; // frames (~1.5 s at 60 fps)
const PULSE_ALPHA = 0.07; // peak brightness added on top of base
const PULSE_RATE = 0.012; // probability per frame of spawning a new pulse

export default function GridBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    const ctx = canvas.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    if (!ctx || !overlayCtx) return;
    const activeCanvas = canvas;
    const activeCtx = ctx;
    const overlayCanvas = overlay;
    const overlayContext = overlayCtx;
    const background = "rgb(10, 10, 10)";
    const gridStroke = "rgba(255,255,255,0.045)";
    const pulseFill = "255,255,255";

    let w = 0;
    let h = 0;
    let mx = -999;
    let my = -999;
    let tx = -999;
    let ty = -999;
    let raf: number;
    type Pulse = { col: number; row: number; age: number };
    let pulses: Pulse[] = [];

    // target-lock reticle
    let lockEl: Element | null = null;
    let lock = 0; // 0 = crosshair, 1 = brackets caging a target
    const rb = { l: -999, t: -999, r: -999, b: -999 }; // smoothed bracket box

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      activeCanvas.width = Math.round(w * dpr);
      activeCanvas.height = Math.round(h * dpr);
      activeCanvas.style.width = `${w}px`;
      activeCanvas.style.height = `${h}px`;
      overlayCanvas.width = Math.round(w * dpr);
      overlayCanvas.height = Math.round(h * dpr);
      overlayCanvas.style.width = `${w}px`;
      overlayCanvas.style.height = `${h}px`;
      // setTransform resets and scales in one call — safe to call on every resize
      activeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overlayContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      const el = e.target as Element | null;
      lockEl = el?.closest(RETICLE_SELECTOR) ?? null;
    }

    function displace(px: number, py: number): [number, number] {
      const dx = px - mx;
      const dy = py - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d === 0 || d > WARP_RADIUS) return [0, 0];
      const falloff = (1 - d / WARP_RADIUS) ** 2;
      return [
        (dx / d) * WARP_STRENGTH * falloff,
        (dy / d) * WARP_STRENGTH * falloff,
      ];
    }

    function draw() {
      mx += (tx - mx) * LERP;
      my += (ty - my) * LERP;

      activeCtx.fillStyle = background;
      activeCtx.fillRect(0, 0, w, h);

      // warped grid — single path so overlapping strokes don't stack opacity
      activeCtx.strokeStyle = gridStroke;
      activeCtx.lineWidth = 1;
      activeCtx.beginPath();

      for (let x = 0; x <= w; x += CELL) {
        for (let y = 0; y <= h; y += STEP) {
          const [ox, oy] = displace(x, y);
          y === 0
            ? activeCtx.moveTo(x + ox, y + oy)
            : activeCtx.lineTo(x + ox, y + oy);
        }
      }

      for (let y = 0; y <= h; y += CELL) {
        for (let x = 0; x <= w; x += STEP) {
          const [ox, oy] = displace(x, y);
          x === 0
            ? activeCtx.moveTo(x + ox, y + oy)
            : activeCtx.lineTo(x + ox, y + oy);
        }
      }

      activeCtx.stroke();

      // spawn a random cell flash occasionally
      if (Math.random() < PULSE_RATE) {
        const col = Math.floor(Math.random() * Math.ceil(w / CELL));
        const row = Math.floor(Math.random() * Math.ceil(h / CELL));
        pulses.push({ col, row, age: 0 });
      }

      // draw flashing cells
      for (const p of pulses) {
        const alpha =
          PULSE_ALPHA * Math.sin((p.age / PULSE_LIFETIME) * Math.PI);
        activeCtx.fillStyle = `rgba(${pulseFill},${alpha.toFixed(3)})`;
        const x = p.col * CELL;
        const y = p.row * CELL;
        // warp each corner of the cell
        const [ox0, oy0] = displace(x, y);
        const [ox1, oy1] = displace(x + CELL, y);
        const [ox2, oy2] = displace(x + CELL, y + CELL);
        const [ox3, oy3] = displace(x, y + CELL);
        activeCtx.beginPath();
        activeCtx.moveTo(x + ox0, y + oy0);
        activeCtx.lineTo(x + CELL + ox1, y + oy1);
        activeCtx.lineTo(x + CELL + ox2, y + CELL + oy2);
        activeCtx.lineTo(x + ox3, y + CELL + oy3);
        activeCtx.closePath();
        activeCtx.fill();
        p.age++;
      }
      pulses = pulses.filter((p) => p.age < PULSE_LIFETIME);

      // target-lock reticle — drawn on the overlay so it sits above all content
      overlayContext.clearRect(0, 0, w, h);
      const hasTarget = lockEl !== null && document.contains(lockEl);
      lock += ((hasTarget ? 1 : 0) - lock) * LOCK_LERP;

      let dl: number;
      let dt: number;
      let dr: number;
      let db: number;
      if (hasTarget && lockEl) {
        const r = lockEl.getBoundingClientRect();
        dl = r.left - RETICLE_PAD;
        dt = r.top - RETICLE_PAD;
        dr = r.right + RETICLE_PAD;
        db = r.bottom + RETICLE_PAD;
      } else {
        // collapse the box onto the cursor so it reads as a point
        dl = mx;
        dt = my;
        dr = mx;
        db = my;
      }

      if (rb.l < -900) {
        // seed on first frame so the box doesn't sweep in from off-screen
        rb.l = dl;
        rb.t = dt;
        rb.r = dr;
        rb.b = db;
      }
      rb.l += (dl - rb.l) * BOX_LERP;
      rb.t += (dt - rb.t) * BOX_LERP;
      rb.r += (dr - rb.r) * BOX_LERP;
      rb.b += (db - rb.b) * BOX_LERP;

      // crosshair fades out as the lock engages
      const chAlpha = 1 - lock;
      if (chAlpha > 0.01) {
        overlayContext.strokeStyle = `rgba(${RETICLE_RGB},${(0.85 * chAlpha).toFixed(3)})`;
        overlayContext.lineWidth = 1.5;
        overlayContext.beginPath();
        overlayContext.moveTo(mx - CURSOR_ARM, my);
        overlayContext.lineTo(mx + CURSOR_ARM, my);
        overlayContext.moveTo(mx, my - CURSOR_ARM);
        overlayContext.lineTo(mx, my + CURSOR_ARM);
        overlayContext.stroke();
      }

      // corner brackets fade in and cage the target
      if (lock > 0.01) {
        const arm = Math.min(
          RETICLE_ARM,
          (rb.r - rb.l) / 2,
          (rb.b - rb.t) / 2,
        );
        overlayContext.strokeStyle = `rgba(${RETICLE_RGB},${(0.9 * lock).toFixed(3)})`;
        overlayContext.lineWidth = 1.5;
        overlayContext.beginPath();
        // top-left
        overlayContext.moveTo(rb.l, rb.t + arm);
        overlayContext.lineTo(rb.l, rb.t);
        overlayContext.lineTo(rb.l + arm, rb.t);
        // top-right
        overlayContext.moveTo(rb.r - arm, rb.t);
        overlayContext.lineTo(rb.r, rb.t);
        overlayContext.lineTo(rb.r, rb.t + arm);
        // bottom-right
        overlayContext.moveTo(rb.r, rb.b - arm);
        overlayContext.lineTo(rb.r, rb.b);
        overlayContext.lineTo(rb.r - arm, rb.b);
        // bottom-left
        overlayContext.moveTo(rb.l + arm, rb.b);
        overlayContext.lineTo(rb.l, rb.b);
        overlayContext.lineTo(rb.l, rb.b - arm);
        overlayContext.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10">{children}</div>
      <canvas
        ref={overlayRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 250 }}
      />
    </>
  );
}
