"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import GlassSurface, { glassActiveStyle } from "@/components/ui/glass-surface";
import { usePageScrollState } from "@/hooks/use-page-scroll-state";
import { cn } from "@/lib/utils";
import type { NavigationProps } from "@/types/route";

export default function NavigationMobile({
  links,
  activeTransition,
}: NavigationProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const { atBottom, atTop } = usePageScrollState();

  return (
    <>
      <motion.div
        ref={brandRef}
        animate={{ top: atTop ? 0 : 20, left: 20 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="site-nav-mobile-brand fixed z-250 block lg:hidden"
      >
        <GlassSurface
          className={cn(
            "px-4 py-2",
            atTop ? "rounded-t-none rounded-b-[2rem]" : "rounded-full",
          )}
          contentClassName="flex items-center select-none"
        >
          <span className="text-xs font-mono tracking-[0.2em] text-foreground/60">
            ALIF
          </span>
        </GlassSurface>
      </motion.div>

      <motion.div
        ref={navRef}
        animate={{ bottom: atBottom ? 0 : 20 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="site-nav-mobile fixed left-1/2 z-250 block -translate-x-1/2 lg:hidden"
      >
        <GlassSurface
          as="nav"
          className={cn(
            "p-1.5",
            atBottom
              ? "w-[calc(100vw-2.5rem)] max-w-sm rounded-t-[2rem] rounded-b-none"
              : "w-[calc(100vw-2.5rem)] max-w-sm rounded-full",
          )}
          contentClassName="grid grid-cols-4 gap-0.5"
        >
          {links.map(({ path, label, icon: Icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className={cn(
                  "relative flex min-w-0 flex-col items-center gap-0.5 rounded-full px-1 py-1.5 transition-colors duration-300",
                  active
                    ? "text-foreground"
                    : "text-foreground/40 hover:text-foreground/70",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 rounded-full"
                    style={glassActiveStyle}
                    transition={activeTransition}
                  />
                )}
                <Icon
                  size={18}
                  weight={active ? "fill" : "regular"}
                  className="relative"
                />
                <span className="relative text-[10px] font-mono tracking-wide">
                  {label}
                </span>
              </Link>
            );
          })}
        </GlassSurface>
      </motion.div>
    </>
  );
}
