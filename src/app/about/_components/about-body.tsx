"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";
import {
  aboutConfig,
  educationConfig,
  experienceConfig,
  languagesConfig,
  skillsConfig,
} from "@/config/resume";

gsap.registerPlugin(ScrollTrigger);

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section
      data-reveal
      className="flex flex-col gap-6 border-t border-white/10 first:border-t-0 first:pt-0 pt-10"
    >
      <p className="font-mono text-[11px] tracking-[0.22em] text-foreground/40 uppercase">
        {label}
      </p>
      {children}
    </section>
  );
}

/** period (left) + content (right) row used by experience and education. */
function TimelineRow({
  period,
  meta,
  children,
}: {
  period: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <li className="grid gap-x-8 gap-y-3 border-t border-white/8 py-8 first:border-t-0 first:pt-0 sm:grid-cols-[190px_1fr]">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[11px] tracking-wide text-foreground/45 tabular-nums">
          {period}
        </p>
        <p className="font-mono text-[10px] tracking-[0.16em] text-foreground/30 uppercase">
          {meta}
        </p>
      </div>
      <div>{children}</div>
    </li>
  );
}

function Bullets({ points }: { points: readonly string[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {points.map((point) => (
        <li
          key={point}
          className="flex gap-3 text-sm leading-6 text-foreground/60"
        >
          <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground/40" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AboutBody() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      ScrollTrigger.batch(blocks, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.08,
            },
          ),
      });
      return () => {
        for (const t of ScrollTrigger.getAll()) t.kill();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex flex-col gap-14 sm:gap-20">
      {/* experience */}
      <Section label="Experience">
        <ol className="flex flex-col">
          {experienceConfig.map((exp) => (
            <TimelineRow
              key={`${exp.company}-${exp.period}`}
              period={exp.period}
              meta={`${exp.type} · ${exp.location}`}
            >
              <h3 className="text-xl font-medium tracking-tight text-foreground">
                {exp.role}
              </h3>
              <p className="mt-0.5 font-mono text-sm text-foreground/50">
                {exp.company}
              </p>
              <Bullets points={exp.points} />
            </TimelineRow>
          ))}
        </ol>
      </Section>

      {/* skills */}
      <Section label="Skills & Stack">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillsConfig.map((group) => (
            <div key={group.group}>
              <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/35 uppercase">
                {group.group}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/3 px-2.5 py-1 font-mono text-[11px] tracking-wide text-foreground/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* education */}
      <Section label="Education">
        <ol className="flex flex-col">
          {educationConfig.map((ed) => (
            <TimelineRow
              key={`${ed.school}-${ed.period}`}
              period={ed.period}
              meta={ed.location}
            >
              <h3 className="text-xl font-medium tracking-tight text-foreground">
                {ed.school}
              </h3>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                {ed.qualification ? (
                  <p className="font-mono text-sm text-foreground/50">
                    {ed.qualification}
                  </p>
                ) : null}
                {ed.gpa ? (
                  <span className="rounded-full border border-white/10 bg-white/3 px-2.5 py-0.5 font-mono text-[11px] text-foreground/55">
                    {ed.gpa}
                  </span>
                ) : null}
              </div>
              <Bullets points={ed.points} />
            </TimelineRow>
          ))}
        </ol>
      </Section>

      {/* languages */}
      <Section label="Languages">
        <div className="grid max-w-lg gap-6 sm:grid-cols-2">
          {languagesConfig.map((lang) => (
            <div key={lang.name}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-foreground/80">
                  {lang.name}
                </span>
                <span className="font-mono text-[11px] tracking-wide text-foreground/40">
                  {lang.level}
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-foreground/60"
                  style={{ width: `${lang.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
