import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Small mono chip used for tech stacks, skills, and metadata. */
export default function Tag({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-white/10 bg-white/3 px-3 py-1 font-mono text-[11px] tracking-wide text-foreground/60",
        className,
      )}
      {...props}
    />
  );
}
