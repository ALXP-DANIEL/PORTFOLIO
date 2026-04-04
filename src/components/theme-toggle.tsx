"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Icons } from "@/components/icons/icons";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileHover={{ y: -1, scale: 1.03 }}
      whileTap={{ y: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={cn(
        "group relative inline-flex size-14 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background/70 text-foreground shadow-[0_12px_32px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors duration-300 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        !mounted && "pointer-events-none",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -50, scale: 0.5, y: 2 }}
            animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, rotate: 50, scale: 0.5, y: -2 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            className="absolute"
          >
            <Icons.moon weight="duotone" className="size-5.5" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 50, scale: 0.5, y: 2 }}
            animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, rotate: -50, scale: 0.5, y: -2 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            className="absolute"
          >
            <Icons.sun weight="duotone" className="size-5.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
