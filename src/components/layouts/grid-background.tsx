"use client";

import { useEffect, useRef } from "react";

const CELL = 35;
const WARP_RADIUS = 220;
const WARP_STRENGTH = 55;
const LERP = 0.09;

const GRID_STEP_DESKTOP = 5;
const GRID_STEP_MOBILE = 12;

const MAX_DPR_DESKTOP = 1.5;
const MAX_DPR_MOBILE = 1;

const CURSOR_ARM = 9;
const RETICLE_PAD = 8;
const RETICLE_ARM = 14;
const RETICLE_SELECTOR = "a, button, [role='button'], [data-reticle]";
const LOCK_LERP = 0.18;
const BOX_LERP = 0.22;
const RETICLE_RGB = "240,236,228";

const PULSE_LIFETIME_DESKTOP = 90;
const PULSE_LIFETIME_MOBILE = 55;
const PULSE_ALPHA_DESKTOP = 0.07;
const PULSE_ALPHA_MOBILE = 0.045;
const PULSE_RATE_DESKTOP = 0.052;
const PULSE_RATE_MOBILE = 0.018;

const HOVER_TICK_COOLDOWN = 180;
const CLICK_TICK_COOLDOWN = 70;

// Sound
const SOUND_ENABLED = true;

const TACTILE_HOVER_SOUNDS = [
  {
    type: "triangle" as OscillatorType,
    startFrequency: 520,
    endFrequency: 360,
    volume: 0.012,
    delay: 0,
    duration: 0.028,
  },
  {
    type: "sine" as OscillatorType,
    startFrequency: 640,
    endFrequency: 420,
    volume: 0.011,
    delay: 0,
    duration: 0.026,
  },
  {
    type: "triangle" as OscillatorType,
    startFrequency: 580,
    endFrequency: 390,
    volume: 0.01,
    delay: 0,
    duration: 0.03,
  },
];

const CLICK_SOUND = {
  type: "square" as OscillatorType,
  startFrequency: 220,
  endFrequency: 140,
  volume: 0.026,
  delay: 0,
  duration: 0.045,
};

// Fast white grid snake
const SNAKE_SPAWN_RATE_DESKTOP = 0.05;
const SNAKE_SPAWN_RATE_MOBILE = 0.035;
const SNAKE_MAX_ACTIVE_DESKTOP = 4;
const SNAKE_MAX_ACTIVE_MOBILE = 2;
const SNAKE_SPEED_DESKTOP = 0.4;
const SNAKE_SPEED_MOBILE = 0.9;
const SNAKE_TAIL_LENGTH_DESKTOP = 7;
const SNAKE_TAIL_LENGTH_MOBILE = 5;
const SNAKE_LINE_WIDTH_DESKTOP = 1.35;
const SNAKE_LINE_WIDTH_MOBILE = 1.1;
const SNAKE_HEAD_RADIUS_DESKTOP = 2.3;
const SNAKE_HEAD_RADIUS_MOBILE = 1.8;
const SNAKE_GLOW_BLUR_DESKTOP = 8;
const SNAKE_GLOW_BLUR_MOBILE = 2;

type Pulse = {
  col: number;
  row: number;
  age: number;
};

type GridPoint = {
  col: number;
  row: number;
};

type GridSnake = {
  path: GridPoint[];
  progress: number;
};

