"use client";

import type { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { Icons } from "@/components/icons";
import SectionLabel from "@/components/ui/section-label";
import { experienceConfig } from "@/config/resume";
import { useSplashGsap } from "@/hooks/use-splash-gsap";

/** First professional role — the clock "years shipping" counts from. */
const CAREER_START = new Date("2023-08-01");

type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

function yearsSince(date: Date) {
  const ms = Date.now() - date.getTime();
  return Math.max(1, Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000)));
}

export default function HomeStory({ projectCount }: { projectCount: number }) {
  const rootRef = useRef<HTMLDivElement>(null);

  const stats: Stat[] = [
    {
      value: yearsSince(CAREER_START),
      suffix: "+",
      label: "Years shipping production code",
    },
    {
      value: projectCount,
      label: "Projects live in the index",
    },
    {
      value: 2,
      suffix: "×",
      label: "WorldSkills Malaysia Belia competitor",
    },
    {
      value: 3.71,
      decimals: 2,
      label: "Diploma GPA in web development",
    },
  ];

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

      // Count each stat up from zero the first time it scrolls into view.
      for (const el of gsap.utils.toArray<HTMLElement>("[data-count]")) {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals ?? 0);
        const counter = { value: 0 };
        const tween = gsap.to(counter, {
          value: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = counter.value.toFixed(decimals);
          },
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
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
      {/* at a glance */}
      <section
        data-story
        aria-labelledby="glance-heading"
        className="flex flex-col gap-8"
      >
        <SectionLabel id="glance-heading">At a glance</SectionLabel>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col justify-between gap-6 bg-background p-5 sm:p-7"
            >
              <dd className="order-first text-4xl font-semibold tracking-tight text-foreground tabular-nums sm:text-6xl">
                {stat.prefix}
                <span data-count={stat.value} data-decimals={stat.decimals}>
                  {stat.value.toFixed(stat.decimals ?? 0)}
                </span>
                <span className="text-foreground/35">{stat.suffix}</span>
              </dd>
              <dt className="font-mono text-[11px] leading-5 tracking-wide text-foreground/55">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

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
