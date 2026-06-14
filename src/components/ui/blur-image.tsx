"use client";

import Image from "next/image";
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  SyntheticEvent,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const REVEAL_DELAY_MS = 240;
const REVEAL_DURATION_CLASS = "duration-[420ms]";

type BlurImageProps = Omit<ComponentPropsWithoutRef<"img">, "alt"> & {
  alt: string;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  eager?: boolean;
  /**
   * Render with next/image (optimized resize/format/srcset) in `fill` mode.
   * Requires a sized wrapper — use for covers/thumbnails, not intrinsic images
   * (README/lightbox) whose dimensions aren't known ahead of time.
   */
  fill?: boolean;
};

export default function BlurImage({
  alt,
  className,
  wrapperClassName,
  wrapperStyle,
  eager = false,
  fill = false,
  src,
  sizes,
  onLoad,
  onError,
  ...props
}: BlurImageProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const revealStartedAt = useRef(Date.now());
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRevealTimer = useCallback(() => {
    if (revealTimer.current) {
      clearTimeout(revealTimer.current);
      revealTimer.current = null;
    }
  }, []);

  const finishReveal = useCallback(() => {
    clearRevealTimer();
    const elapsed = Date.now() - revealStartedAt.current;
    const remaining = Math.max(REVEAL_DELAY_MS - elapsed, 0);

    revealTimer.current = setTimeout(() => {
      setIsRevealed(true);
      revealTimer.current = null;
    }, remaining);
  }, [clearRevealTimer]);

  useEffect(() => {
    clearRevealTimer();
    revealStartedAt.current = Date.now();
    setIsRevealed(false);

    if (!src) {
      return;
    }

    const image = imageRef.current;

    if (image?.complete && image.naturalWidth > 0) {
      finishReveal();
    }

    return clearRevealTimer;
  }, [src, clearRevealTimer, finishReveal]);

  const imageClassName = cn(
    "transition-[filter,opacity,transform] ease-out motion-reduce:transition-none select-none",
    REVEAL_DURATION_CLASS,
    isRevealed ? "scale-100 blur-0" : "scale-[1.02] blur-2xl",
    className,
  );

  const markLoaded = (event: SyntheticEvent<HTMLImageElement>) => {
    finishReveal();
    onLoad?.(event);
  };
  const markError = (event: SyntheticEvent<HTMLImageElement>) => {
    clearRevealTimer();
    setIsRevealed(true);
    onError?.(event);
  };

  return (
    <span
      className={cn("relative block overflow-hidden", wrapperClassName)}
      style={wrapperStyle}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-muted/60 transition-opacity ease-out motion-reduce:transition-none",
          REVEAL_DURATION_CLASS,
          isRevealed ? "opacity-0" : "opacity-100",
        )}
      />
      {fill && typeof src === "string" ? (
        <Image
          ref={imageRef}
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "100vw"}
          priority={eager}
          draggable={false}
          onLoad={markLoaded}
          onError={markError}
          className={imageClassName}
        />
      ) : (
        // biome-ignore lint/performance/noImgElement: intrinsic/remote image rendered without next/image dimensions
        <img
          ref={imageRef}
          {...props}
          src={src}
          sizes={sizes}
          draggable={props.draggable ?? false}
          loading={eager ? "eager" : (props.loading ?? "lazy")}
          fetchPriority={eager ? "high" : props.fetchPriority}
          decoding={props.decoding ?? "async"}
          alt={alt}
          onLoad={markLoaded}
          onError={markError}
          className={imageClassName}
        />
      )}
    </span>
  );
}
