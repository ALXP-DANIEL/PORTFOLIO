import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";
import { useSplashGsap, useSplashScrollReveal } from "@/hooks/use-splash-gsap";

type DetailMotionArgs = {
  rootRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLDivElement | null>;
};

/**
 * Project detail motion: the header entrance timeline, scroll-revealed
 * sections, and pointer parallax on the full-width hero image.
 */
export function useDetailMotion({ rootRef, heroRef }: DetailMotionArgs) {
  // header entrance timeline
  useSplashGsap(
    (gsap) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-entrance='detail-head']",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
      )
        .fromTo(
          "[data-entrance='detail-title']",
          { yPercent: 115 },
          { autoAlpha: 1, yPercent: 0, duration: 0.9 },
          "-=0.35",
        )
        .fromTo(
          "[data-entrance='detail-hero']",
          { autoAlpha: 0, scale: 1.04, y: 24 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.8 },
          "-=0.55",
        );
    },
    { scope: rootRef },
  );

  useSplashScrollReveal({
    scope: rootRef,
    selector: "[data-entrance='detail-reveal']",
  });

  // hero pointer parallax
  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero) return;
      const img = hero.querySelector<HTMLElement>("[data-hero-img]");
      const rx = gsap.quickTo(hero, "rotationX", {
        duration: 0.7,
        ease: "power3",
      });
      const ry = gsap.quickTo(hero, "rotationY", {
        duration: 0.7,
        ease: "power3",
      });
      const ix = img
        ? gsap.quickTo(img, "xPercent", { duration: 0.9, ease: "power3" })
        : null;
      const iy = img
        ? gsap.quickTo(img, "yPercent", { duration: 0.9, ease: "power3" })
        : null;

      const onMove = (event: PointerEvent) => {
        const rect = hero.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        rx(-ny * 5);
        ry(nx * 5);
        ix?.(nx * -3);
        iy?.(ny * -3);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
        ix?.(0);
        iy?.(0);
      };

      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
      return () => {
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef },
  );
}
