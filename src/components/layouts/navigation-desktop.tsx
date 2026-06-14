"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import GlassSurface, { glassActiveStyle } from "@/components/ui/glass-surface";
import { usePageScrollState } from "@/hooks/use-page-scroll-state";
import { cn } from "@/lib/utils";
import type { NavigationProps } from "@/types/route";

export default function NavigationDesktop({
  links,
  activeTransition,
}: NavigationProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const { atTop } = usePageScrollState();

  return (
    <motion.div
      ref={navRef}
      animate={{
        top: atTop ? 0 : 20,
        bottom: "auto",
        left: 20,
        right: "auto",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="site-nav-desktop fixed z-250 hidden lg:block"
    >
      <GlassSurface
        as="nav"
        className={cn(
          "p-1.5",
          atTop ? "rounded-t-none rounded-b-[2rem]" : "rounded-full",
        )}
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
    </motion.div>
  );
}
