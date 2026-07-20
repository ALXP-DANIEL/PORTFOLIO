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

export default function NavigationMobile({
  links,
  activeTransition,
}: NavigationProps) {
  const brandRef = useRef<HTMLDivElement>(null);
  const { atBottom, atTop } = usePageScrollState();
  const { action } = useNavigationAction();
  const { trackRef, visibleIndex, pressed, getLinkHandlers } =
    useDraggableNav(links);

  return (
    <>
      <motion.div
        ref={brandRef}
        animate={{ top: atTop ? 0 : 20, left: 20 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="site-nav-mobile-brand fixed z-250 block lg:hidden"
      >
        <div
          className={cn(
            "relative flex items-center overflow-hidden rounded-full border border-border bg-background px-4 py-2 shadow-lg transition-[border-radius] duration-300 ease-out",
            atTop
              ? "rounded-t-none rounded-b-[2rem]"
              : "rounded-t-[2rem] rounded-b-[2rem]",
          )}
        >
          <Logo />
        </div>
      </motion.div>

      <motion.div
        animate={{ top: atTop ? 0 : 20, right: 20 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed z-250 flex items-center gap-2 lg:hidden"
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

      <motion.div
        ref={trackRef as React.RefObject<HTMLDivElement>}
        animate={{ bottom: atBottom ? 0 : 20 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="site-nav-mobile fixed left-1/2 z-250 block -translate-x-1/2 lg:hidden"
      >
        <nav
          className={cn(
            "relative w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-full border border-border bg-background p-1.5 shadow-lg transition-[border-radius] duration-300 ease-out",
            atBottom
              ? "rounded-t-[2rem] rounded-b-none"
              : "rounded-t-[2rem] rounded-b-[2rem]",
          )}
        >
          <div
            className="grid gap-0.5"
            style={{
              gridTemplateColumns: `repeat(${links.length}, minmax(0, 1fr))`,
            }}
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
                    "relative flex min-w-0 flex-col items-center gap-0.5 rounded-full px-1 py-1.5 transition-colors duration-300 touch-none select-none",
                    isVisible
                      ? "text-foreground"
                      : "text-foreground/40 hover:text-foreground/70",
                  )}
                >
                  {isVisible && (
                    <motion.span
                      layoutId="mobile-nav-active"
                      className="absolute inset-0 rounded-full bg-accent"
                      animate={{ scale: pressed ? 1.1 : 1 }}
                      transition={activeTransition}
                    />
                  )}

                  <Icon
                    size={18}
                    weight={isVisible ? "fill" : "regular"}
                    className="relative"
                  />

                  <span className="relative text-[10px] font-mono tracking-wide">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </motion.div>
    </>
  );
}
