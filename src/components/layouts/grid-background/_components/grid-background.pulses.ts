import {
  CELL,
  PULSE_ALPHA_DESKTOP,
  PULSE_ALPHA_MOBILE,
  PULSE_FILL,
  PULSE_LIFETIME_DESKTOP,
  PULSE_LIFETIME_MOBILE,
  PULSE_RATE_DESKTOP,
  PULSE_RATE_MOBILE,
} from "./grid-background.constants";
import { displace, type GridScene } from "./grid-background.scene";

/** Spawns, ages, and fills the faint cell pulses; prunes the dead ones. */
export function updateAndDrawPulses(scene: GridScene) {
  const { ctx } = scene;

  const pulseRate = scene.isMobile ? PULSE_RATE_MOBILE : PULSE_RATE_DESKTOP;
  const pulseAlpha = scene.isMobile ? PULSE_ALPHA_MOBILE : PULSE_ALPHA_DESKTOP;

  const pulseLifetime = scene.isMobile
    ? PULSE_LIFETIME_MOBILE
    : PULSE_LIFETIME_DESKTOP;

  if (Math.random() < pulseRate) {
    const col = Math.floor(Math.random() * Math.ceil(scene.w / CELL));
    const row = Math.floor(Math.random() * Math.ceil(scene.h / CELL));
    scene.pulses.push({ col, row, age: 0 });
  }

  for (const p of scene.pulses) {
    const alpha = pulseAlpha * Math.sin((p.age / pulseLifetime) * Math.PI);

    ctx.fillStyle = `rgba(${PULSE_FILL},${alpha.toFixed(3)})`;

    const x = p.col * CELL;
    const y = p.row * CELL;

    const [ox0, oy0] = displace(scene, x, y);
    const [ox1, oy1] = displace(scene, x + CELL, y);
    const [ox2, oy2] = displace(scene, x + CELL, y + CELL);
    const [ox3, oy3] = displace(scene, x, y + CELL);

    ctx.beginPath();
    ctx.moveTo(x + ox0, y + oy0);
    ctx.lineTo(x + CELL + ox1, y + oy1);
    ctx.lineTo(x + CELL + ox2, y + CELL + oy2);
    ctx.lineTo(x + ox3, y + CELL + oy3);
    ctx.closePath();
    ctx.fill();

    p.age++;
  }

  scene.pulses = scene.pulses.filter((p) => p.age < pulseLifetime);
}
