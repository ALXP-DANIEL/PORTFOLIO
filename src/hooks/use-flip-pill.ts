"use client";

import gsap from "gsap";
import { type RefObject, useLayoutEffect, useRef } from "react";

type Rect = { left: number; top: number; width: number; height: number };

/**
 * Lightweight manual FLIP for a pill-style active indicator that mounts
 * under a different parent each time `key` changes (e.g. the active nav
 * link). Measures the new position, diffs it against the last known rect,
 * and plays the inverse transform back to rest — replaces Motion's
 * `layoutId` shared-layout animation without a dependency on it.
 */
export function useFlipPill<T extends HTMLElement>(
  ref: RefObject<T | null>,
  key: string | number,
  {
    duration = 0.35,
    ease = "power3.out",
  }: { duration?: number; ease?: string } = {},
) {
  const lastRect = useRef<Rect | null>(null);
  const lastKey = useRef<string | number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: duration/ease/ref are stable per call site; only `key` should retrigger the FLIP measurement
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isSameInstance = lastKey.current === key;
    lastKey.current = key;

    if (!lastRect.current || isSameInstance) {
      lastRect.current = rect;
      return;
    }

    const prev = lastRect.current;
    lastRect.current = rect;

    const dx = prev.left - rect.left;
    const dy = prev.top - rect.top;
    const scaleX = rect.width > 0 ? prev.width / rect.width : 1;
    const scaleY = rect.height > 0 ? prev.height / rect.height : 1;

    gsap.fromTo(
      el,
      { x: dx, y: dy, scaleX, scaleY },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, duration, ease },
    );
  }, [key]);
}
