"use client";

import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ProjectImagePreview from "@/app/(pages)/projects/_components/project-image-preview";
import { Icons } from "@/components/icons/icons";
import { buttonVariants } from "@/components/ui/shadcn/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/shadcn/carousel";
import SectionWrapper from "@/components/wrapper/section";
import { carouselProjects } from "@/data/projects/projects-data";
import { cn } from "@/lib/utils";

export default function ProjectsShowcase() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3600,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const isExternalHref = (href: string) =>
    href.startsWith("http://") || href.startsWith("https://");

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateActiveSlide = () => {
      setActiveSlide(carouselApi.selectedScrollSnap());
    };

    const updateScrollSnaps = () => {
      setScrollSnaps(carouselApi.scrollSnapList());
    };

    updateScrollSnaps();
    updateActiveSlide();
    carouselApi.on("init", updateScrollSnaps);
    carouselApi.on("select", updateActiveSlide);
    carouselApi.on("reInit", updateScrollSnaps);
    carouselApi.on("reInit", updateActiveSlide);

    return () => {
      carouselApi.off("init", updateScrollSnaps);
      carouselApi.off("select", updateActiveSlide);
      carouselApi.off("reInit", updateScrollSnaps);
      carouselApi.off("reInit", updateActiveSlide);
    };
  }, [carouselApi]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <SectionWrapper className="overflow-hidden border border-border/70 bg-background/70 px-5 py-6 sm:px-7 sm:py-8">
        <Carousel
          setApi={setCarouselApi}
          opts={{ loop: true }}
          plugins={[autoplayPlugin.current]}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Project Spotlight
              </p>
            </div>

            <div className="flex items-center gap-2">
              <CarouselPrevious className="static! top-auto! left-auto! translate-x-0! translate-y-0!">
                <Icons.caretLeft className="size-4" weight="bold" />
              </CarouselPrevious>
              <CarouselNext className="static! top-auto! right-auto! translate-x-0! translate-y-0!">
                <Icons.caretRight className="size-4" weight="bold" />
              </CarouselNext>
            </div>
          </div>

          <div className="overflow-visible bg-transparent">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <CarouselContent className="-ml-4">
                {carouselProjects.map((item) => {
                  const heroImage = item.previewImages[0];
                  const heroImageSrc =
                    typeof heroImage === "string" ? heroImage : heroImage.src;
                  const openHref = item.actions.open;
                  const githubHref = item.actions.github;
                  const customHref = item.actions.custom.href;
                  const customLabel = item.actions.custom.label;

                  return (
                    <CarouselItem key={item.title} className="pl-4">
                      <div className="p-1">
                        <div className="relative overflow-hidden rounded-2xl border border-border/70 p-5 sm:p-7">
                          <div
                            className="pointer-events-none absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${heroImageSrc})` }}
                            aria-hidden="true"
                          />
                          <div
                            className="pointer-events-none absolute inset-0 bg-linear-to-r from-background/92 via-background/60 to-transparent"
                            aria-hidden="true"
                          />

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
                                <Icons.sparkle
                                  className="size-3.5"
                                  weight="fill"
                                />
                                {item.stat}
                              </div>

                              <div className="mt-5 flex flex-wrap items-center gap-2 md:absolute md:bottom-0 md:left-0">
                                {isExternalHref(openHref) ? (
                                  <a
                                    href={openHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                      buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                      }),
                                      "bg-background/65 backdrop-blur",
                                    )}
                                  >
                                    <Icons.arrowSquareOut className="size-3.5" />
                                    Open
                                  </a>
                                ) : (
                                  <Link
                                    href={openHref}
                                    className={cn(
                                      buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                      }),
                                      "bg-background/65 backdrop-blur",
                                    )}
                                  >
                                    <Icons.arrowSquareOut className="size-3.5" />
                                    Open
                                  </Link>
                                )}

                                <a
                                  href={githubHref}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={cn(
                                    buttonVariants({
                                      variant: "secondary",
                                      size: "sm",
                                    }),
                                    "bg-background/65 backdrop-blur",
                                  )}
                                >
                                  <Icons.github className="size-3.5" />
                                  GitHub
                                </a>

                                <a
                                  href={customHref}
                                  target={
                                    isExternalHref(customHref)
                                      ? "_blank"
                                      : undefined
                                  }
                                  rel={
                                    isExternalHref(customHref)
                                      ? "noreferrer"
                                      : undefined
                                  }
                                  className={cn(
                                    buttonVariants({
                                      variant: "ghost",
                                      size: "sm",
                                    }),
                                    "bg-background/45 backdrop-blur",
                                  )}
                                >
                                  {customLabel}
                                </a>
                              </div>
                            </div>

                            <div className="mt-6 rounded-2xl bg-background/35 p-3 shadow-[0_24px_45px_-24px_rgba(0,0,0,0.75)] backdrop-blur-sm md:absolute md:bottom-0 md:right-0 md:mt-0">
                              <ProjectImagePreview
                                title={item.title}
                                kicker={item.kicker}
                                summary={item.summary}
                                stat={item.stat}
                                previewImages={item.previewImages}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </motion.div>
          </div>
        </Carousel>

        <div className="mt-4 flex items-center justify-center gap-2">
          {scrollSnaps.map((snap, index) => (
            <button
              key={snap}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => carouselApi?.scrollTo(index)}
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
