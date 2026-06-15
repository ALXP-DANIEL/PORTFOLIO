"use client";

import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import BlurImage from "@/components/ui/blur-image";
import IconButton from "@/components/ui/icon-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import type { ProjectImage } from "@/types/project";

export default function WorkGallery({
  images,
}: {
  images: readonly ProjectImage[];
}) {
  const [index, setIndex] = useState<number | null>(null);

  const count = images.length;
  const isOpen = index !== null;
  const active = index === null ? null : images[index];

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: number) =>
      setIndex((i) => (i === null ? null : (i + dir + count) % count)),
    [count],
  );

  // arrow keys for prev/next (Radix already handles Escape + backdrop + focus)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, step]);

  if (count === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            data-reticle
            onClick={() => setIndex(i)}
            className="group relative aspect-4/3 overflow-hidden border border-white/10 bg-white/3"
          >
            <BlurImage
              src={image.src}
              alt={image.alt ?? ""}
              wrapperClassName="block h-full w-full"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
            {image.caption ? (
              <span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/70 to-transparent px-3 py-2 text-left text-[11px] text-foreground/75">
                {image.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
        <DialogContent
          showCloseButton={false}
          // Click on the empty backdrop (the content element itself) closes.
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className="fixed inset-0 top-0 left-0 grid h-dvh w-screen max-w-none translate-x-0 translate-y-0 place-items-center gap-0 rounded-none border-0 bg-black/92 p-4 shadow-none ring-0 backdrop-blur-sm sm:max-w-none sm:p-12"
        >
          <DialogTitle className="sr-only">
            {active?.caption ?? active?.alt ?? "Project image"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {active
              ? `Preview ${String((index ?? 0) + 1).padStart(2, "0")} of ${String(count).padStart(2, "0")}. Use the previous and next buttons to browse project images.`
              : "Project image preview dialog."}
          </DialogDescription>

          {active ? (
            <>
              {/* contained stage — chrome is absolute, so stepping never shifts it.
                  overflow-visible keeps the blur-up reveal from being clipped. */}
              <BlurImage
                key={active.src}
                src={active.src}
                alt={active.alt ?? ""}
                eager
                wrapperClassName="block max-h-[82vh] max-w-[92vw] overflow-visible border border-white/10"
                className="max-h-[82vh] max-w-[92vw] object-contain"
              />

              <IconButton
                data-reticle
                aria-label="Close"
                onClick={close}
                className="absolute top-4 right-4 size-10 bg-black/40 text-foreground/75"
              >
                <XIcon className="size-4" weight="bold" />
              </IconButton>

              {count > 1 ? (
                <>
                  <IconButton
                    data-reticle
                    aria-label="Previous image"
                    onClick={() => step(-1)}
                    className="absolute top-1/2 left-2 size-10 -translate-y-1/2 bg-black/40 text-foreground/75 sm:left-5 sm:size-12"
                  >
                    <CaretLeftIcon className="size-4 sm:size-5" weight="bold" />
                  </IconButton>
                  <IconButton
                    data-reticle
                    aria-label="Next image"
                    onClick={() => step(1)}
                    className="absolute top-1/2 right-2 size-10 -translate-y-1/2 bg-black/40 text-foreground/75 sm:right-5 sm:size-12"
                  >
                    <CaretRightIcon
                      className="size-4 sm:size-5"
                      weight="bold"
                    />
                  </IconButton>
                </>
              ) : null}

              <div className="absolute inset-x-0 bottom-5 flex justify-center px-4">
                <div className="flex max-w-[90vw] items-center gap-3 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 backdrop-blur">
                  <span className="truncate font-mono text-[11px] tracking-wide text-foreground/70">
                    {active.caption ?? active.alt ?? "Preview"}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] tracking-wide text-foreground/40 tabular-nums">
                    {String((index ?? 0) + 1).padStart(2, "0")} /{" "}
                    {String(count).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
