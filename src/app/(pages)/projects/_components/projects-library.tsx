"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Icons } from "@/components/icons/icons";
import { buttonVariants } from "@/components/ui/shadcn/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { projects } from "@/data/projects/projects-data";
import { cn } from "@/lib/utils";

export default function ProjectsLibrary() {
  const isExternalHref = (href: string) =>
    href.startsWith("http://") || href.startsWith("https://");

  return (
    <div id="all-projects" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
          <Card className="group relative h-full overflow-hidden border-border/70 bg-card/82 shadow-[0_12px_30px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[0_26px_45px_-28px_rgba(0,0,0,0.8)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              aria-hidden="true"
            >
              <div className="absolute -top-18 -right-16 h-44 w-44 rounded-full bg-foreground/8 blur-3xl" />
              <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-muted-foreground/10 blur-3xl" />
            </div>

            <CardHeader className="relative gap-4 pb-4">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 font-medium text-foreground/90">
                    {project.type}
                  </span>
                </div>
                <span className="rounded-full border border-border/60 bg-background/55 px-2.5 py-1 text-foreground/85">
                  {project.year}
                </span>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-xl tracking-tight sm:text-[1.35rem]">
                  {project.title}
                </CardTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
              </div>
            </CardHeader>

            <CardFooter className="relative mt-auto flex flex-col items-start gap-3 border-t border-border/60 pt-4">
              <div className="flex w-full flex-wrap items-center gap-2">
                {isExternalHref(project.actions.open) ? (
                  <a
                    href={project.actions.open}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 rounded-full bg-background/65 px-3.5 backdrop-blur",
                    )}
                  >
                    <Icons.arrowSquareOut className="size-3.5" />
                    Open
                  </a>
                ) : (
                  <Link
                    href={project.actions.open}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 rounded-full bg-background/65 px-3.5 backdrop-blur",
                    )}
                  >
                    <Icons.arrowSquareOut className="size-3.5" />
                    Open
                  </Link>
                )}

                <a
                  href={project.actions.github}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "h-8 rounded-full bg-background/65 px-3.5 backdrop-blur",
                  )}
                >
                  <Icons.github className="size-3.5" />
                  GitHub
                </a>

                <a
                  href={project.actions.custom.href}
                  target={
                    isExternalHref(project.actions.custom.href)
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    isExternalHref(project.actions.custom.href)
                      ? "noreferrer"
                      : undefined
                  }
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-8 rounded-full bg-background/45 px-3.5 backdrop-blur",
                  )}
                >
                  {project.actions.custom.label}
                </a>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
