"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import Logo from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useDraggableNav } from "@/hooks/use-draggable-nav";
import { usePageScrollState } from "@/hooks/use-page-scroll-state";
import { cn } from "@/lib/utils";
import type { NavigationProps } from "@/types/route";
import {
  NavigationActionOutlet,
  useNavigationAction,
} from "./navigation-action";

export default function NavigationDesktop({
  links,
  activeTransition,
}: NavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const { atTop } = usePageScrollState();
  const { action } = useNavigationAction();
  const { trackRef, visibleIndex, pressed, getLinkHandlers } =
    useDraggableNav(links);

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
        <nav
          className={cn(
            "relative flex items-center gap-0.5 overflow-hidden rounded-full border border-border bg-background p-1.5 shadow-lg transition-[border-radius] duration-300 ease-out",
            atTop
              ? "rounded-t-none rounded-b-[2rem]"
              : "rounded-t-[2rem] rounded-b-[2rem]",
          )}
        >
          <Logo className="h-4 w-auto px-3" />

          <div className="mx-1 h-4 w-px bg-border" />

          <div
            ref={trackRef as React.RefObject<HTMLDivElement>}
            className="flex items-center gap-0.5"
          >
            {links.map(({ path, label, icon: Icon }, index) => {
              const isVisible = index === visibleIndex;

              return (
                <Link
                  key={path}
                  href={path}
                  aria-current={isVisible ? "page" : undefined}
                  {...getLinkHandlers(index)}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-mono tracking-wide transition-colors duration-300 touch-none select-none",
                    isVisible
                      ? "text-foreground"
                      : "text-foreground/45 hover:text-foreground/75",
                  )}
                >
                  {isVisible && (
                    <motion.span
                      layoutId="desktop-nav-active"
                      className="absolute inset-0 rounded-full bg-accent"
                      animate={{ scale: pressed ? 1.1 : 1 }}
                      transition={activeTransition}
                    />
                  )}

                  <Icon
                    size={14}
                    weight={isVisible ? "fill" : "regular"}
                    className="relative"
                  />

                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </motion.div>

      <motion.div
        animate={{
          top: atTop ? 0 : 20,
          bottom: "auto",
          right: 20,
          left: "auto",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed z-250 hidden items-center gap-2 lg:flex"
      >
        {action ? (
          <div
            className={cn(
              "relative flex items-center overflow-hidden rounded-full border border-border bg-background p-1.5 shadow-lg transition-[border-radius] duration-300 ease-out",
              atTop
                ? "rounded-t-none rounded-b-[2rem]"
                : "rounded-t-[2rem] rounded-b-[2rem]",
            )}
          >
            <NavigationActionOutlet
              classNames={{
                content: "gap-1.5",
                icon: "size-14",
                label: "leading-none",
              }}
              className="relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-mono tracking-wide transition-colors duration-300"
            />
          </div>
        ) : null}

        <ThemeToggle atTop={atTop} />
      </motion.div>
    </>
  );
}
