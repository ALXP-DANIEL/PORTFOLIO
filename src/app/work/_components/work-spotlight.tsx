"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icons } from "@/components/icons";
import BlurImage from "@/components/ui/blur-image";
import IconButton from "@/components/ui/icon-button";
import SectionLabel from "@/components/ui/section-label";
import Tag from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import { useSpotlightMotion } from "../_hooks/use-spotlight-motion";
import WorkCover from "./work-cover";

const isLocalHref = (href: string) =>
  href.startsWith("/") || href.startsWith("#") || href.startsWith("?");

export default function WorkSpotlight({
  projects,
}: {
  projects: readonly Project[];
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const count = projects.length;
  const project = projects[active];
  const spotlightImage = project?.cover ?? project?.gallery[0]?.src;

  const go = (dir: number) => setActive((a) => (a + dir + count) % count);

  useSpotlightMotion({
    rootRef,
    contentRef,
    coverRef,
    fillRef,
    active,
    count,
    paused,
    setActive,
    setPaused,
  });

  if (!project) return null;

  return (
    <section
      ref={rootRef}
      data-entrance="spotlight-panel"
      className={cn(
        "relative overflow-hidden border border-white/10 bg-background/70 p-6 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-9",
      )}
      style={{
        perspective: "1200px",
      }}
    >
      {spotlightImage ? (
        <>
          <BlurImage
            src={spotlightImage}
            alt=""
            fill
            sizes="100vw"
            wrapperClassName="pointer-events-none absolute inset-0 h-full w-full"
            className="h-full w-full scale-105 object-cover opacity-35"
            eager
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-background via-background/85 to-background/20" />
        </>
      ) : null}

      <div className="relative mb-6 flex items-center justify-between gap-3">
        <SectionLabel className="tracking-[0.24em] text-foreground/45">
          Spotlight
        </SectionLabel>
        <div className="flex items-center gap-2">
          <span className="mr-1 font-mono text-[11px] tracking-wide text-foreground/35 tabular-nums">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <IconButton
            data-reticle
            aria-label="Previous project"
            onClick={() => go(-1)}
            className="border-white/10 bg-background/45 text-foreground/65 hover:bg-white/8"
          >
            <Icons.Layout.Footer.CaretUp
              className="size-3.5 -rotate-90"
              weight="bold"
            />
          </IconButton>
          <IconButton
            data-reticle
            aria-label="Next project"
            onClick={() => go(1)}
            className="border-white/10 bg-background/45 text-foreground/65 hover:bg-white/8"
          >
            <Icons.Layout.Footer.CaretUp
              className="size-3.5 rotate-90"
              weight="bold"
            />
          </IconButton>
        </div>
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)] lg:items-center">
        <div ref={contentRef} className="order-2 lg:order-1">
          <p
            data-entrance="spotlight-stagger"
            className="font-mono text-[11px] tracking-[0.2em] text-foreground/45 uppercase"
          >
            {project.category} · {project.year}
          </p>
          <h2
            data-entrance="spotlight-stagger"
            className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl"
          >
            <Link
              href={`/work/${project.slug}`}
              data-reticle
              className="transition-colors hover:text-foreground/75"
            >
              {project.title}
            </Link>
          </h2>
          <p
            data-entrance="spotlight-stagger"
            className="mt-4 h-21 max-w-xl overflow-y-auto pr-1 text-sm leading-7 text-foreground/60 sm:text-base"
          >
            {project.summary}
          </p>

          <div
            data-entrance="spotlight-stagger"
            className="mt-6 flex max-h-18 min-h-18 flex-wrap content-start gap-2 overflow-y-auto pr-1"
          >
            {project.tech.map((item) => (
              <Tag
                key={item}
                className="h-7 shrink-0 bg-background/50 backdrop-blur"
              >
                {item}
              </Tag>
            ))}
          </div>

          <div
            data-entrance="spotlight-stagger"
            className="mt-7 flex flex-wrap items-center gap-2.5"
          >
            <Link
              href={`/work/${project.slug}`}
              data-reticle
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              View case
              <Icons.Layout.Footer.ArrowUpRight
                className="size-3.5"
                weight="bold"
              />
            </Link>
            {project.actions.open ? (
              isLocalHref(project.actions.open) ? (
                <Link
                  href={project.actions.open}
                  data-reticle
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/45 px-4 py-2 font-mono text-xs tracking-wide text-foreground/70 backdrop-blur transition-colors hover:bg-white/8 hover:text-foreground"
                >
                  Open
                </Link>
              ) : (
                <a
                  href={project.actions.open}
                  target="_blank"
                  rel="noreferrer"
                  data-reticle
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/45 px-4 py-2 font-mono text-xs tracking-wide text-foreground/70 backdrop-blur transition-colors hover:bg-white/8 hover:text-foreground"
                >
                  Open
                </a>
              )
            ) : null}
            {project.actions.github ? (
              <a
                href={project.actions.github}
                target="_blank"
                rel="noreferrer"
                data-reticle
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/45 px-4 py-2 font-mono text-xs tracking-wide text-foreground/70 backdrop-blur transition-colors hover:bg-white/8 hover:text-foreground"
              >
                <Icons.Social.GitHub className="size-3.5" weight="bold" />
                GitHub
              </a>
            ) : null}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div
            ref={coverRef}
            data-entrance="spotlight-cover"
            className="aspect-video w-full transform-3d"
          >
            <WorkCover
              index={active}
              label={project.type}
              cover={spotlightImage}
              eager
            />
          </div>
        </div>
      </div>

      {/* progress segments */}
      <div className="relative mt-7 flex items-center gap-1.5">
        {projects.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            data-reticle
            aria-label={`Go to ${item.title}`}
            onClick={() => setActive(index)}
            className="group relative h-1 flex-1 overflow-hidden rounded-full bg-white/12"
          >
            <span
              className={cn(
                "absolute inset-0 origin-left rounded-full bg-foreground/70 transition-opacity",
                index < active ? "opacity-100" : "opacity-0",
              )}
              style={{ transform: index < active ? "scaleX(1)" : "scaleX(0)" }}
            />
            {index === active ? (
              <span
                ref={fillRef}
                className="absolute inset-0 origin-left rounded-full bg-foreground/80"
                style={{ transform: "scaleX(0)" }}
              />
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
