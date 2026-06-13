"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GlassSurface, { glassActiveStyle } from "@/components/ui/glass-surface";
import { cn } from "@/lib/utils";
import type { NavigationProps } from "@/types/route";

export default function NavigationDesktop({
  links,
  pageTransitionTypes,
  activeTransition,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <div className="site-nav-desktop fixed top-5 left-5 z-200 hidden lg:block">
      <GlassSurface
        as="nav"
        className="p-1.5"
        contentClassName="flex items-center gap-0.5"
      >
        <span className="px-3 text-xs font-mono tracking-[0.2em] text-foreground/50 select-none">
          ALIF
        </span>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {links.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              href={path}
              transitionTypes={pageTransitionTypes}
              className={cn(
                "relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-colors duration-300",
                active
                  ? "text-foreground"
                  : "text-foreground/45 hover:text-foreground/75",
              )}
            >
              {active && (
                <motion.span
                  layoutId="desktop-nav-active"
                  className="absolute inset-0 rounded-full"
                  style={glassActiveStyle}
                  transition={activeTransition}
                />
              )}
              <Icon
                size={14}
                weight={active ? "fill" : "regular"}
                className="relative"
              />
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </GlassSurface>
    </div>
  );
}
