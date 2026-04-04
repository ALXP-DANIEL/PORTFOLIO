"use client";

import { motion } from "motion/react";
import { useState } from "react";
import BlurImage from "@/components/ui/blur-image";
import type { HoverPreviewImage } from "@/components/ui/image-gallery";
import ImageGallery from "@/components/ui/image-gallery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";

type ProjectImagePreviewProps = {
  title: string;
  kicker: string;
  summary: string;
  stat: string;
  previewImages: readonly HoverPreviewImage[];
};

export default function ProjectImagePreview({
  title,
  kicker,
  summary,
  stat,
  previewImages,
}: ProjectImagePreviewProps) {
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
  const currentImageSrc =
    typeof currentImage === "string" ? currentImage : currentImage.src;
  const currentImageTitle =
    typeof currentImage === "string" ? null : currentImage.title;
  const currentImageCaption =
    typeof currentImage === "string" ? null : currentImage.caption;
  const currentImageAlt =
    typeof currentImage === "string"
      ? `Expanded preview ${previewIndex + 1}`
      : (currentImage.alt ?? `Expanded preview ${previewIndex + 1}`);

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
          }}
        />
      </div>
      <Dialog
        open={selectedImage !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedImage(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="z-200 max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-background/95 p-0 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.8)] sm:max-w-5xl"
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
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md transition-colors hover:bg-muted"
            >
              Close
            </button>

            <div className="border-b border-white/10 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {kicker}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h3>
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
                {summary}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs text-muted-foreground">
                {stat}
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="min-h-72 bg-black/5 md:min-h-112">
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
                    Image {previewIndex + 1} of {previewImages.length}
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
                  {previewImages.map((image, index) => {
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
        </DialogContent>
      </Dialog>
    </>
  );
}
