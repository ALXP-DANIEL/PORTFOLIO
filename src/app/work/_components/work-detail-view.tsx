"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { Icons } from "@/components/icons";
import BlurImage from "@/components/ui/blur-image";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import WorkGallery from "./work-gallery";
import WorkReadme from "./work-readme";

gsap.registerPlugin(ScrollTrigger);

type WorkDetailViewProps = {
  project: Project;
  index: number;
  projects: readonly Project[];
};

const isLocalHref = (href: string) =>
  href.startsWith("/") || href.startsWith("#") || href.startsWith("?");

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.22em] text-foreground/40 uppercase">
      {children}
    </p>
  );
}

export default function WorkDetailView({ project }: WorkDetailViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { flags } = project;
  const heroImage = project.cover ?? project.gallery[0]?.src;

  const facts = [
    { label: "Role", value: project.type },
    { label: "Year", value: project.year },
    { label: "Stack", value: `${project.tech.length} tools` },
    { label: "Gallery", value: `${project.gallery.length} shots` },
  ];

  // header entrance timeline
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-head]",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
      )
        .fromTo(
          "[data-title]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9 },
          "-=0.35",
        )
        .fromTo(
          "[data-hero]",
          { autoAlpha: 0, scale: 1.04, y: 24 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.8 },
          "-=0.55",
        );
    },
    { scope: rootRef },
  );

  // scroll-reveal the sections below the fold
  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      ScrollTrigger.batch(blocks, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.1,
            },
          ),
      });
      return () => {
        for (const t of ScrollTrigger.getAll()) t.kill();
      };
    },
    { scope: rootRef },
  );

  // hero pointer parallax
  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero) return;
      const img = hero.querySelector<HTMLElement>("[data-hero-img]");
      const rx = gsap.quickTo(hero, "rotateX", {
        duration: 0.7,
        ease: "power3",
      });
      const ry = gsap.quickTo(hero, "rotateY", {
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

  return (
    <article ref={rootRef} className="flex flex-col gap-16 sm:gap-24">
      {/* header */}
      <header className="flex flex-col gap-6">
        <Link
          href="/work"
          data-head
          data-reticle
          className="inline-flex w-fit items-center gap-2 font-mono text-xs tracking-wide text-foreground/45 transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span> Back to work
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <span
            data-head
            className="font-mono text-[11px] tracking-[0.2em] text-foreground/45 uppercase"
          >
            {project.category} · {project.year}
          </span>
          {project.featured ? (
            <span
              data-head
              className="rounded-full border border-amber-300/40 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.16em] text-amber-300/90 uppercase"
            >
              Spotlight
            </span>
          ) : null}
        </div>

        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-title className="block">
              {project.title}
            </span>
          </span>
        </h1>

        <p
          data-head
          className="max-w-2xl text-base leading-7 text-foreground/65 sm:text-lg"
        >
          {project.summary}
        </p>

        <div data-head className="flex flex-wrap items-center gap-2.5">
          {project.actions.open ? (
            isLocalHref(project.actions.open) ? (
              <Link
                href={project.actions.open}
                data-reticle
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Open project
                <Icons.Layout.Footer.ArrowUpRight
                  className="size-3.5"
                  weight="bold"
                />
              </Link>
            ) : (
              <a
                href={project.actions.open}
                target="_blank"
                rel="noreferrer"
                data-reticle
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Open project
                <Icons.Layout.Footer.ArrowUpRight
                  className="size-3.5"
                  weight="bold"
                />
              </a>
            )
          ) : null}
          {project.actions.github ? (
            <a
              href={project.actions.github}
              target="_blank"
              rel="noreferrer"
              data-reticle
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-xs tracking-wide text-foreground/65 transition-colors hover:bg-white/8 hover:text-foreground"
            >
              <Icons.Social.GitHub className="size-3.5" weight="bold" />
              GitHub
            </a>
          ) : null}
        </div>
      </header>

      {/* full-width parallax hero */}
      {heroImage ? (
        <div
          data-hero
          ref={heroRef}
          className={cn(
            "relative aspect-video w-full overflow-hidden border border-white/10 bg-white/5 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)] transform-3d",
          )}
          style={{
            perspective: "1400px",
          }}
        >
          <div data-hero-img className="absolute -inset-4">
            <BlurImage
              src={heroImage}
              alt={`${project.title} cover`}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              wrapperClassName="absolute inset-0 h-full w-full"
              className="h-full w-full object-cover"
              eager
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ) : null}

      {/* overview + facts */}
      {project.overview ? (
        <section
          data-reveal
          className="grid gap-8 border-t border-white/10 pt-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16"
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>Overview</SectionLabel>
            <p className="max-w-2xl text-base leading-8 text-foreground/65">
              {project.overview}
            </p>
          </div>
          <dl
            className={cn(
              "relative grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/5",
            )}
          >
            {facts.map((fact) => (
              <div key={fact.label} className="bg-background/60 p-4">
                <dt className="font-mono text-[10px] tracking-[0.18em] text-foreground/40 uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-base font-medium tracking-tight text-foreground">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* highlights */}
      {flags.showHighlights && project.highlights.length > 0 ? (
        <section
          data-reveal
          className="flex flex-col gap-6 border-t border-white/10 pt-10"
        >
          <SectionLabel>Highlights</SectionLabel>
          <ul className="flex flex-col">
            {project.highlights.map((highlight, i) => (
              <li
                key={highlight}
                className="flex items-baseline gap-5 border-b border-white/8 py-5 last:border-b-0"
              >
                <span className="font-mono text-xs text-foreground/30 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg leading-8 text-foreground/75">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* stack */}
      {flags.showStack && project.tech.length > 0 ? (
        <section
          data-reveal
          className="flex flex-col gap-6 border-t border-white/10 pt-10"
        >
          <SectionLabel>Stack</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/3 px-3.5 py-1.5 font-mono text-xs tracking-wide text-foreground/60"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* gallery */}
      {flags.showGallery && project.gallery.length > 0 ? (
        <section
          data-reveal
          className="flex flex-col gap-6 border-t border-white/10 pt-10"
        >
          <div className="flex items-baseline justify-between gap-3">
            <SectionLabel>Gallery</SectionLabel>
            <span className="font-mono text-[11px] tracking-wide text-foreground/30">
              {String(project.gallery.length).padStart(2, "0")} shots
            </span>
          </div>
          <WorkGallery images={project.gallery} />
        </section>
      ) : null}

      {/* readme */}
      {flags.showReadme && project.readme ? (
        <section
          data-reveal
          className="flex flex-col gap-5 border-t border-white/10 pt-10"
        >
          <SectionLabel>Readme</SectionLabel>
          <div
            className={cn(
              "relative border border-white/10 bg-background/60 p-6 backdrop-blur-xl sm:p-9",
            )}
          >
            <WorkReadme source={project.readme} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
