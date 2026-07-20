"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  atTop?: boolean;
};

export function ThemeToggle({ atTop = true }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes only knows the real theme after mount; avoid hydration mismatch.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden border border-border bg-background text-foreground shadow-lg transition-[border-radius] duration-300 ease-out",
        atTop
          ? "rounded-t-none rounded-b-[1.25rem]"
          : "rounded-t-[1.25rem] rounded-b-[1.25rem]",
      )}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="absolute"
        >
          {isDark ? <Icons.Layout.Theme.Dark /> : <Icons.Layout.Theme.Sun />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
