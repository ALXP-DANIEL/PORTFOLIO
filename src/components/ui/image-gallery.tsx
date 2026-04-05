"use client";

import { motion } from "motion/react";
import { useState } from "react";

import BlurImage from "@/components/ui/blur-image";

export type HoverPreviewImage =
  | string
  | {
      src: string;
      title?: string;
      caption?: string;
      alt?: string;
    };

type ImageGalleryProps = {
  images: readonly HoverPreviewImage[];
  compact?: boolean;
  hover?: boolean;
  onSelectImage?: (selection: {
    index: number;
    image: HoverPreviewImage;
    images: readonly HoverPreviewImage[];
  }) => void;
};

export default function ImageGallery({
  images,
  compact = false,
  hover = true,
  onSelectImage,
}: ImageGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  const activeWidth = compact ? 132 : 180;
  const idleWidth = compact ? 84 : 120;
  const activeHeight = compact ? 110 : 150;
  const idleHeight = compact ? 84 : 100;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-visible">
      <div className="flex items-end gap-1.5 overflow-visible">
        {images.map((item, index) => {
          const imageSrc = typeof item === "string" ? item : item.src;
          const imageAlt =
            typeof item === "string"
              ? `Preview ${index + 1}`
              : (item.alt ?? `Preview ${index + 1}`);

          return (
            <motion.button
              key={imageSrc}
              type="button"
              transition={{
                type: "tween",
                duration: 0.25,
                ease: "easeOut",
              }}
              animate={{
                scaleX: hover && active === index ? activeWidth / idleWidth : 1,
                scaleY:
                  hover && active === index ? activeHeight / idleHeight : 1,
              }}
              style={{
                opacity: hover && active !== null && active !== index ? 0.5 : 1,
                width: `${idleWidth}px`,
                height: `${idleHeight}px`,
                transformOrigin: "bottom center",
              }}
              onMouseEnter={
                hover
                  ? () => {
                      setActive(index);
                    }
                  : undefined
              }
              onFocus={
                hover
                  ? () => {
                      setActive(index);
                    }
                  : undefined
              }
              onMouseLeave={
                hover
                  ? () => {
                      setActive(active === index ? null : active);
                    }
                  : undefined
              }
              onPointerDownCapture={(event) => {
                event.stopPropagation();
              }}
              onClick={() => {
                onSelectImage?.({
                  index,
                  image: item,
                  images,
                });
              }}
              className="overflow-hidden rounded-lg shadow-[0_12px_24px_-18px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label={`Open preview ${index + 1}`}
            >
              <BlurImage
                src={imageSrc}
                alt={imageAlt}
                wrapperClassName="block h-full w-full"
                className="h-full w-full origin-bottom object-cover"
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
