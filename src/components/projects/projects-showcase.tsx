"use client";

import {
  CaretLeftIcon,
  CaretRightIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";

import ImageHoverAnimation from "@/components/pixel-perfect/image-hover-animation";
import { carouselProjects } from "@/components/projects/projects-data";
import { buttonVariants } from "@/components/ui/shadcn/button";
import SectionWrapper from "@/components/wrapper/section";
import { cn } from "@/lib/utils";

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
  );
}
