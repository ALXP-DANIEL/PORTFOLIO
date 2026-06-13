"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GlassSurface, { glassActiveStyle } from "@/components/ui/glass-surface";
import { cn } from "@/lib/utils";
import type { NavigationProps } from "@/types/route";

export default function NavigationMobile({
  links,
  pageTransitionTypes,
  activeTransition,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="site-nav-mobile-brand fixed top-5 left-5 z-200 block lg:hidden">
        <GlassSurface
          className="px-4 py-2"
          contentClassName="flex items-center select-none"
        >
          <span className="text-xs font-mono tracking-[0.2em] text-foreground/60">
            ALIF
          </span>
        </GlassSurface>
      </div>

      <div className="site-nav-mobile fixed bottom-5 left-1/2 z-200 block -translate-x-1/2 lg:hidden">
        <GlassSurface
          as="nav"
          className="w-[calc(100vw-2.5rem)] max-w-sm p-1.5"
          contentClassName="grid grid-cols-4 gap-0.5"
        >
          {links.map(({ path, label, icon: Icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                transitionTypes={pageTransitionTypes}
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
      </div>
    </>
  );
}
