"use client";

import type { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { Icons } from "@/components/icons";
import SectionLabel from "@/components/ui/section-label";
import { experienceConfig } from "@/config/resume";
import { useSplashGsap } from "@/hooks/use-splash-gsap";

export default function HomeStory() {
  const rootRef = useRef<HTMLDivElement>(null);

  useSplashGsap(
    (gsap) => {
      const triggers: ScrollTrigger[] = [];

      for (const block of gsap.utils.toArray<HTMLElement>("[data-story]")) {
        const tween = gsap.fromTo(
          block,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 88%", once: true },
          },
        );
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      }

      return () => {
        for (const trigger of triggers) trigger.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="flex flex-col gap-32 sm:gap-40">
      {/* path so far */}
      <section
        data-story
        aria-labelledby="path-heading"
        className="flex flex-col gap-8"
      >
        <div className="flex items-end justify-between gap-4">
          <SectionLabel id="path-heading">Path so far</SectionLabel>
          <Link
            href="/about"
            data-reticle
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-foreground/55 transition-colors hover:text-foreground"
          >
            Full story
            <Icons.Generic.Forward
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              weight="bold"
            />
          </Link>
        </div>

        <ol className="flex flex-col border-t border-border">
          {experienceConfig.map((exp) => (
            <li
              key={`${exp.company}-${exp.period}`}
              className="group grid gap-x-8 gap-y-1 border-b border-border py-6 transition-colors sm:grid-cols-[200px_1fr_auto] sm:items-baseline"
            >
              <p className="font-mono text-[11px] tracking-wide text-foreground/50 tabular-nums">
                {exp.period}
              </p>
              <p className="text-xl font-medium tracking-tight text-foreground transition-transform duration-500 ease-out group-hover:translate-x-1 sm:text-2xl">
                {exp.role}
                <span className="text-foreground/40"> @ {exp.company}</span>
              </p>
              <p className="font-mono text-[10px] tracking-[0.16em] text-foreground/45 uppercase">
                {exp.type}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
