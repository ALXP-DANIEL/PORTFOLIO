"use client";

import {
  ArrowUpRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import ImageHoverAnimation from "@/components/pixel-perfect/image-hover-animation";
import { buttonVariants } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import SectionWrapper from "@/components/wrapper/section";
import { cn } from "@/lib/utils";

const featuredProject = {
  title: "Atlas Workspace",
  description:
    "A command center for product teams with realtime planning, release notes, and collaborative docs.",
  stack: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
  href: "#",
};

const projects = [
  {
    title: "Pulse Commerce",
    type: "Ecommerce",
    summary: "Conversion-focused storefront with fast checkout and analytics.",
    year: "2026",
    href: "#",
  },
  {
    title: "Nova Hiring",
    type: "SaaS",
    summary: "Applicant tracking with AI summaries and interview scorecards.",
    year: "2025",
    href: "#",
  },
  {
    title: "Beacon Ops",
    type: "Dashboard",
    summary: "Live operations board for logistics and incident response teams.",
    year: "2025",
    href: "#",
  },
  {
    title: "Framefolio",
    type: "Portfolio",
    summary:
      "Creative showcase with CMS-powered content and smooth transitions.",
    year: "2024",
    href: "#",
  },
  {
    title: "Signal API",
    type: "Developer Tool",
    summary:
      "Observability toolkit with traces, alerts, and quick diagnostics.",
    year: "2024",
    href: "#",
  },
  {
    title: "Orbit Notes",
    type: "Productivity",
    summary: "Knowledge hub blending notes, tasks, and project context.",
    year: "2023",
    href: "#",
  },
] as const;

const carouselProjects = [
  {
    title: "Atlas Workspace",
    kicker: "Featured Build",
    summary:
      "Realtime planning surface with streamlined editor tooling and release control.",
    stat: "97 Lighthouse",
    previewImages: [
      "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
      "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
      "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
      "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
    ],
  },
  {
    title: "Pulse Commerce",
    kicker: "Conversion System",
    summary:
      "Performance-first storefront with smart recommendations and fast checkout flow.",
    stat: "+34% CVR",
    previewImages: [
      "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
      "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
      "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
      "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
    ],
  },
  {
    title: "Nova Hiring",
    kicker: "Hiring Platform",
    summary:
      "Application pipeline with AI summaries, role scorecards, and team collaboration.",
    stat: "5x faster review",
    previewImages: [
      "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
      "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
      "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
      "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
    ],
  },
  {
    title: "Signal API",
    kicker: "Developer Product",
    summary:
      "Observability toolkit designed for instant debugging with clean onboarding UX.",
    stat: "< 80ms avg",
    previewImages: [
      "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
      "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
      "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
      "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
    ],
  },
] as const;

export default function ProjectsShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);
  const lastSlide = carouselProjects.length - 1;

  const goPrev = () => {
    setActiveSlide((current) => (current === 0 ? lastSlide : current - 1));
  };

  const goNext = () => {
    setActiveSlide((current) => (current === lastSlide ? 0 : current + 1));
  };

  return (
    <div className="space-y-8">
      <SectionWrapper className="relative min-h-[56svh] border border-border/70 bg-linear-to-br from-red-500/18 via-background/85 to-background px-6 py-8 sm:px-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-5xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md">
            <SparkleIcon className="size-3.5" weight="fill" />
            Crafted with detail and motion
          </div>

          <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Projects that feel alive
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            A curated set of product work focused on clarity, speed, and rich
            interaction. Every section is responsive, animation-aware, and built
            to scale.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#all-projects"
              className={cn(buttonVariants({}), "h-10 px-4")}
            >
              Explore projects
              <ArrowUpRightIcon className="size-4" weight="bold" />
            </Link>
            <Link
              href="mailto:hello@example.com"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 px-4",
              )}
            >
              Start a collaboration
            </Link>
          </div>
        </motion.div>
      </SectionWrapper>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Card className="overflow-hidden border border-border/70 bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardDescription>Featured Project</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">
              {featuredProject.title}
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm">
              {featuredProject.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {featuredProject.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link
              href={featuredProject.href}
              className={cn(buttonVariants({ size: "sm" }), "h-8")}
            >
              View case study
              <ArrowUpRightIcon className="size-4" weight="bold" />
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <SectionWrapper className="overflow-hidden border border-border/70 bg-background/70 px-5 py-6 sm:px-7 sm:py-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Project Carousel
              </p>
              <h2 className="text-lg font-semibold sm:text-xl">
                Highlight Reel
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous project"
                onClick={goPrev}
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon-sm" }),
                )}
              >
                <CaretLeftIcon className="size-4" weight="bold" />
              </button>
              <button
                type="button"
                aria-label="Next project"
                onClick={goNext}
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon-sm" }),
                )}
              >
                <CaretRightIcon className="size-4" weight="bold" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/70 bg-card/75">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: `-${activeSlide * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="flex"
            >
              {carouselProjects.map((item) => (
                <div key={item.title} className="min-w-full p-5 sm:p-7">
                  <div className="relative min-h-72 gap-5 pr-0 md:min-h-88 md:pr-[clamp(13rem,20vw,18rem)]">
                    <div>
                      <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                        {item.kicker}
                      </div>
                      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        {item.summary}
                      </p>

                      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs text-muted-foreground">
                        <SparkleIcon className="size-3.5" weight="fill" />
                        {item.stat}
                      </div>
                    </div>

                    <div className="mt-6 md:absolute md:bottom-0 md:right-0 md:mt-0">
                      <div className="min-h-36 overflow-visible sm:min-h-44">
                        <ImageHoverAnimation
                          images={item.previewImages}
                          compact
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {carouselProjects.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Go to ${item.title}`}
                onClick={() => setActiveSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === activeSlide
                    ? "w-7 bg-foreground/90"
                    : "w-2 bg-border hover:bg-foreground/45",
                )}
              />
            ))}
          </div>
        </SectionWrapper>
      </motion.div>

      <div
        id="all-projects"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
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
            <Card className="h-full border border-border/70 bg-card/78 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
                    {project.type}
                  </span>
                  <span>{project.year}</span>
                </div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.summary}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link
                  href={project.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-8 px-2",
                  )}
                >
                  Open project
                  <ArrowUpRightIcon className="size-4" weight="bold" />
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <SectionWrapper className="border border-border/70 bg-muted/35 px-6 py-10 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Want More
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Building something bold next?
            </h2>
          </div>
          <Link
            href="mailto:hello@example.com"
            className={buttonVariants({ size: "lg" })}
          >
            Let&apos;s work together
            <ArrowUpRightIcon className="size-4" weight="bold" />
          </Link>
        </div>
      </SectionWrapper>
    </div>
  );
}
