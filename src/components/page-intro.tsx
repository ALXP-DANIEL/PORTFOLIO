"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export default function PageIntro({
  title,
  description,
  className,
}: PageIntroProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-page-intro-eyebrow]",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
      )
        .fromTo(
          "[data-page-intro-title]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9 },
          "-=0.2",
        )
        .fromTo(
          "[data-page-intro-desc]",
          { autoAlpha: 0, y: 16, filter: "blur(6px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.6 },
          "-=0.45",
        )
        .fromTo(
          "[data-page-intro-rule]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
          "-=0.5",
        );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("flex flex-col gap-5", className)}>
      <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
        <span className="block overflow-hidden pb-[0.1em]">
          <span data-page-intro-title className="block">
            {title}
          </span>
        </span>
      </h1>

      {description ? (
        <p
          data-page-intro-desc
          className="max-w-2xl text-sm leading-7 text-foreground/55 sm:text-base"
        >
          {description}
        </p>
      ) : null}

      <span
        data-page-intro-rule
        className="mt-1 block h-px origin-left bg-linear-to-r from-white/25 via-white/10 to-transparent"
      />
    </div>
  );
}
