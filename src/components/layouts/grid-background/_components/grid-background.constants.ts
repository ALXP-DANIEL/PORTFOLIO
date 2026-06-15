// Tuning constants and shared types for the interactive grid background.

export const BACKGROUND = "rgb(10, 10, 10)";
export const GRID_STROKE = "rgba(255,255,255,0.045)";
export const PULSE_FILL = "255,255,255";

export const CELL = 35;
export const WARP_RADIUS = 220;
export const WARP_STRENGTH = 55;
export const LERP = 0.09;

export const GRID_STEP_DESKTOP = 5;
export const GRID_STEP_MOBILE = 12;

export const MAX_DPR_DESKTOP = 1.5;
export const MAX_DPR_MOBILE = 1;

export const CURSOR_ARM = 9;
export const RETICLE_PAD = 8;
export const RETICLE_ARM = 14;
export const RETICLE_SELECTOR = "a, button, [role='button'], [data-reticle]";
export const LOCK_LERP = 0.18;
export const BOX_LERP = 0.22;
export const RETICLE_RGB = "240,236,228";

export const PULSE_LIFETIME_DESKTOP = 90;
export const PULSE_LIFETIME_MOBILE = 55;
export const PULSE_ALPHA_DESKTOP = 0.07;
export const PULSE_ALPHA_MOBILE = 0.045;
export const PULSE_RATE_DESKTOP = 0.052;
export const PULSE_RATE_MOBILE = 0.018;

export const HOVER_TICK_COOLDOWN = 180;
export const CLICK_TICK_COOLDOWN = 70;

// Sound
export const SOUND_ENABLED = true;

export const TACTILE_HOVER_SOUNDS = [
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

export const CLICK_SOUND = {
  type: "square" as OscillatorType,
  startFrequency: 220,
  endFrequency: 140,
  volume: 0.026,
  delay: 0,
  duration: 0.045,
};

// Fast white grid snake
export const SNAKE_SPAWN_RATE_DESKTOP = 0.05;
export const SNAKE_SPAWN_RATE_MOBILE = 0.035;
export const SNAKE_MAX_ACTIVE_DESKTOP = 4;
export const SNAKE_MAX_ACTIVE_MOBILE = 2;
export const SNAKE_SPEED_DESKTOP = 0.4;
export const SNAKE_SPEED_MOBILE = 0.9;
export const SNAKE_TAIL_LENGTH_DESKTOP = 7;
export const SNAKE_TAIL_LENGTH_MOBILE = 5;
export const SNAKE_LINE_WIDTH_DESKTOP = 1.35;
export const SNAKE_LINE_WIDTH_MOBILE = 1.1;
export const SNAKE_HEAD_RADIUS_DESKTOP = 2.3;
export const SNAKE_HEAD_RADIUS_MOBILE = 1.8;
export const SNAKE_GLOW_BLUR_DESKTOP = 8;
export const SNAKE_GLOW_BLUR_MOBILE = 2;

export type Pulse = {
  col: number;
  row: number;
  age: number;
};

export type GridPoint = {
  col: number;
  row: number;
};

export type GridSnake = {
  path: GridPoint[];
  progress: number;
};

export type ToneConfig = {
  type: OscillatorType;
  startFrequency?: number;
  endFrequency?: number;
  frequency?: number;
  volume: number;
  delay?: number;
  duration: number;
};
