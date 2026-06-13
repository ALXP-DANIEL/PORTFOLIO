"use client";

import { useEffect, useRef } from "react";

const CELL = 35;
const WARP_RADIUS = 220;
const WARP_STRENGTH = 55;
const LERP = 0.09;
const STEP = 5;
const CURSOR_ARM = 9;
const PULSE_LIFETIME = 90; // frames (~1.5 s at 60 fps)
const PULSE_ALPHA = 0.07; // peak brightness added on top of base
const PULSE_RATE = 0.012; // probability per frame of spawning a new pulse

export default function GridBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const activeCanvas = canvas;
    const activeCtx = ctx;
    const background = "rgb(10, 10, 10)";
    const gridStroke = "rgba(255,255,255,0.045)";
    const pulseFill = "255,255,255";
    const cursorStroke = "rgba(240,236,228,0.85)";

    let w = 0;
    let h = 0;
    let mx = -999;
    let my = -999;
    let tx = -999;
    let ty = -999;
    let raf: number;
    type Pulse = { col: number; row: number; age: number };
    let pulses: Pulse[] = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      activeCanvas.width = Math.round(w * dpr);
      activeCanvas.height = Math.round(h * dpr);
      activeCanvas.style.width = `${w}px`;
      activeCanvas.style.height = `${h}px`;
      // setTransform resets and scales in one call — safe to call on every resize
      activeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
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

      // + cursor
      activeCtx.strokeStyle = cursorStroke;
      activeCtx.lineWidth = 1.5;
      activeCtx.beginPath();
      activeCtx.moveTo(mx - CURSOR_ARM, my);
      activeCtx.lineTo(mx + CURSOR_ARM, my);
      activeCtx.moveTo(mx, my - CURSOR_ARM);
      activeCtx.lineTo(mx, my + CURSOR_ARM);
      activeCtx.stroke();

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
    </>
  );
}
