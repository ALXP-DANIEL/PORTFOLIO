import {
  CELL,
  type GridPoint,
  type GridSnake,
  type Pulse,
  WARP_RADIUS,
  WARP_STRENGTH,
} from "./grid-background.constants";

/**
 * Mutable per-frame state shared by every renderer. Fields are read and
 * written across modules, so the scene is passed by reference — primitives
 * live on the object (e.g. `scene.mx`), never as detached locals.
 */
export type GridScene = {
  ctx: CanvasRenderingContext2D;
  overlayCtx: CanvasRenderingContext2D;

  w: number;
  h: number;
  cols: number;
  rows: number;
  isMobile: boolean;
  hasFinePointer: boolean;
  gridStep: number;

  // smoothed cursor (mx/my) chasing the raw target (tx/ty)
  mx: number;
  my: number;
  tx: number;
  ty: number;

  pulses: Pulse[];
  snakes: GridSnake[];

  // reticle lock-on target + smoothed bounding box
  lockEl: Element | null;
  lock: number;
  rb: { l: number; t: number; r: number; b: number };
};

/** Cursor warp displacement applied to a point, near the pointer only. */
export function displace(
  scene: GridScene,
  px: number,
  py: number,
): [number, number] {
  if (!scene.hasFinePointer) return [0, 0];

  const dx = px - scene.mx;
  const dy = py - scene.my;
  const d = Math.sqrt(dx * dx + dy * dy);

  if (d === 0 || d > WARP_RADIUS) return [0, 0];

  const falloff = (1 - d / WARP_RADIUS) ** 2;

  return [
    (dx / d) * WARP_STRENGTH * falloff,
    (dy / d) * WARP_STRENGTH * falloff,
  ];
}

/** A grid cell coordinate resolved to warped pixel space. */
export function getGridPoint(scene: GridScene, point: GridPoint) {
  const x = point.col * CELL;
  const y = point.row * CELL;
  const [ox, oy] = displace(scene, x, y);

  return {
    x: x + ox,
    y: y + oy,
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
