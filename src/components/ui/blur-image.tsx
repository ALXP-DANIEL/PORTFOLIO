"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type BlurImageProps = Omit<ComponentPropsWithoutRef<"img">, "alt"> & {
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  eager?: boolean;
};

export default function BlurImage({
  alt,
  className,
  wrapperClassName,
  imageClassName,
  eager = false,
  src,
  onLoad,
  onError,
  ...props
}: BlurImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setStatus("loading");

    if (!src) {
      return;
    }

    const image = imageRef.current;

    if (image?.complete && image.naturalWidth > 0) {
      setStatus("loaded");
    }
  }, [src]);

  const isReady = status !== "loading";

  return (
    <span className={cn("relative block overflow-hidden", wrapperClassName)}>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-inherit bg-muted/60 transition-opacity duration-500 ease-out motion-reduce:transition-none",
          isReady ? "opacity-0" : "opacity-100",
        )}
      />
      {/* biome-ignore lint/performance/noImgElement: This component intentionally uses a native img tag to support blur-up loading for remote and local assets without next/image config. */}
      <img
        ref={imageRef}
        {...props}
        src={src}
        draggable={props.draggable ?? false}
        loading={eager ? "eager" : (props.loading ?? "lazy")}
        decoding={props.decoding ?? "async"}
        alt={alt}
        onLoad={(event) => {
          setStatus("loaded");
          onLoad?.(event);
        }}
        onError={(event) => {
          setStatus("error");
          onError?.(event);
        }}
        className={cn(
          "transition-[filter,opacity,transform] duration-500 ease-out motion-reduce:transition-none select-none",
          isReady ? "scale-100 blur-0" : "scale-[1.02] blur-2xl",
          className,
          imageClassName,
        )}
      />
    </span>
  );
}
