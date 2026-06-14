"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef, useState } from "react";
import { Icons } from "@/components/icons";
import BlurImage from "@/components/ui/blur-image";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

gsap.registerPlugin(ScrollTrigger);

export default function WorkIndex({
  projects,
}: {
  projects: readonly Project[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const activeProject = active === null ? null : projects[active];
  const activeCover =
    activeProject?.cover ?? activeProject?.gallery[0]?.src ?? null;

  // scroll-reveal rows (desktop + mobile share [data-row])
  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      ScrollTrigger.batch(rows, {
        start: "top 92%",
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
              stagger: 0.06,
            },
          ),
      });
      return () => {
        for (const t of ScrollTrigger.getAll()) t.kill();
      };
    },
    { scope: rootRef },
  );

  // floating preview follows the cursor (desktop only)
  useGSAP(
    () => {
      const preview = previewRef.current;
      if (!preview) return;
      gsap.set(preview, { xPercent: 0, yPercent: -50 });
      const xTo = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3" });
      const onMove = (event: PointerEvent) => {
        xTo(event.clientX + 28);
        yTo(event.clientY);
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: rootRef },
  );

  // show/hide + crossfade the preview as the active row changes
  useGSAP(
    () => {
      const preview = previewRef.current;
      if (!preview) return;
      gsap.to(preview, {
        autoAlpha: active !== null ? 1 : 0,
        scale: active !== null ? 1 : 0.92,
        duration: 0.3,
        ease: "power2.out",
      });
      const inner = preview.querySelector("[data-preview-inner]");
      if (inner && active !== null) {
        gsap.fromTo(
          inner,
          { autoAlpha: 0, scale: 1.08 },
          { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" },
        );
      }
    },
    { dependencies: [active], scope: rootRef },
  );

  return (
    <section ref={rootRef}>
      <div className="mb-7 flex items-baseline justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.24em] text-foreground/45 uppercase">
          All Work
        </p>
        <p className="font-mono text-[11px] tracking-wide text-foreground/30">
          {String(projects.length).padStart(2, "0")} projects
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border-t border-white/10 py-24 text-center">
          <p className="font-mono text-[11px] tracking-[0.24em] text-foreground/35 uppercase">
            Nothing here yet
          </p>
          <p className="max-w-sm text-sm leading-7 text-foreground/45">
            Projects show up here once a repo has a{" "}
            <span className="font-mono text-foreground/70">project.json</span>,
            or once one is added in config.
          </p>
        </div>
      ) : (
        <>
          {/* floating cursor preview — desktop only */}
          <div
            ref={previewRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none fixed top-0 left-0 z-100 hidden aspect-video w-80 overflow-hidden border border-white/15 opacity-0 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] will-change-transform lg:block",
            )}
          >
            {activeProject ? (
              <div
                data-preview-inner
                key={activeProject.slug}
                className="absolute inset-0"
              >
                {activeCover ? (
                  <BlurImage
                    src={activeCover}
                    alt=""
                    fill
                    sizes="320px"
                    wrapperClassName="absolute inset-0 h-full w-full"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-white/10 to-black/40" />
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/80 to-transparent px-4 pt-8 pb-3">
                  <span className="font-mono text-[11px] tracking-wide text-white/85">
                    {activeProject.title}
                  </span>
                  <span className="font-mono text-[10px] tracking-wide text-white/45">
                    {activeProject.year}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* desktop: editorial hover list */}
          <ul className="hidden lg:block" onMouseLeave={() => setActive(null)}>
            {projects.map((project, index) => {
              const dim = active !== null && active !== index;
              return (
                <li
                  key={project.slug}
                  data-row
                  className="border-t border-white/10"
                >
                  <Link
                    href={`/work/${project.slug}`}
                    onMouseEnter={() => setActive(index)}
                    aria-label={`Open ${project.title}`}
                    className={cn(
                      "group flex items-center gap-6 py-7 transition-all duration-300 ease-out",
                      dim ? "opacity-35" : "opacity-100",
                    )}
                  >
                    <span className="w-10 shrink-0 font-mono text-xs text-foreground/35 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-4xl font-semibold tracking-tight text-foreground transition-transform duration-300 ease-out group-hover:translate-x-2 xl:text-5xl">
                      {project.title}
                    </span>
                    <span className="hidden w-44 shrink-0 font-mono text-[11px] tracking-wide text-foreground/45 xl:block">
                      {project.category}
                    </span>
                    <span className="w-14 shrink-0 text-right font-mono text-xs text-foreground/40 tabular-nums">
                      {project.year}
                    </span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-foreground/40 transition-all duration-300 group-hover:border-white/30 group-hover:text-foreground">
                      <Icons.Layout.Footer.ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:rotate-45"
                        weight="bold"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="border-t border-white/10" />
          </ul>

          {/* mobile / tablet: compact list */}
          <ol className="flex flex-col gap-2.5 lg:hidden">
            {projects.map((project, index) => {
              const cover = project.cover ?? project.gallery[0]?.src;
              const num = String(index + 1).padStart(2, "0");
              return (
                <li key={project.slug} data-row>
                  <Link
                    href={`/work/${project.slug}`}
                    data-reticle
                    aria-label={`Open ${project.title}`}
                    className={cn(
                      "group relative flex items-center gap-3.5 overflow-hidden border border-white/10 bg-background/70 p-2.5 transition-colors hover:border-white/20 hover:bg-background/85",
                    )}
                  >
                    <div
                      className={cn(
                        "relative aspect-video w-28 shrink-0 overflow-hidden bg-white/5",
                      )}
                    >
                      {cover ? (
                        <BlurImage
                          src={cover}
                          alt=""
                          fill
                          sizes="120px"
                          wrapperClassName="block h-full w-full"
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                      <span className="pointer-events-none absolute right-1.5 bottom-0 font-mono text-2xl leading-none font-semibold text-white/15 select-none">
                        {num}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[9px] tracking-[0.18em] text-foreground/40 uppercase">
                        {project.type}
                      </p>
                      <h3 className="mt-0.5 truncate text-base font-medium tracking-tight text-foreground">
                        {project.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        {project.featured ? (
                          <span className="size-1.5 rounded-full bg-amber-300" />
                        ) : null}
                        <span className="font-mono text-[10px] tracking-wide text-foreground/40">
                          {project.year}
                        </span>
                      </div>
                    </div>
                    <Icons.Layout.Footer.ArrowUpRight
                      className="size-4 shrink-0 text-foreground/30 transition-colors group-hover:text-foreground/70"
                      weight="bold"
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
}
