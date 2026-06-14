"use client";

import { motion } from "motion/react";
import { useState } from "react";
import BlurImage from "@/components/ui/blur-image";
import ImageGallery from "@/components/ui/image-gallery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { cn } from "@/lib/utils";
import type { ProjectImage } from "@/types/project";

type WorkImagePreviewProps = {
  title: string;
  category: string;
  summary: string;
  previewImages: readonly ProjectImage[];
  onOpenChange?: (isOpen: boolean) => void;
};

export default function WorkImagePreview({
  title,
  category,
  summary,
  previewImages,
  onOpenChange,
}: WorkImagePreviewProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const compactActiveWidth = 132;
  const compactIdleWidth = 84;
  const compactActiveHeight = 110;
  const compactGap = 6;
  const stableGalleryWidth =
    compactActiveWidth +
    Math.max(previewImages.length - 1, 0) * (compactIdleWidth + compactGap);
  const previewIndex = selectedImage ?? 0;
  const currentImage = previewImages[previewIndex];

  if (!currentImage) {
    return null;
  }

  return (
    <>
      <div
        className="flex items-end justify-end overflow-visible"
        style={{
          width: `${stableGalleryWidth}px`,
          height: `${compactActiveHeight}px`,
        }}
      >
        <ImageGallery
          images={previewImages}
          compact
          onSelectImage={({ index }) => {
            setSelectedImage(index);
            onOpenChange?.(true);
          }}
        />
      </div>
      <Dialog
        open={selectedImage !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedImage(null);
          }
          onOpenChange?.(isOpen);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className={cn(
            "z-200 max-w-5xl overflow-hidden border border-white/10 bg-background/95 p-0 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.8)] sm:max-w-5xl",
          )}
          aria-label={`Preview image ${previewIndex + 1}`}
        >
          <DialogTitle className="sr-only">
            Preview image {previewIndex + 1}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Full screen preview with thumbnail switcher.
          </DialogDescription>

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
              onClick={() => {
                setSelectedImage(null);
                onOpenChange?.(false);
              }}
              className="absolute top-4 right-4 z-10 rounded-full border border-white/10 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Close
            </button>

            <div className="border-b border-white/10 px-5 pt-5 pb-4 sm:px-7 sm:pt-6 sm:pb-5">
              <p className="font-mono text-[11px] tracking-[0.18em] text-foreground/40 uppercase">
                {category}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h3>
              <p className="mt-3 max-w-3xl text-sm text-foreground/55 sm:text-base">
                {summary}
              </p>
            </div>

            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="min-h-72 bg-white/5 md:min-h-112">
                <motion.div
                  key={currentImage.src}
                  initial={{ opacity: 0.35, scale: 1.02, filter: "blur(18px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="h-full w-full"
                >
                  <BlurImage
                    src={currentImage.src}
                    alt={
                      currentImage.alt ?? `Expanded preview ${previewIndex + 1}`
                    }
                    wrapperClassName="block h-full w-full"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </div>

              <div className="flex flex-col justify-between gap-5 p-5 sm:p-7">
                <div>
                  <p className="text-sm text-foreground/45">
                    Image {previewIndex + 1} of {previewImages.length}
                  </p>
                  {currentImage.caption ? (
                    <p className="mt-2 text-sm text-foreground/60">
                      {currentImage.caption}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {previewImages.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      aria-label={`Switch to preview ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "h-14 w-14 overflow-hidden",
                        index === previewIndex
                          ? "border-2 border-foreground/90 bg-background shadow-[0_10px_20px_-16px_rgba(0,0,0,0.45)]"
                          : "border border-white/10 bg-background/70 opacity-75 transition-all hover:opacity-100 hover:ring-2 hover:ring-ring/40",
                      )}
                    >
                      <BlurImage
                        src={image.src}
                        alt={image.alt ?? `Switch to preview ${index + 1}`}
                        wrapperClassName="block h-full w-full"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
