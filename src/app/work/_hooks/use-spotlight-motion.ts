import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type RefObject, useEffect, useRef } from "react";
import { useSplashGsap } from "@/hooks/use-splash-gsap";

const AUTOPLAY_MS = 5600;

type SpotlightMotionArgs = {
  rootRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  coverRef: RefObject<HTMLDivElement | null>;
  fillRef: RefObject<HTMLSpanElement | null>;
  active: number;
  count: number;
  paused: boolean;
  setActive: (updater: (a: number) => number) => void;
  setPaused: (paused: boolean) => void;
};

/**
 * Drives the spotlight carousel: autoplay timer, per-slide progress fill,
 * panel + content entrance, and pointer parallax on the cover. Pausing is
 * shared so hovering the panel holds both the timer and the fill.
 */
export function useSpotlightMotion({
  rootRef,
  contentRef,
  coverRef,
  fillRef,
  active,
  count,
  paused,
  setActive,
  setPaused,
}: SpotlightMotionArgs) {
  const fillTween = useRef<gsap.core.Tween | null>(null);

  // autoplay — a self-rescheduling timeout stays in sync with the progress fill.
  // `active` is an intentional dep so each slide change restarts the timer.
  // biome-ignore lint/correctness/useExhaustiveDependencies: active resets the timer
  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setTimeout(() => {
      setActive((a) => (a + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, count, setActive]);

  // progress fill, restarted per slide; paused independently so it doesn't reset
  useGSAP(
    () => {
      if (!fillRef.current || count <= 1) return;
      fillTween.current = gsap.fromTo(
        fillRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: "none" },
      );
      return () => {
        fillTween.current?.kill();
      };
    },
    { dependencies: [active], scope: rootRef },
  );
  useEffect(() => {
    if (paused) fillTween.current?.pause();
    else fillTween.current?.resume();
  }, [paused]);

  // panel entrance (GSAP — immune to the splash's Framer context)
  useSplashGsap(
    (gsap) => {
      if (!rootRef.current) return;
      gsap.fromTo(
        rootRef.current,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
      );
    },
    { scope: rootRef },
  );

  // per-slide reveal of cover + text
  useSplashGsap(
    (gsap) => {
      const content = contentRef.current;
      const cover = coverRef.current;
      if (!content || !cover) return;
      gsap.fromTo(
        cover,
        { autoAlpha: 0, scale: 1.06, yPercent: 2 },
        {
          autoAlpha: 1,
          scale: 1,
          yPercent: 0,
          duration: 0.7,
          ease: "power3.out",
        },
      );
      gsap.fromTo(
        content.querySelectorAll("[data-entrance='spotlight-stagger']"),
        { autoAlpha: 0, y: 18, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
        },
      );
    },
    { dependencies: [active], scope: rootRef },
  );

  // pointer parallax on the cover
  useGSAP(
    () => {
      const root = rootRef.current;
      const cover = coverRef.current;
      if (!root || !cover) return;
      const glow = cover.querySelector<HTMLElement>("[data-cover-glow]");
      const index = cover.querySelector<HTMLElement>("[data-cover-index]");
      const rx = gsap.quickTo(cover, "rotationX", {
        duration: 0.6,
        ease: "power3",
      });
      const ry = gsap.quickTo(cover, "rotationY", {
        duration: 0.6,
        ease: "power3",
      });
      const gx = glow
        ? gsap.quickTo(glow, "xPercent", { duration: 0.8, ease: "power3" })
        : null;
      const gy = glow
        ? gsap.quickTo(glow, "yPercent", { duration: 0.8, ease: "power3" })
        : null;
      const ix = index
        ? gsap.quickTo(index, "x", { duration: 0.9, ease: "power3" })
        : null;

      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        rx(-ny * 9);
        ry(nx * 9);
        gx?.(nx * 14);
        gy?.(ny * 14);
        ix?.(nx * -26);
      };
      const onEnter = () => setPaused(true);
      const onLeave = () => {
        setPaused(false);
        rx(0);
        ry(0);
        gx?.(0);
        gy?.(0);
        ix?.(0);
      };

      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      return () => {
        root.removeEventListener("pointerenter", onEnter);
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef },
  );
}
