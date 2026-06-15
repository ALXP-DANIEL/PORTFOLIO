import {
  BOX_LERP,
  CURSOR_ARM,
  LOCK_LERP,
  RETICLE_ARM,
  RETICLE_PAD,
  RETICLE_RGB,
} from "./grid-background.constants";
import type { GridScene } from "./grid-background.scene";

/**
 * Draws the cursor crosshair, easing into a corner-bracket box that locks
 * onto the hovered target. Mutates `scene.lock` and `scene.rb` each frame.
 */
export function drawReticle(scene: GridScene) {
  const { overlayCtx, rb } = scene;

  overlayCtx.clearRect(0, 0, scene.w, scene.h);

  const hasTarget = scene.lockEl !== null && document.contains(scene.lockEl);

  scene.lock += ((hasTarget ? 1 : 0) - scene.lock) * LOCK_LERP;

  let dl: number;
  let dt: number;
  let dr: number;
  let db: number;

  if (hasTarget && scene.lockEl) {
    const r = scene.lockEl.getBoundingClientRect();

    dl = r.left - RETICLE_PAD;
    dt = r.top - RETICLE_PAD;
    dr = r.right + RETICLE_PAD;
    db = r.bottom + RETICLE_PAD;
  } else {
    dl = scene.mx;
    dt = scene.my;
    dr = scene.mx;
    db = scene.my;
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

  const chAlpha = 1 - scene.lock;

  if (chAlpha > 0.01) {
    overlayCtx.strokeStyle = `rgba(${RETICLE_RGB},${(0.85 * chAlpha).toFixed(3)})`;
    overlayCtx.lineWidth = 1.5;
    overlayCtx.beginPath();
    overlayCtx.moveTo(scene.mx - CURSOR_ARM, scene.my);
    overlayCtx.lineTo(scene.mx + CURSOR_ARM, scene.my);
    overlayCtx.moveTo(scene.mx, scene.my - CURSOR_ARM);
    overlayCtx.lineTo(scene.mx, scene.my + CURSOR_ARM);
    overlayCtx.stroke();
  }

  if (scene.lock > 0.01) {
    const arm = Math.min(RETICLE_ARM, (rb.r - rb.l) / 2, (rb.b - rb.t) / 2);

    overlayCtx.strokeStyle = `rgba(${RETICLE_RGB},${(0.9 * scene.lock).toFixed(3)})`;
    overlayCtx.lineWidth = 1.5;
    overlayCtx.beginPath();

    overlayCtx.moveTo(rb.l, rb.t + arm);
    overlayCtx.lineTo(rb.l, rb.t);
    overlayCtx.lineTo(rb.l + arm, rb.t);

    overlayCtx.moveTo(rb.r - arm, rb.t);
    overlayCtx.lineTo(rb.r, rb.t);
    overlayCtx.lineTo(rb.r, rb.t + arm);

    overlayCtx.moveTo(rb.r, rb.b - arm);
    overlayCtx.lineTo(rb.r, rb.b);
    overlayCtx.lineTo(rb.r - arm, rb.b);

    overlayCtx.moveTo(rb.l + arm, rb.b);
    overlayCtx.lineTo(rb.l, rb.b);
    overlayCtx.lineTo(rb.l, rb.b - arm);

    overlayCtx.stroke();
  }
}
