"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import BlurImage from "@/components/ui/blur-image";
import GlassSurface, { glassActiveStyle } from "@/components/ui/glass-surface";
import {
  NavigationActionOutlet,
  useNavigationAction,
} from "./navigation-action";
import { usePageScrollState } from "@/hooks/use-page-scroll-state";
import { cn } from "@/lib/utils";
import type { NavigationProps } from "@/types/route";
import { size } from "zod";

export default function NavigationDesktop({
  links,
  activeTransition,
}: NavigationProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const { atTop } = usePageScrollState();
  const { action } = useNavigationAction();

  return (
    <>
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
          <BlurImage
            src="/logo.svg"
            alt="Logo"
            className="h-4 w-auto px-3"
            wrapperClassName="block"
          />

          <div className="mx-1 h-4 w-px bg-white/10" />

          <div className="flex items-center gap-0.5">
            {links.map(({ path, label, icon: Icon }) => {
              const active = pathname === path;

              return (
                <Link
                  key={path}
                  href={path}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-mono tracking-wide transition-colors duration-300",
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
          </div>
        </GlassSurface>
      </motion.div>

      {action ? (
        <motion.div
          animate={{
            top: atTop ? 0 : 20,
            bottom: "auto",
            right: 20,
            left: "auto",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed z-250 hidden lg:block"
        >
          <GlassSurface
            className={cn(
              "p-1.5",
              atTop ? "rounded-t-none rounded-b-[2rem]" : "rounded-full",
            )}
            contentClassName="flex items-center"
          >
            <NavigationActionOutlet
              classNames={{
                content: "gap-1.5",
                icon: "size-14",
                label: "leading-none",
              }}
              className="relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-mono tracking-wide transition-colors duration-300"
            />
          </GlassSurface>
        </motion.div>
      ) : null}
    </>
  );
}
