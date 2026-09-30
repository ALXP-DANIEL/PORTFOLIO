"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CardBack, CardFront } from "./card-faces";

/** Resting distance from the strap anchor to the card's clip, in px. */
const STRAP_LENGTH = 220;
/** How far the strap may stretch before it pulls the card back. */
const MAX_STRETCH = 1.35;
const SPRING = 38;
const DAMPING = 5.5;
const DRAG_THRESHOLD = 6;
const STRAP_TEXT = "ALXP-DANIEL · FULL-STACK WEB DEVELOPER · ".repeat(6);

type Vec = { x: number; y: number };

/**
 * A business card hanging from a lanyard. Drag and throw it and it springs
 * back on its strap; hover tilts it towards the pointer with a moving glare;
 * a click (or Enter/Space) flips it over.
 */
export default function LanyardCard({
  flipped,
  onFlip,
}: {
  flipped: boolean;
  onFlip: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<SVGPathElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  // Physics state lives in refs so the rAF loop never re-renders React.
  const sim = useRef({
    pos: { x: 0, y: -60 } as Vec,
    vel: { x: 90, y: 0 } as Vec,
    tilt: { x: 0, y: 0 } as Vec,
    tiltTarget: { x: 0, y: 0 } as Vec,
    drag: null as null | {
      pointerId: number;
      start: Vec;
      origin: Vec;
      last: Vec;
      lastTime: number;
    },
    reduced: false,
  });

  useEffect(() => {
    const state = sim.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    state.reduced = media.matches;
    if (state.reduced) {
      state.pos = { x: 0, y: 0 };
      state.vel = { x: 0, y: 0 };
    }

    let frame = 0;
    let previous = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 1 / 30);
      previous = now;
      const { pos, vel, tilt, tiltTarget } = state;

      if (!state.drag) {
        vel.x += (-SPRING * pos.x - DAMPING * vel.x) * dt;
        vel.y += (-SPRING * pos.y - DAMPING * vel.y) * dt;
        pos.x += vel.x * dt;
        pos.y += vel.y * dt;
      }

      // Keep the clip on a tether: never further from the anchor than the
      // strap can stretch.
      const reach = { x: pos.x, y: STRAP_LENGTH + pos.y };
      const distance = Math.hypot(reach.x, reach.y);
      const limit = STRAP_LENGTH * MAX_STRETCH;
      if (distance > limit) {
        const scale = limit / distance;
        pos.x = reach.x * scale;
        pos.y = reach.y * scale - STRAP_LENGTH;
      }

      // Swing: the card leans away from the direction it's travelling.
      const swing = Math.max(
        -40,
        Math.min(
          40,
          Math.atan2(pos.x, STRAP_LENGTH + pos.y) * 57.3 * 0.6 - vel.x * 0.03,
        ),
      );

      const ease = state.reduced ? 1 : 0.14;
      tilt.x += (tiltTarget.x - tilt.x) * ease;
      tilt.y += (tiltTarget.y - tilt.y) * ease;

      const rig = rigRef.current;
      const inner = tiltRef.current;
      const strap = strapRef.current;
      const stage = stageRef.current;

      if (rig) {
        rig.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${swing}deg)`;
      }
      if (inner) {
        inner.style.transform = `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;
      }
      if (strap && stage) {
        const anchor = { x: stage.clientWidth / 2, y: 0 };
        const clip = { x: anchor.x + pos.x, y: STRAP_LENGTH + pos.y };
        const span = Math.hypot(clip.x - anchor.x, clip.y - anchor.y);
        const slack = Math.max(0, STRAP_LENGTH - span);
        const control = {
          x: (anchor.x + clip.x) / 2 - vel.x * 0.04,
          y: (anchor.y + clip.y) / 2 + slack * 0.9,
        };
        strap.setAttribute(
          "d",
          `M ${anchor.x} ${anchor.y} Q ${control.x} ${control.y} ${clip.x} ${clip.y}`,
        );
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    const state = sim.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    movedRef.current = false;
    state.drag = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: { ...state.pos },
      last: { x: event.clientX, y: event.clientY },
      lastTime: performance.now(),
    };
    state.vel = { x: 0, y: 0 };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const state = sim.current;
    const drag = state.drag;

    if (drag && drag.pointerId === event.pointerId) {
      const dx = event.clientX - drag.start.x;
      const dy = event.clientY - drag.start.y;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) movedRef.current = true;

      const now = performance.now();
      const elapsed = Math.max(now - drag.lastTime, 1) / 1000;
      // Smoothed throw velocity from recent pointer motion.
      state.vel = {
        x: state.vel.x * 0.6 + ((event.clientX - drag.last.x) / elapsed) * 0.4,
        y: state.vel.y * 0.6 + ((event.clientY - drag.last.y) / elapsed) * 0.4,
      };
      drag.last = { x: event.clientX, y: event.clientY };
      drag.lastTime = now;

      state.pos = { x: drag.origin.x + dx, y: drag.origin.y + dy };
      state.tiltTarget = {
        x: Math.max(-25, Math.min(25, -state.vel.y * 0.02)),
        y: Math.max(-25, Math.min(25, state.vel.x * 0.02)),
      };
      return;
    }

    if (event.pointerType !== "mouse" || state.reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    state.tiltTarget = { x: (0.5 - ny) * 16, y: (nx - 0.5) * 22 };
    glareRef.current?.style.setProperty("--gx", `${nx * 100}%`);
    glareRef.current?.style.setProperty("--gy", `${ny * 100}%`);
  };

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const state = sim.current;
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    // A pointer that stopped before letting go shouldn't fling the card.
    if (performance.now() - state.drag.lastTime > 80) {
      state.vel = { x: 0, y: 0 };
    }
    state.drag = null;
    state.tiltTarget = { x: 0, y: 0 };
    setDragging(false);
  };

  const onPointerLeave = () => {
    if (!sim.current.drag) sim.current.tiltTarget = { x: 0, y: 0 };
  };

  return (
    <div
      ref={stageRef}
      className="relative mx-auto h-[500px] w-full sm:h-[720px]"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <path
          ref={strapRef}
          id="lanyard-strap"
          fill="none"
          stroke="#141414"
          strokeWidth="26"
          strokeLinecap="butt"
          className="dark:stroke-[#1c1c1c]"
        />
        <text
          fill="#e5e5e5"
          fontSize="9"
          letterSpacing="2"
          dominantBaseline="central"
          className="font-mono"
        >
          <textPath href="#lanyard-strap">{STRAP_TEXT}</textPath>
        </text>
      </svg>

      {/* positioned at the clip point; the rig pivots around it */}
      <div className="absolute left-1/2" style={{ top: STRAP_LENGTH }}>
        <div
          ref={rigRef}
          className="relative -translate-x-1/2 will-change-transform"
          style={{ transformOrigin: "50% 0" }}
        >
          {/* metal clip */}
          <div className="mx-auto h-5 w-12 rounded-t-md rounded-b-sm border border-neutral-400/60 bg-linear-to-b from-neutral-200 to-neutral-400 shadow-sm dark:border-neutral-500/60 dark:from-neutral-400 dark:to-neutral-600" />

          <button
            type="button"
            aria-label={`Business card, ${flipped ? "back" : "front"} side. Press to flip.`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={onPointerLeave}
            onClick={() => {
              if (!movedRef.current) onFlip();
            }}
            className={cn(
              "@container relative -mt-1 block aspect-[90/54] text-left w-[min(86vw,520px)] touch-none rounded-[2.4cqw] select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500",
              dragging ? "cursor-grabbing" : "cursor-grab",
            )}
            style={{ perspective: "1200px" }}
          >
            <div
              ref={tiltRef}
              className="absolute inset-0 transform-3d will-change-transform"
            >
              <div
                className="absolute inset-0 transform-3d transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
              >
                <CardFront />
                <CardBack />
              </div>

              <div
                ref={glareRef}
                className="pointer-events-none absolute inset-0 rounded-[2.4cqw] opacity-60 mix-blend-soft-light"
                style={{
                  background:
                    "radial-gradient(circle at var(--gx, 30%) var(--gy, 20%), rgba(255,255,255,0.55), transparent 55%)",
                  transform: "translateZ(1px)",
                }}
              />
            </div>
          </button>

          <div
            aria-hidden
            className="mx-auto mt-6 h-6 w-[70%] rounded-[50%] bg-black/25 blur-xl dark:bg-black/60"
          />
        </div>
      </div>
    </div>
  );
}
