import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Circular icon button used for carousel/lightbox controls. */
export default function IconButton({
  className,
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
