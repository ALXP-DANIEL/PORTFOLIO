"use client";

import { useEffect, useRef } from "react";
import { createGridAudio } from "./_components/grid-background.audio";
import {
  BACKGROUND,
  CELL,
  GRID_STEP_DESKTOP,
  GRID_STEP_MOBILE,
  LERP,
  MAX_DPR_DESKTOP,
  MAX_DPR_MOBILE,
  RETICLE_SELECTOR,
} from "./_components/grid-background.constants";
import { drawGrid } from "./_components/grid-background.grid";
import { updateAndDrawPulses } from "./_components/grid-background.pulses";
import { drawReticle } from "./_components/grid-background.reticle";
import type { GridScene } from "./_components/grid-background.scene";
import { updateAndDrawSnakes } from "./_components/grid-background.snakes";

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

    // narrowed consts so the closures below see non-null types
    const activeCanvas = canvas;
    const activeOverlay = overlay;
    const activeCtx = ctx;
    const activeOverlayCtx = overlayCtx;

    const scene: GridScene = {
      ctx: activeCtx,
      overlayCtx: activeOverlayCtx,
      w: 0,
      h: 0,
      cols: 0,
      rows: 0,
      isMobile: false,
      hasFinePointer: true,
      gridStep: GRID_STEP_DESKTOP,
      mx: -999,
      my: -999,
      tx: -999,
      ty: -999,
      pulses: [],
      snakes: [],
      lockEl: null,
      lock: 0,
      rb: { l: -999, t: -999, r: -999, b: -999 },
    };

    let raf = 0;
    let lastLockEl: Element | null = null;

    const audio = createGridAudio(() => scene.hasFinePointer);

    function resize() {
      const rawDpr = window.devicePixelRatio || 1;

      scene.w = window.innerWidth;
      scene.h = window.innerHeight;

      scene.isMobile =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches;

      scene.hasFinePointer = window.matchMedia("(pointer: fine)").matches;

      const dpr = Math.min(
        rawDpr,
        scene.isMobile ? MAX_DPR_MOBILE : MAX_DPR_DESKTOP,
      );

      scene.gridStep = scene.isMobile ? GRID_STEP_MOBILE : GRID_STEP_DESKTOP;

      scene.cols = Math.ceil(scene.w / CELL);
      scene.rows = Math.ceil(scene.h / CELL);

      activeCanvas.width = Math.round(scene.w * dpr);
      activeCanvas.height = Math.round(scene.h * dpr);
      activeCanvas.style.width = `${scene.w}px`;
      activeCanvas.style.height = `${scene.h}px`;

      activeOverlay.width = Math.round(scene.w * dpr);
      activeOverlay.height = Math.round(scene.h * dpr);
      activeOverlay.style.width = `${scene.w}px`;
      activeOverlay.style.height = `${scene.h}px`;

      activeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      activeOverlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onPointerMove(e: PointerEvent) {
      scene.tx = e.clientX;
      scene.ty = e.clientY;

      const el = e.target as Element | null;
      scene.lockEl = el?.closest(RETICLE_SELECTOR) ?? null;

      if (scene.hasFinePointer && scene.lockEl && scene.lockEl !== lastLockEl) {
        audio.playTactileTick();
      }

      lastLockEl = scene.lockEl;
    }

    function onPointerDown(e: PointerEvent) {
      scene.tx = e.clientX;
      scene.ty = e.clientY;

      scene.mx = e.clientX;
      scene.my = e.clientY;

      const el = e.target as Element | null;
      scene.lockEl = el?.closest(RETICLE_SELECTOR) ?? null;
      lastLockEl = scene.lockEl;

      if (scene.lockEl) {
        audio.playTactileClick();
      }
    }

    function draw() {
      raf = requestAnimationFrame(draw);

      scene.mx += (scene.tx - scene.mx) * LERP;
      scene.my += (scene.ty - scene.my) * LERP;

      activeCtx.fillStyle = BACKGROUND;
      activeCtx.fillRect(0, 0, scene.w, scene.h);

      drawGrid(scene);
      updateAndDrawPulses(scene);
      updateAndDrawSnakes(scene);
      drawReticle(scene);
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
      audio.close();
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
