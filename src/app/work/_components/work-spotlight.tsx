"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import BlurImage from "@/components/ui/blur-image";
import { useSplashGsap } from "@/hooks/use-splash-gsap";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import WorkCover from "./work-cover";

const AUTOPLAY_MS = 5600;
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
  const fillTween = useRef<gsap.core.Tween | null>(null);

  const count = projects.length;
  const project = projects[active];
  const spotlightImage = project?.cover ?? project?.gallery[0]?.src;

  const go = (dir: number) => setActive((a) => (a + dir + count) % count);

  // autoplay — a self-rescheduling timeout stays in sync with the progress fill.
  // `active` is an intentional dep so each slide change restarts the timer.
  // biome-ignore lint/correctness/useExhaustiveDependencies: active resets the timer
  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setTimeout(() => {
      setActive((a) => (a + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, count]);

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
        <p className="font-mono text-[11px] tracking-[0.24em] text-foreground/45 uppercase">
          Spotlight
        </p>
        <div className="flex items-center gap-2">
          <span className="mr-1 font-mono text-[11px] tracking-wide text-foreground/35 tabular-nums">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            data-reticle
            aria-label="Previous project"
            onClick={() => go(-1)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-background/45 text-foreground/65 backdrop-blur transition-colors hover:bg-white/8 hover:text-foreground"
          >
            <Icons.Layout.Footer.CaretUp
              className="size-3.5 -rotate-90"
              weight="bold"
            />
          </button>
          <button
            type="button"
            data-reticle
            aria-label="Next project"
            onClick={() => go(1)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-background/45 text-foreground/65 backdrop-blur transition-colors hover:bg-white/8 hover:text-foreground"
          >
            <Icons.Layout.Footer.CaretUp
              className="size-3.5 rotate-90"
              weight="bold"
            />
          </button>
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
            className="mt-6 flex flex-wrap gap-2"
          >
            {project.tech.slice(0, 6).map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-background/50 px-3 py-1 font-mono text-[11px] tracking-wide text-foreground/60 backdrop-blur"
              >
                {item}
              </span>
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
