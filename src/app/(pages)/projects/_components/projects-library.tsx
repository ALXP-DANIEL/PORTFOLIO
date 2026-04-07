"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Icons } from "@/components/icons/icons";
import BlurImage from "@/components/ui/blur-image";
import { Card, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { projects } from "@/data/projects/projects-data";

export default function ProjectsLibrary() {
  const isExternalHref = (href: string) =>
    href.startsWith("http://") || href.startsWith("https://");

  return (
    <div
      id="all-projects"
      className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 xl:grid-cols-4"
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.36,
            ease: "easeOut",
            delay: index * 0.05,
          }}
        >
          <Card className="group relative h-full overflow-hidden rounded-[2rem] border-border/70 bg-background/80 p-3 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[0_26px_55px_-30px_rgba(0,0,0,0.82)]">
            <div className="relative overflow-hidden rounded-[1.7rem] bg-muted/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.16_24/0.18),transparent_34%),linear-gradient(135deg,transparent_0%,transparent_55%,oklch(0.68_0.16_24/0.12)_100%)]" />

              <div className="relative aspect-4/3 overflow-hidden rounded-[1.55rem]">
                <BlurImage
                  src={project.cover}
                  alt={`${project.title} cover`}
                  wrapperClassName="block h-full w-full"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/75 via-background/10 to-transparent" />

                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <a
                    href={project.actions.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title} on GitHub`}
                    className="inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] transition-transform duration-300 hover:scale-105 sm:size-12"
                  >
                    <Icons.github className="size-4 sm:size-5" />
                  </a>

                  {isExternalHref(project.actions.open) ? (
                    <a
                      href={project.actions.open}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title}`}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] transition-transform duration-300 hover:scale-105 sm:size-12"
                    >
                      <Icons.arrowSquareOut className="size-4 sm:size-5" />
                    </a>
                  ) : (
                    <Link
                      href={project.actions.open}
                      aria-label={`Open ${project.title}`}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] transition-transform duration-300 hover:scale-105 sm:size-12"
                    >
                      <Icons.arrowSquareOut className="size-4 sm:size-5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <CardHeader className="relative px-2 pb-4 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {project.type}
                  </p>
                  <CardTitle className="text-2xl font-normal tracking-tight sm:text-[2rem]">
                    {project.title}
                  </CardTitle>
                </div>

                <span className="shrink-0 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                  {project.year}
                </span>
              </div>

              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {project.summary}
              </p>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
