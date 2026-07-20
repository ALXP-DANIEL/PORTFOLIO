"use client";

import gsap from "gsap";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  atTop?: boolean;
};

export function ThemeToggle({ atTop = true }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const sunRef = useRef<HTMLSpanElement>(null);
  const moonRef = useRef<HTMLSpanElement>(null);

  // next-themes only knows the real theme after mount; avoid hydration mismatch.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  // Cross-animate both icons in place — no mount/unmount, so no exit
  // choreography needed (unlike Motion's AnimatePresence).
  useEffect(() => {
    const sun = sunRef.current;
    const moon = moonRef.current;
    if (!sun || !moon) return;

    gsap.to(sun, {
      opacity: isDark ? 0 : 1,
      rotate: isDark ? 90 : 0,
      scale: isDark ? 0.5 : 1,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
    gsap.to(moon, {
      opacity: isDark ? 1 : 0,
      rotate: isDark ? 0 : -90,
      scale: isDark ? 1 : 0.5,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  }, [isDark]);

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
      <span
        ref={sunRef}
        className="absolute"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        <Icons.Layout.Theme.Sun />
      </span>
      <span
        ref={moonRef}
        className="absolute"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        <Icons.Layout.Theme.Dark />
      </span>
    </button>
  );
}
