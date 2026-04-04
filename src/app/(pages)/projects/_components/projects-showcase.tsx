"use client";

import {
  CaretLeftIcon,
  CaretRightIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import ProjectImagePreview from "@/app/(pages)/projects/_components/project-image-preview";
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
              <CarouselPrevious className="!static !top-auto !left-auto !translate-x-0 !translate-y-0">
                <CaretLeftIcon className="size-4" weight="bold" />
              </CarouselPrevious>
              <CarouselNext className="!static !top-auto !right-auto !translate-x-0 !translate-y-0">
                <CaretRightIcon className="size-4" weight="bold" />
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

                  return (
                    <CarouselItem key={item.title} className="pl-4">
                      <div className="p-1">
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 p-5 sm:p-7">
                          <div
                            className="pointer-events-none absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `linear-gradient(to right, rgb(0 0 0 / 0.82), rgb(0 0 0 / 0.18) 58%, rgb(0 0 0 / 0)), url(${heroImageSrc})`,
                            }}
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
                                <SparkleIcon
                                  className="size-3.5"
                                  weight="fill"
                                />
                                {item.stat}
                              </div>
                            </div>

                            <motion.div
                              layout
                              transition={{
                                type: "spring",
                                stiffness: 240,
                                damping: 28,
                              }}
                              className="mt-6 rounded-2xl bg-background/35 p-3 shadow-[0_24px_45px_-24px_rgba(0,0,0,0.75)] backdrop-blur-sm md:absolute md:bottom-0 md:right-0 md:mt-0"
                            >
                              <ProjectImagePreview
                                title={item.title}
                                kicker={item.kicker}
                                summary={item.summary}
                                stat={item.stat}
                                previewImages={item.previewImages}
                              />
                            </motion.div>
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
