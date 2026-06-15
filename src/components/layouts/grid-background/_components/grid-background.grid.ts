import { CELL, GRID_STROKE } from "./grid-background.constants";
import { displace, type GridScene } from "./grid-background.scene";

/** Draws the warped base grid (vertical then horizontal lines). */
export function drawGrid(scene: GridScene) {
  const { ctx } = scene;

  ctx.strokeStyle = GRID_STROKE;
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let x = 0; x <= scene.w; x += CELL) {
    for (let y = 0; y <= scene.h; y += scene.gridStep) {
      const [ox, oy] = displace(scene, x, y);

      if (y === 0) {
        ctx.moveTo(x + ox, y + oy);
      } else {
        ctx.lineTo(x + ox, y + oy);
      }
    }
  }

  for (let y = 0; y <= scene.h; y += CELL) {
    for (let x = 0; x <= scene.w; x += scene.gridStep) {
      const [ox, oy] = displace(scene, x, y);

      if (x === 0) {
        ctx.moveTo(x + ox, y + oy);
      } else {
        ctx.lineTo(x + ox, y + oy);
      }
    }
  }

  ctx.stroke();
}