type ToneConfig = {
  type: OscillatorType;
  startFrequency?: number;
  endFrequency?: number;
  frequency?: number;
  volume: number;
  delay?: number;
  duration: number;
};

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

    const ctx = canvas.getContext("2d", { alpha: false });
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
    let cols = 0;
    let rows = 0;
    let isMobile = false;
    let hasFinePointer = true;
    let gridStep = GRID_STEP_DESKTOP;

    let mx = -999;
    let my = -999;
    let tx = -999;
    let ty = -999;
    let raf = 0;

    let pulses: Pulse[] = [];
    let snakes: GridSnake[] = [];

    let lockEl: Element | null = null;
    let lastLockEl: Element | null = null;
    let lock = 0;

    const rb = {
      l: -999,
      t: -999,
      r: -999,
      b: -999,
    };

    let audioContext: AudioContext | null = null;
    let lastTickAt = 0;
    let lastClickAt = 0;

    function getAudioContext() {
      audioContext ??= new AudioContext();
      return audioContext;
    }

    function randomBetween(min: number, max: number) {
      return min + Math.random() * (max - min);
    }

    function playTone({
      type,
      startFrequency,
      endFrequency,
      frequency,
      volume,
      delay = 0,
      duration,
    }: ToneConfig) {
      if (!SOUND_ENABLED) return;

      try {
        const audio = getAudioContext();

        if (audio.state === "suspended") {
          void audio.resume();
        }

        const osc = audio.createOscillator();
        const gain = audio.createGain();

        const start = audio.currentTime + delay;
        const end = start + duration;

        osc.type = type;

        if (typeof frequency === "number") {
          osc.frequency.setValueAtTime(frequency, start);
        } else {
          osc.frequency.setValueAtTime(startFrequency ?? 500, start);
          osc.frequency.exponentialRampToValueAtTime(
            endFrequency ?? 300,
            start + duration * 0.7,
          );
        }

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);

        osc.connect(gain);
        gain.connect(audio.destination);

        osc.start(start);
        osc.stop(end);
      } catch {
        // Browser blocked audio.
      }
    }

    function playTactileHover() {
      const preset =
        TACTILE_HOVER_SOUNDS[
          Math.floor(Math.random() * TACTILE_HOVER_SOUNDS.length)
        ];

      const pitchShift = randomBetween(0.94, 1.08);
      const volumeShift = randomBetween(0.85, 1);
      const durationShift = randomBetween(-0.004, 0.004);

      playTone({
        ...preset,
        startFrequency: preset.startFrequency * pitchShift,
        endFrequency: preset.endFrequency * pitchShift,
        volume: preset.volume * volumeShift,
        duration: preset.duration + durationShift,
      });
    }

    function playTactileTick() {
      if (!hasFinePointer) return;

      const now = performance.now();

      if (now - lastTickAt < HOVER_TICK_COOLDOWN) return;

      lastTickAt = now;

      playTactileHover();
    }

    function playTactileClick() {
      const now = performance.now();

      if (now - lastClickAt < CLICK_TICK_COOLDOWN) return;

      lastClickAt = now;

      playTone(CLICK_SOUND);
    }

    function resize() {
      const rawDpr = window.devicePixelRatio || 1;

      w = window.innerWidth;
      h = window.innerHeight;

      isMobile =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches;

      hasFinePointer = window.matchMedia("(pointer: fine)").matches;

      const dpr = Math.min(rawDpr, isMobile ? MAX_DPR_MOBILE : MAX_DPR_DESKTOP);

      gridStep = isMobile ? GRID_STEP_MOBILE : GRID_STEP_DESKTOP;

      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);

      activeCanvas.width = Math.round(w * dpr);
      activeCanvas.height = Math.round(h * dpr);
      activeCanvas.style.width = `${w}px`;
      activeCanvas.style.height = `${h}px`;

      overlayCanvas.width = Math.round(w * dpr);
      overlayCanvas.height = Math.round(h * dpr);
      overlayCanvas.style.width = `${w}px`;
      overlayCanvas.style.height = `${h}px`;

      activeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overlayContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onPointerMove(e: PointerEvent) {
      tx = e.clientX;
      ty = e.clientY;

      const el = e.target as Element | null;
      lockEl = el?.closest(RETICLE_SELECTOR) ?? null;

      if (hasFinePointer && lockEl && lockEl !== lastLockEl) {
        playTactileTick();
      }

      lastLockEl = lockEl;
    }

    function onPointerDown(e: PointerEvent) {
      tx = e.clientX;
      ty = e.clientY;

      mx = e.clientX;
      my = e.clientY;

      const el = e.target as Element | null;
      lockEl = el?.closest(RETICLE_SELECTOR) ?? null;
      lastLockEl = lockEl;

      if (lockEl) {
        playTactileClick();
      }
    }

    function displace(px: number, py: number): [number, number] {
      if (!hasFinePointer) return [0, 0];

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

    function clamp(value: number, min: number, max: number) {
      return Math.max(min, Math.min(max, value));
    }

    function getGridPoint(point: GridPoint) {
      const x = point.col * CELL;
      const y = point.row * CELL;
      const [ox, oy] = displace(x, y);

      return {
        x: x + ox,
        y: y + oy,
      };
    }

    function createSnakePath(): GridPoint[] {
      const edge = Math.floor(Math.random() * 4);

      let start: GridPoint;
      let direction: GridPoint;

      if (edge === 0) {
        start = {
          col: 0,
          row: Math.floor(Math.random() * Math.max(rows, 1)),
        };
        direction = { col: 1, row: 0 };
      } else if (edge === 1) {
        start = {
          col: cols,
          row: Math.floor(Math.random() * Math.max(rows, 1)),
        };
        direction = { col: -1, row: 0 };
      } else if (edge === 2) {
        start = {
          col: Math.floor(Math.random() * Math.max(cols, 1)),
          row: 0,
        };
        direction = { col: 0, row: 1 };
      } else {
        start = {
          col: Math.floor(Math.random() * Math.max(cols, 1)),
          row: rows,
        };
        direction = { col: 0, row: -1 };
      }

      const path: GridPoint[] = [start];

      let current = start;
      let currentDirection = direction;

      while (
        current.col >= 0 &&
        current.col <= cols &&
        current.row >= 0 &&
        current.row <= rows
      ) {
        const turnChance = isMobile ? 0.2 : 0.28;
        const shouldTurn = Math.random() < turnChance;

        if (shouldTurn) {
          if (currentDirection.col !== 0) {
            currentDirection =
              Math.random() < 0.5 ? { col: 0, row: 1 } : { col: 0, row: -1 };
          } else {
            currentDirection =
              Math.random() < 0.5 ? { col: 1, row: 0 } : { col: -1, row: 0 };
          }
        }

        const next = {
          col: current.col + currentDirection.col,
          row: current.row + currentDirection.row,
        };

        if (
          next.col < 0 ||
          next.col > cols ||
          next.row < 0 ||
          next.row > rows
        ) {
          break;
        }

        path.push(next);
        current = next;
      }

      return path;
    }

    function spawnSnake() {
      const maxActive = isMobile
        ? SNAKE_MAX_ACTIVE_MOBILE
        : SNAKE_MAX_ACTIVE_DESKTOP;

      if (snakes.length >= maxActive) return;

      const path = createSnakePath();

      if (path.length < 2) return;

      snakes.push({
        path,
        progress: 0,
      });
    }

    function drawSnakeTrail(snake: GridSnake) {
      const snakeTailLength = isMobile
        ? SNAKE_TAIL_LENGTH_MOBILE
        : SNAKE_TAIL_LENGTH_DESKTOP;

      const snakeLineWidth = isMobile
        ? SNAKE_LINE_WIDTH_MOBILE
        : SNAKE_LINE_WIDTH_DESKTOP;

      const snakeHeadRadius = isMobile
        ? SNAKE_HEAD_RADIUS_MOBILE
        : SNAKE_HEAD_RADIUS_DESKTOP;

      const snakeGlowBlur = isMobile
        ? SNAKE_GLOW_BLUR_MOBILE
        : SNAKE_GLOW_BLUR_DESKTOP;

      const headProgress = snake.progress;
      const tailProgress = Math.max(0, headProgress - snakeTailLength);

      const startIndex = Math.floor(tailProgress);
      const endIndex = Math.min(
        Math.floor(headProgress),
        snake.path.length - 1,
      );

      if (endIndex <= startIndex) return;

      activeCtx.save();
      activeCtx.lineCap = "round";
      activeCtx.lineJoin = "round";

      for (let i = startIndex; i < endIndex; i++) {
        const a = snake.path[i];
        const b = snake.path[i + 1];

        const start = getGridPoint(a);
        const end = getGridPoint(b);

        const segmentAge =
          (i - startIndex) / Math.max(endIndex - startIndex, 1);
        const alpha = 0.08 + segmentAge * 0.9;

        activeCtx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        activeCtx.lineWidth = snakeLineWidth;
        activeCtx.shadowColor = `rgba(255,255,255,${(alpha * 0.45).toFixed(3)})`;
        activeCtx.shadowBlur = snakeGlowBlur;

        activeCtx.beginPath();
        activeCtx.moveTo(start.x, start.y);
        activeCtx.lineTo(end.x, end.y);
        activeCtx.stroke();
      }

      const headIndex = clamp(
        Math.floor(headProgress),
        0,
        snake.path.length - 1,
      );

      const nextIndex = clamp(headIndex + 1, 0, snake.path.length - 1);
      const headT = headProgress - Math.floor(headProgress);

      const headA = getGridPoint(snake.path[headIndex]);
      const headB = getGridPoint(snake.path[nextIndex]);

      const headX = headA.x + (headB.x - headA.x) * headT;
      const headY = headA.y + (headB.y - headA.y) * headT;

      activeCtx.fillStyle = "rgba(255,255,255,1)";
      activeCtx.shadowColor = "rgba(255,255,255,0.85)";
      activeCtx.shadowBlur = snakeGlowBlur + 2;

      activeCtx.beginPath();
      activeCtx.arc(headX, headY, snakeHeadRadius, 0, Math.PI * 2);
      activeCtx.fill();

      activeCtx.restore();
    }

    function updateAndDrawSnakes() {
      const spawnRate = isMobile
        ? SNAKE_SPAWN_RATE_MOBILE
        : SNAKE_SPAWN_RATE_DESKTOP;

      const speed = isMobile ? SNAKE_SPEED_MOBILE : SNAKE_SPEED_DESKTOP;

      const tailLength = isMobile
        ? SNAKE_TAIL_LENGTH_MOBILE
        : SNAKE_TAIL_LENGTH_DESKTOP;

      if (Math.random() < spawnRate) {
        spawnSnake();
      }

      for (const snake of snakes) {
        drawSnakeTrail(snake);
        snake.progress += speed;
      }

      snakes = snakes.filter(
        (snake) => snake.progress < snake.path.length + tailLength,
      );
    }

    function drawGrid() {
      activeCtx.strokeStyle = gridStroke;
      activeCtx.lineWidth = 1;
      activeCtx.beginPath();

      for (let x = 0; x <= w; x += CELL) {
        for (let y = 0; y <= h; y += gridStep) {
          const [ox, oy] = displace(x, y);

          if (y === 0) {
            activeCtx.moveTo(x + ox, y + oy);
          } else {
            activeCtx.lineTo(x + ox, y + oy);
          }
        }
      }

      for (let y = 0; y <= h; y += CELL) {
        for (let x = 0; x <= w; x += gridStep) {
          const [ox, oy] = displace(x, y);

          if (x === 0) {
            activeCtx.moveTo(x + ox, y + oy);
          } else {
            activeCtx.lineTo(x + ox, y + oy);
          }
        }
      }

      activeCtx.stroke();
    }

    function updateAndDrawPulses() {
      const pulseRate = isMobile ? PULSE_RATE_MOBILE : PULSE_RATE_DESKTOP;
      const pulseAlpha = isMobile ? PULSE_ALPHA_MOBILE : PULSE_ALPHA_DESKTOP;

      const pulseLifetime = isMobile
        ? PULSE_LIFETIME_MOBILE
        : PULSE_LIFETIME_DESKTOP;

      if (Math.random() < pulseRate) {
        const col = Math.floor(Math.random() * Math.ceil(w / CELL));
        const row = Math.floor(Math.random() * Math.ceil(h / CELL));
        pulses.push({ col, row, age: 0 });
      }

      for (const p of pulses) {
        const alpha = pulseAlpha * Math.sin((p.age / pulseLifetime) * Math.PI);

        activeCtx.fillStyle = `rgba(${pulseFill},${alpha.toFixed(3)})`;

        const x = p.col * CELL;
        const y = p.row * CELL;

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

      pulses = pulses.filter((p) => p.age < pulseLifetime);
    }

    function drawReticle() {
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
        dl = mx;
        dt = my;
        dr = mx;
        db = my;
      }

      if (rb.l < -900) {
        rb.l = dl;
        rb.t = dt;
        rb.r = dr;
        rb.b = db;
      }

      rb.l += (dl - rb.l) * BOX_LERP;
      rb.t += (dt - rb.t) * BOX_LERP;
      rb.r += (dr - rb.r) * BOX_LERP;
      rb.b += (db - rb.b) * BOX_LERP;

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

      if (lock > 0.01) {
        const arm = Math.min(RETICLE_ARM, (rb.r - rb.l) / 2, (rb.b - rb.t) / 2);

        overlayContext.strokeStyle = `rgba(${RETICLE_RGB},${(0.9 * lock).toFixed(3)})`;
        overlayContext.lineWidth = 1.5;
        overlayContext.beginPath();

        overlayContext.moveTo(rb.l, rb.t + arm);
        overlayContext.lineTo(rb.l, rb.t);
        overlayContext.lineTo(rb.l + arm, rb.t);

        overlayContext.moveTo(rb.r - arm, rb.t);
        overlayContext.lineTo(rb.r, rb.t);
        overlayContext.lineTo(rb.r, rb.t + arm);

        overlayContext.moveTo(rb.r, rb.b - arm);
        overlayContext.lineTo(rb.r, rb.b);
        overlayContext.lineTo(rb.r - arm, rb.b);

        overlayContext.moveTo(rb.l + arm, rb.b);
        overlayContext.lineTo(rb.l, rb.b);
        overlayContext.lineTo(rb.l, rb.b - arm);

        overlayContext.stroke();
      }
    }

    function draw() {
      raf = requestAnimationFrame(draw);

      mx += (tx - mx) * LERP;
      my += (ty - my) * LERP;

      activeCtx.fillStyle = background;
      activeCtx.fillRect(0, 0, w, h);

      drawGrid();
      updateAndDrawPulses();
      updateAndDrawSnakes();
      drawReticle();
    }

    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        return;
      }

      if (!raf) {
        draw();
      }
    }

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("visibilitychange", onVisibilityChange);

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void audioContext?.close();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 0 }}
      />

      <div className="relative z-10">{children}</div>

      <canvas
        ref={overlayRef}
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 250 }}
      />
    </>
  );
}
