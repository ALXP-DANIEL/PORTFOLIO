"use client";

import {
  BriefcaseIcon,
  EnvelopeIcon,
  HouseIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GlassSurface, { glassActiveStyle } from "@/components/ui/glass-surface";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: HouseIcon },
  { href: "/work", label: "Work", icon: BriefcaseIcon },
  { href: "/about", label: "About", icon: UserIcon },
  { href: "/contact", label: "Contact", icon: EnvelopeIcon },
];

const pageTransitionTypes = ["page-slide"];

const activeTransition = {
  type: "spring" as const,
  stiffness: 460,
  damping: 38,
  mass: 0.8,
};

export default function NavigationDesktop() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          key="desktop-nav"
          initial={{ opacity: 0, x: -12, y: -12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="site-nav-desktop fixed top-5 left-5 z-200 hidden lg:block"
        >
          <GlassSurface
            as="nav"
            className="p-1.5"
            contentClassName="flex items-center gap-0.5"
          >
            <span className="px-3 text-xs font-mono tracking-[0.2em] text-foreground/50 select-none">
              ALIF
            </span>

            <div className="w-px h-4 bg-white/10 mx-1" />

            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
