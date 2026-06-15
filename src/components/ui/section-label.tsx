import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Mono uppercase eyebrow that labels a section. */
export default function SectionLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] tracking-[0.22em] text-foreground/40 uppercase",
        className,
      )}
      {...props}
    />
  );
}
