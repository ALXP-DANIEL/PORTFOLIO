"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { createGridAudio } from "./_components/grid-background.audio";
import {
  CELL,
  GRID_STEP_DESKTOP,
  GRID_STEP_MOBILE,
  GRID_THEME,
  type GridThemeColors,
  LERP,
  MAX_DPR_DESKTOP,
  MAX_DPR_MOBILE,
  MOBILE_FRAME_MS,
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

  const { resolvedTheme } = useTheme();
  const colorsRef = useRef(GRID_THEME.dark);
  colorsRef.current =
    resolvedTheme === "light" ? GRID_THEME.light : GRID_THEME.dark;

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;

    if (!canvas || !overlay) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    const overlayCtx = overlay.getContext("2d");

    if (!ctx || !overlayCtx) return;

    document.documentElement.dataset.cursorReady = "true";

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
      colors: colorsRef.current,
      mx: -999,
      my: -999,
      tx: -999,
      ty: -999,
      pulses: [],
      snakes: [],
      lockEl: null,
      lock: 0,
      rb: { l: -999, t: -999, r: -999, b: -999 },
      step: 1,
    };

    // Without a fine pointer nothing warps the grid, so it is drawn once into
    // an offscreen canvas and blitted each frame instead of re-stroked.
    let gridCache: HTMLCanvasElement | null = null;
    let gridCacheColors: GridThemeColors | null = null;
    let dpr = 1;
    let lastFrame = 0;

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

      dpr = Math.min(rawDpr, scene.isMobile ? MAX_DPR_MOBILE : MAX_DPR_DESKTOP);

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

      // Touch devices never see the reticle; drop its full-screen layer.
      activeOverlay.style.display = scene.hasFinePointer ? "" : "none";
      scene.step = scene.isMobile ? 2 : 1;
      gridCache = null;
    }

    function buildGridCache() {
      const cache = document.createElement("canvas");
      cache.width = Math.round(scene.w * dpr);
      cache.height = Math.round(scene.h * dpr);
      const cacheCtx = cache.getContext("2d", { alpha: false });
      if (!cacheCtx) return null;
      cacheCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cacheCtx.fillStyle = scene.colors.background;
      cacheCtx.fillRect(0, 0, scene.w, scene.h);
      drawGrid({ ...scene, ctx: cacheCtx });
      gridCacheColors = scene.colors;
      return cache;
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

    function draw(now = performance.now()) {
      raf = requestAnimationFrame(draw);

      // Phones run the ambient animation at 30fps (each frame advances two
      // steps) to leave headroom for scrolling and page animations.
      if (scene.isMobile && now - lastFrame < MOBILE_FRAME_MS) return;
      lastFrame = now;

      scene.mx += (scene.tx - scene.mx) * LERP;
      scene.my += (scene.ty - scene.my) * LERP;

      scene.colors = colorsRef.current;

      if (scene.hasFinePointer) {
        activeCtx.fillStyle = scene.colors.background;
        activeCtx.fillRect(0, 0, scene.w, scene.h);
        drawGrid(scene);
      } else {
        if (!gridCache || gridCacheColors !== scene.colors) {
          gridCache = buildGridCache();
        }
        if (gridCache) activeCtx.drawImage(gridCache, 0, 0, scene.w, scene.h);
      }

      updateAndDrawPulses(scene);
      updateAndDrawSnakes(scene);
      if (scene.hasFinePointer) drawReticle(scene);
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
      delete document.documentElement.dataset.cursorReady;
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
        className="site-reticle pointer-events-none fixed inset-0 transition-opacity duration-200"
        style={{ zIndex: 250 }}
      />
    </>
  );
}
