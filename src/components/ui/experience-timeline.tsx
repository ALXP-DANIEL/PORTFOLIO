"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons/icons";
import BlurImage from "@/components/ui/blur-image";
import type { HoverPreviewImage } from "@/components/ui/image-gallery";
import ImageGallery from "@/components/ui/image-gallery";
import { buttonVariants } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { cn } from "@/lib/utils";

export type ExperienceTimelineItem = {
  company: string;
  role: string;
  milestone: string;
  period: string;
  employmentType: string;
  location: string;
  summary: string;
  skills: readonly string[];
  bullets: readonly string[];
  images?: readonly HoverPreviewImage[];
  ctaHref?: string;
  ctaLabel?: string;
};

type ExperienceTimelineProps = {
  items: readonly ExperienceTimelineItem[];
  className?: string;
};

const AUTO_ADVANCE_MS = 4200;

export default function ExperienceTimeline({
  items,
  className,
}: ExperienceTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(Math.max(items.length - 1, 0));
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeConnectorFill, setActiveConnectorFill] = useState(0);
  const activeConnectorFillRef = useRef(0);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const [detailPanelHeight, setDetailPanelHeight] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (items.length < 2) {
      activeConnectorFillRef.current = 0;
      setActiveConnectorFill(0);
      return;
    }

    if (isPaused) {
      return;
    }

    const nextIndex = (activeIndex + 1) % items.length;
    const startingFill = activeConnectorFillRef.current;
    const startedAt = window.performance.now();
    let frameId = 0;

    const animateFill = (now: number) => {
      const elapsed = now - startedAt;
      const nextFill = Math.min(
        startingFill + (elapsed / AUTO_ADVANCE_MS) * 100,
        100,
      );

      activeConnectorFillRef.current = nextFill;
      setActiveConnectorFill(nextFill);

      if (nextFill >= 100) {
        activeConnectorFillRef.current = 0;
        setActiveConnectorFill(0);
        setSelectedImage(null);
        setActiveIndex(nextIndex);
        return;
      }

      frameId = window.requestAnimationFrame(animateFill);
    };

    frameId = window.requestAnimationFrame(animateFill);

    return () => window.cancelAnimationFrame(frameId);
  }, [activeIndex, isPaused, items.length]);

  useLayoutEffect(() => {
    const node = detailPanelRef.current;
    if (!node) {
      return;
    }

    const updateHeight = () => {
      setDetailPanelHeight(node.getBoundingClientRect().height);
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[activeIndex];
  const activeImages = activeItem.images ?? [];
  const hasImages = activeImages.length > 0;
  const compactActiveWidth = 132;
  const compactIdleWidth = 84;
  const compactActiveHeight = 110;
  const compactGap = 6;
  const stableGalleryWidth =
    compactActiveWidth +
    Math.max(activeImages.length - 1, 0) * (compactIdleWidth + compactGap);
  const previewIndex = selectedImage ?? 0;
  const currentImage = hasImages ? activeImages[previewIndex] : null;
  const currentImageSrc =
    typeof currentImage === "string" ? currentImage : currentImage?.src;
  const currentImageTitle =
    typeof currentImage === "string" ? null : (currentImage?.title ?? null);
  const currentImageCaption =
    typeof currentImage === "string" ? null : (currentImage?.caption ?? null);
  const currentImageAlt =
    typeof currentImage === "string"
      ? `Expanded experience preview ${previewIndex + 1}`
      : (currentImage?.alt ??
        `Expanded experience preview ${previewIndex + 1}`);

  return (
    <>
      <fieldset
        className={cn("mx-auto flex w-full flex-col items-center", className)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <legend className="sr-only">Experience timeline</legend>
        <div className="w-full overflow-x-auto pb-2">
          <ul className="flex min-w-max items-start justify-between gap-6 md:gap-8 lg:gap-10">
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const isComplete = index < activeIndex;
              const connectorProgress =
                items.length === 1
                  ? 0
                  : isComplete
                    ? 100
                    : isActive
                      ? activeConnectorFill
                      : 0;

              return (
                <li
                  key={`${item.company}-${item.period}`}
                  className="min-w-[11.5rem] flex-1 text-muted-foreground"
                >
                  <button
                    type="button"
                    onClick={() => {
                      activeConnectorFillRef.current = 0;
                      setActiveConnectorFill(0);
                      setSelectedImage(null);
                      setActiveIndex(index);
                    }}
                    aria-pressed={isActive}
                    className="group w-full text-left"
                  >
                    <div className="mb-3 hidden flex-col md:flex">
                      <p
                        className={cn(
                          "text-base font-medium tracking-tight transition-colors lg:text-lg",
                          isActive ? "text-foreground" : "text-foreground/80",
                        )}
                      >
                        {item.role}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.milestone}
                      </p>
                    </div>

                    <div className="relative flex items-center">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                          isActive || isComplete
                            ? "border-primary/60 bg-primary/10"
                            : "border-border bg-background",
                        )}
                      >
                        <span
                          className={cn(
                            "size-3 rounded-full transition-colors duration-300",
                            isActive || isComplete
                              ? "bg-primary"
                              : "bg-muted-foreground/60",
                          )}
                        />
                      </span>

                      {index < items.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="relative ml-3 h-0.5 flex-1 overflow-hidden rounded-full bg-border/70"
                        >
                          <span
                            className="absolute inset-y-0 left-0 rounded-full bg-primary"
                            style={{ width: `${connectorProgress}%` }}
                          />
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-col md:hidden">
                      <p
                        className={cn(
                          "text-sm font-medium tracking-tight transition-colors",
                          isActive ? "text-foreground" : "text-foreground/80",
                        )}
                      >
                        {item.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.milestone}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative mt-6 w-full overflow-visible rounded-[2rem] border border-border/70 bg-muted/35 p-2.5 sm:mt-8 sm:p-3">
          <motion.div
            initial={false}
            animate={
              detailPanelHeight === null
                ? undefined
                : { height: detailPanelHeight }
            }
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div ref={detailPanelRef}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${activeItem.company}-${activeItem.period}`}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <div className="flex flex-col items-start gap-2 px-4 pb-5 pt-3 sm:px-5">
                    <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                      {activeItem.role}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeItem.company} | {activeItem.location}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{activeItem.employmentType}</span>
                      <span className="text-foreground">|</span>
                      <span>{activeItem.period}</span>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-border/70 bg-background/94 p-5 sm:p-6">
                    <p className="text-sm leading-7 text-muted-foreground">
                      {activeItem.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {activeItem.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-foreground/90"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 ml-1 flex flex-col gap-4">
                      {activeItem.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-3">
                          <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                          <p className="text-base leading-8 text-foreground/92">
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>

                    {activeItem.ctaHref ? (
                      <div className="mt-8">
                        <Link
                          href={activeItem.ctaHref}
                          className={cn(
                            buttonVariants({
                              size: "lg",
                            }),
                            "rounded-full px-5",
                          )}
                        >
                          {activeItem.ctaLabel ?? "View details"}
                          <Icons.arrowUpRight
                            className="size-4"
                            weight="bold"
                          />
                        </Link>
                      </div>
                    ) : null}

                    {hasImages ? (
                      <div className="relative mt-8 overflow-visible">
                        <div className="-mx-1 overflow-x-auto px-1 pb-2 pt-7">
                          <div
                            className="relative z-10 flex items-end overflow-visible"
                            style={{
                              width: `${stableGalleryWidth}px`,
                              minWidth: `${stableGalleryWidth}px`,
                              height: `${compactActiveHeight}px`,
                            }}
                          >
                            <ImageGallery
                              images={activeImages}
                              compact
                              onSelectImage={({ index }) => {
                                setSelectedImage(index);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </fieldset>

      <Dialog
        open={hasImages && selectedImage !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedImage(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="z-200 max-w-5xl overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/95 p-0 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.8)] sm:max-w-5xl"
          aria-label={`${activeItem.role} preview image ${previewIndex + 1}`}
        >
          <DialogTitle className="sr-only">
            {activeItem.role} preview image {previewIndex + 1}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Expanded experience preview with thumbnail switcher.
          </DialogDescription>

          {currentImageSrc ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="relative"
            >
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md transition-colors hover:bg-muted"
              >
                Close
              </button>

              <div className="border-b border-border/70 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Experience gallery
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {activeItem.role}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeItem.company} | {activeItem.period}
                </p>
                <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
                  {activeItem.summary}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs text-muted-foreground">
                  {activeItem.employmentType}
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
                <div className="min-h-72 bg-muted/45 md:min-h-112">
                  <BlurImage
                    src={currentImageSrc}
                    alt={currentImageAlt}
                    wrapperClassName="block h-full w-full"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between gap-5 p-5 sm:p-7">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Image {previewIndex + 1} of {activeImages.length}
                    </p>
                    {currentImageTitle ? (
                      <h4 className="mt-2 text-lg font-medium text-foreground">
                        {currentImageTitle}
                      </h4>
                    ) : null}
                    {currentImageCaption ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {currentImageCaption}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeImages.map((image, index) => {
                      const previewSrc =
                        typeof image === "string" ? image : image.src;
                      const previewAlt =
                        typeof image === "string"
                          ? `Switch to preview ${index + 1}`
                          : (image.alt ?? `Switch to preview ${index + 1}`);

                      return (
                        <button
                          key={previewSrc}
                          type="button"
                          aria-label={`Switch to preview ${index + 1}`}
                          onClick={() => setSelectedImage(index)}
                          className={
                            index === previewIndex
                              ? "h-14 w-14 overflow-hidden rounded-xl border-2 border-foreground/90 bg-background shadow-[0_10px_20px_-16px_rgba(0,0,0,0.45)]"
                              : "h-14 w-14 overflow-hidden rounded-xl border border-border/70 bg-background/70 opacity-75 transition-all hover:opacity-100 hover:ring-2 hover:ring-ring/40"
                          }
                        >
                          <BlurImage
                            src={previewSrc}
                            alt={previewAlt}
                            wrapperClassName="block h-full w-full"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
