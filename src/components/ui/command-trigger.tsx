"use client";

import { useEffect, useState } from "react";
import { openCommandPalette } from "@/components/command-palette/events";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

type CommandTriggerProps = {
  atTop?: boolean;
};

/** Pill that opens the command palette; shows the platform shortcut on desktop. */
export function CommandTrigger({ atTop = true }: CommandTriggerProps) {
  const [modifier, setModifier] = useState("Ctrl");

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
      setModifier("⌘");
    }
  }, []);

  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-label="Open command palette"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "relative flex h-10 items-center gap-2 overflow-hidden border border-border bg-background px-3 text-foreground/60 shadow-lg transition-[border-radius,color] duration-300 ease-out hover:text-foreground",
        atTop
          ? "rounded-t-none rounded-b-[1.25rem]"
          : "rounded-t-[1.25rem] rounded-b-[1.25rem]",
      )}
    >
      <Icons.Palette.Search className="size-4" />
      <kbd className="hidden font-mono text-[11px] tracking-wide lg:inline">
        {modifier} K
      </kbd>
    </button>
  );
}
