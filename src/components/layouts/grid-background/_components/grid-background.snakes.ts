import {
  type GridPoint,
  type GridSnake,
  SNAKE_GLOW_BLUR_DESKTOP,
  SNAKE_GLOW_BLUR_MOBILE,
  SNAKE_HEAD_RADIUS_DESKTOP,
  SNAKE_HEAD_RADIUS_MOBILE,
  SNAKE_LINE_WIDTH_DESKTOP,
  SNAKE_LINE_WIDTH_MOBILE,
  SNAKE_MAX_ACTIVE_DESKTOP,
  SNAKE_MAX_ACTIVE_MOBILE,
  SNAKE_SPAWN_RATE_DESKTOP,
  SNAKE_SPAWN_RATE_MOBILE,
  SNAKE_SPEED_DESKTOP,
  SNAKE_SPEED_MOBILE,
  SNAKE_TAIL_LENGTH_DESKTOP,
  SNAKE_TAIL_LENGTH_MOBILE,
} from "./grid-background.constants";
import { clamp, type GridScene, getGridPoint } from "./grid-background.scene";

/** Builds a random orthogonal snake path starting from a screen edge. */
function createSnakePath(scene: GridScene): GridPoint[] {
  const { cols, rows } = scene;
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
    const turnChance = scene.isMobile ? 0.2 : 0.28;
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

    if (next.col < 0 || next.col > cols || next.row < 0 || next.row > rows) {
      break;
    }

    path.push(next);
    current = next;
  }

  return path;
}

function spawnSnake(scene: GridScene) {
  const maxActive = scene.isMobile
    ? SNAKE_MAX_ACTIVE_MOBILE
    : SNAKE_MAX_ACTIVE_DESKTOP;

  if (scene.snakes.length >= maxActive) return;

  const path = createSnakePath(scene);

  if (path.length < 2) return;

  scene.snakes.push({
    path,
    progress: 0,
  });
}

function drawSnakeTrail(scene: GridScene, snake: GridSnake) {
  const { ctx } = scene;

  const snakeTailLength = scene.isMobile
    ? SNAKE_TAIL_LENGTH_MOBILE
    : SNAKE_TAIL_LENGTH_DESKTOP;

  const snakeLineWidth = scene.isMobile
    ? SNAKE_LINE_WIDTH_MOBILE
    : SNAKE_LINE_WIDTH_DESKTOP;

  const snakeHeadRadius = scene.isMobile
    ? SNAKE_HEAD_RADIUS_MOBILE
    : SNAKE_HEAD_RADIUS_DESKTOP;

  const snakeGlowBlur = scene.isMobile
    ? SNAKE_GLOW_BLUR_MOBILE
    : SNAKE_GLOW_BLUR_DESKTOP;

  const headProgress = snake.progress;
  const tailProgress = Math.max(0, headProgress - snakeTailLength);

  const startIndex = Math.floor(tailProgress);
  const endIndex = Math.min(Math.floor(headProgress), snake.path.length - 1);

  if (endIndex <= startIndex) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = startIndex; i < endIndex; i++) {
    const a = snake.path[i];
    const b = snake.path[i + 1];

    const start = getGridPoint(scene, a);
    const end = getGridPoint(scene, b);

    const segmentAge = (i - startIndex) / Math.max(endIndex - startIndex, 1);
    const alpha = 0.08 + segmentAge * 0.9;

    ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.lineWidth = snakeLineWidth;
    ctx.shadowColor = `rgba(255,255,255,${(alpha * 0.45).toFixed(3)})`;
    ctx.shadowBlur = snakeGlowBlur;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  const headIndex = clamp(Math.floor(headProgress), 0, snake.path.length - 1);

  const nextIndex = clamp(headIndex + 1, 0, snake.path.length - 1);
  const headT = headProgress - Math.floor(headProgress);

  const headA = getGridPoint(scene, snake.path[headIndex]);
  const headB = getGridPoint(scene, snake.path[nextIndex]);

  const headX = headA.x + (headB.x - headA.x) * headT;
  const headY = headA.y + (headB.y - headA.y) * headT;

  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.shadowColor = "rgba(255,255,255,0.85)";
  ctx.shadowBlur = snakeGlowBlur + 2;

  ctx.beginPath();
  ctx.arc(headX, headY, snakeHeadRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Spawns, advances, draws, and prunes the fast white grid snakes. */
export function updateAndDrawSnakes(scene: GridScene) {
  const spawnRate = scene.isMobile
    ? SNAKE_SPAWN_RATE_MOBILE
    : SNAKE_SPAWN_RATE_DESKTOP;

  const speed = scene.isMobile ? SNAKE_SPEED_MOBILE : SNAKE_SPEED_DESKTOP;

  const tailLength = scene.isMobile
    ? SNAKE_TAIL_LENGTH_MOBILE
    : SNAKE_TAIL_LENGTH_DESKTOP;

  if (Math.random() < spawnRate) {
    spawnSnake(scene);
  }

  for (const snake of scene.snakes) {
    drawSnakeTrail(scene, snake);
    snake.progress += speed;
  }

  scene.snakes = scene.snakes.filter(
    (snake) => snake.progress < snake.path.length + tailLength,
  );
}
