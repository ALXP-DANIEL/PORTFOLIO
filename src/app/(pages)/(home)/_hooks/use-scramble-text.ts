import { type RefObject, useEffect } from "react";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#01ﾊﾐﾋｰｳ";

/** Animates `el` from its current text to `next` with a decode scramble. */
function scramble(el: HTMLElement, next: string): () => void {
  const old = el.dataset.text ?? el.textContent ?? "";
  el.dataset.text = next;

  const length = Math.max(old.length, next.length);

  const queue = Array.from({ length }, (_, i) => ({
    from: old[i] ?? "",
    to: next[i] ?? "",
    start: Math.floor(Math.random() * 22),
    end: Math.floor(Math.random() * 22) + 12,
    char: "",
  }));

  let frame = 0;
  let raf = 0;

  const tick = () => {
    let out = "";
    let done = 0;

    for (const q of queue) {
      if (frame >= q.start + q.end) {
        done++;
        out += q.to;
      } else if (frame >= q.start) {
        if (!q.char || Math.random() < 0.3) {
          q.char =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }

        out += `<span class="text-foreground/25">${q.char}</span>`;
      } else {
        out += q.from;
      }
    }

    el.innerHTML = out;

    if (done < queue.length) {
      frame++;
      raf = requestAnimationFrame(tick);
    }
  };

  tick();

  return () => cancelAnimationFrame(raf);
}

/**
 * Cycles the referenced element through `phrases`, scrambling between each.
 * Seeds the first phrase immediately so the cycle decodes into the next.
 */
export function useScrambleText<T extends HTMLElement>(
  ref: RefObject<T | null>,
  phrases: readonly string[],
  intervalMs = 2900,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || phrases.length === 0) return;

    el.dataset.text = phrases[0];

    let i = 0;
    let cancel: (() => void) | undefined;

    const id = window.setInterval(() => {
      i = (i + 1) % phrases.length;
      cancel?.();
      cancel = scramble(el, phrases[i]);
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      cancel?.();
    };
  }, [ref, phrases, intervalMs]);
}
