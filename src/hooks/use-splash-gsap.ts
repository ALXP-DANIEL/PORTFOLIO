import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { useSplashReady } from "@/components/layouts/splash-gate";

type TimelineFactory = (gsap: typeof import("gsap").default) => unknown;

type SplashGsapOptions<T extends HTMLElement> = {
  dependencies?: unknown[];
  scope: RefObject<T | null>;
};

gsap.registerPlugin(ScrollTrigger);

export function useSplashGsap<T extends HTMLElement>(
  factory: TimelineFactory,
  { dependencies = [], scope }: SplashGsapOptions<T>,
) {
  const isSplashReady = useSplashReady();

  useGSAP(
    () => {
      if (!isSplashReady) return;
      const cleanup = factory(gsap);
      if (typeof cleanup === "function") return cleanup;
    },
    { dependencies: [isSplashReady, ...dependencies], scope },
  );
}

type RevealOptions<T extends HTMLElement> = {
  from?: gsap.TweenVars;
  scope: RefObject<T | null>;
  selector: string;
  start?: string;
  to?: gsap.TweenVars;
};

export function useSplashScrollReveal<T extends HTMLElement>({
  from = { autoAlpha: 0, y: 28 },
  scope,
  selector,
  start = "top 88%",
  to = { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
}: RevealOptions<T>) {
  useSplashGsap(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(selector);
      const previousTriggers = new Set(ScrollTrigger.getAll());

      ScrollTrigger.batch(targets, {
        start,
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, from, to),
      });

      const triggers = ScrollTrigger.getAll().filter(
        (trigger) => !previousTriggers.has(trigger),
      );

      return () => {
        for (const trigger of triggers) trigger.kill();
      };
    },
    { scope },
  );
}
