"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { type IconName, Icons } from "@/components/icons/icons";

const socials = [
  { href: "https://github.com", label: "GitHub", icon: "github" },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "linkedin" },
  { href: "https://x.com", label: "X", icon: "x" },
] as const;

type SocialItem = (typeof socials)[number];

function SocialIconLink({
  item,
  size = "desktop",
}: {
  item: SocialItem;
  size?: "desktop" | "mobile";
}) {
  const { href, label, icon } = item;
  const Icon = Icons[icon as IconName];

  const classes =
    size === "mobile"
      ? "group inline-flex size-11 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      : "group inline-flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={classes}
    >
      <Icon
        className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        weight="bold"
      />
    </Link>
  );
}

export default function Footer() {
  const [isReady, setIsReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const updateDesktopState = () => setIsDesktop(mediaQuery.matches);

    updateDesktopState();
    setIsReady(true);
    mediaQuery.addEventListener("change", updateDesktopState);

    return () => mediaQuery.removeEventListener("change", updateDesktopState);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setIsMobileExpanded(false);
    }
  }, [isDesktop]);

  if (!isReady) {
    return null;
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-3 z-20 px-3 sm:bottom-4 sm:px-4"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDesktop ? (
          <motion.div
            key="footer-desktop"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-full border border-border/70 bg-background/80 px-4 py-3 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} THEALIFHAKER1</span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
              <span className="hidden sm:inline-block">
                MUHAMMAD ALIF DANIEL BIN MOHD HAIRUL HEZZELIN
              </span>
            </div>

            <div className="flex items-center gap-2">
              {socials.map((item) => (
                <SocialIconLink key={item.label} item={item} size="desktop" />
              ))}

              <Link
                href="mailto:hello@example.com"
                className="ml-1 inline-flex items-center gap-2 rounded-full border border-border/60 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Say hello
                <Icons.arrowUpRight className="size-4" weight="bold" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="mx-auto flex w-full justify-center md:hidden">
            <AnimatePresence initial={false} mode="wait">
              {isMobileExpanded ? (
                <motion.div
                  key="footer-mobile-expanded"
                  initial={{ opacity: 0, y: 14, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  className="w-full max-w-sm rounded-[1.5rem] border border-border/70 bg-background/88 px-4 py-4 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.5)] backdrop-blur-md"
                >
                  <div className="mb-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>© {new Date().getFullYear()} THEALIFHAKER1</span>

                    <button
                      type="button"
                      aria-label="Collapse footer"
                      onClick={() => setIsMobileExpanded(false)}
                      className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground transition-colors hover:bg-muted"
                    >
                      <Icons.caretUp className="size-4" weight="bold" />
                    </button>
                  </div>

                  <div className="mb-4 flex items-center justify-between gap-2">
                    {socials.map((item) => (
                      <SocialIconLink
                        key={item.label}
                        item={item}
                        size="mobile"
                      />
                    ))}
                  </div>

                  <Link
                    href="mailto:hello@example.com"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                  >
                    Say hello
                    <Icons.arrowUpRight className="size-4" weight="bold" />
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  key="footer-mobile-collapsed"
                  type="button"
                  aria-label="Open footer"
                  onClick={() => setIsMobileExpanded(true)}
                  initial={{ opacity: 0, y: 14, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96, y: 0 }}
                  className="inline-flex size-12 items-center justify-center rounded-full border border-border/70 bg-background/85 text-foreground shadow-[0_16px_40px_-28px_rgba(0,0,0,0.5)] backdrop-blur-md"
                >
                  <Icons.caretUp className="size-5" weight="bold" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </motion.footer>
  );
}
