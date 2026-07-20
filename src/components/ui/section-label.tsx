import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Mono uppercase eyebrow that labels a section — a real heading, not just styled text. */
export default function SectionLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className={cn(
        "font-mono text-[11px] tracking-[0.22em] text-foreground/60 uppercase",
        className,
      )}
      {...props}
    />
  );
}
