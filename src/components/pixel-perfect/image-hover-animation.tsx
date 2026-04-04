"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import BlurImage from "@/components/ui/blur-image";

const defaultImages = [
  "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
  "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
  "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
  "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
] as const;

type ImageHoverAnimationProps = {
  images?: readonly string[];
  compact?: boolean;
};

export default function ImageHoverAnimation({
  images = defaultImages,
  compact = false,
}: ImageHoverAnimationProps) {
  const [active, setActive] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const activeWidth = compact ? "132px" : "180px";
  const idleWidth = compact ? "84px" : "120px";
  const activeHeight = compact ? "110px" : "150px";
  const idleHeight = compact ? "84px" : "100px";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedImage === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <>
      <div className="flex h-full w-full items-center justify-center overflow-visible">
        <div className="flex items-end gap-1.5 overflow-visible">
          {images.map((item, index) => (
            <motion.button
              key={item}
              type="button"
              layout
              transition={{
                type: "tween",
                duration: 0.25,
                ease: "easeOut",
              }}
              style={{
                opacity: active === null ? 1 : active === index ? 1 : 0.5,
                width: active === index ? activeWidth : idleWidth,
                height: active === index ? activeHeight : idleHeight,
              }}
              onMouseEnter={() => {
                setActive(index);
              }}
              onFocus={() => {
                setActive(index);
              }}
              onMouseLeave={() => {
                setActive((current) => (current === index ? null : current));
              }}
              onClick={() => {
                setSelectedImage(index);
              }}
              className="overflow-hidden rounded-lg shadow-[0_12px_24px_-18px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label={`Open project preview ${index + 1}`}
            >
              <BlurImage
                src={item}
                alt={`Project preview ${index + 1}`}
                wrapperClassName="block h-full w-full"
                className="h-full w-full origin-bottom object-cover"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {mounted && selectedImage !== null
        ? createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-200 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md"
              role="dialog"
              aria-modal="true"
              aria-label={`Preview image ${selectedImage + 1}`}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="relative w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-background/95 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.8)]"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Close preview"
                  onClick={() => setSelectedImage(null)}
                  className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md transition-colors hover:bg-muted"
                >
                  Close
                </button>

                <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="min-h-72 bg-black/5 md:min-h-128">
                    <BlurImage
                      src={images[selectedImage]}
                      alt={`Expanded project preview ${selectedImage + 1}`}
                      wrapperClassName="block h-full w-full"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-6 p-5 sm:p-7">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Preview
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                        Project image {selectedImage + 1}
                      </h3>
                      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                        Click another thumbnail to swap the preview, or close
                        the modal to return to the carousel.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {images.map((image, index) => (
                        <button
                          key={image}
                          type="button"
                          aria-label={`Switch to preview ${index + 1}`}
                          onClick={() => setSelectedImage(index)}
                          className={
                            index === selectedImage
                              ? "h-14 w-14 overflow-hidden rounded-xl border-2 border-foreground/90 bg-background shadow-[0_10px_20px_-16px_rgba(0,0,0,0.45)]"
                              : "h-14 w-14 overflow-hidden rounded-xl border border-border/70 bg-background/70 opacity-75 transition-all hover:opacity-100 hover:ring-2 hover:ring-ring/40"
                          }
                        >
                          <BlurImage
                            src={image}
                            alt={`Switch to preview ${index + 1}`}
                            wrapperClassName="block h-full w-full"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>,
            document.body,
          )
        : null}
    </>
  );
}
