"use client";

import gsap from "gsap";
import { useEffect } from "react";

/**
 * The CSS `prefers-reduced-motion` rule in shadcn.css can't reach GSAP's
 * timelines (they're driven by JS, not CSS transitions/animations), so this
 * throttles the whole GSAP engine instead — every tween site-wide still runs,
 * just fast enough to read as instant, without touching each call site.
 */
export function ReducedMotionGuard() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      gsap.globalTimeline.timeScale(mq.matches ? 30 : 1);
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return null;
}
