"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import HeaderBrand from "@/components/layout/header-brand";
import HeaderDesktopNav from "@/components/layout/header-desktop-nav";
import HeaderMobileMenu from "@/components/layout/header-mobile-menu";
import HeaderMobileToggle from "@/components/layout/header-mobile-toggle";
import HeaderSection from "@/components/layout/header-section";
import ThemeToggle from "@/components/theme-toggle";

export default function Header() {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((open) => !open),
    [],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");
    const updateDesktopState = () => setIsDesktop(mediaQuery.matches);

    updateDesktopState();
    mediaQuery.addEventListener("change", updateDesktopState);

    return () => mediaQuery.removeEventListener("change", updateDesktopState);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setIsMobileMenuOpen(false);
    }
  }, [isDesktop]);

  return (
    <header className="sticky top-0 z-20 mb-8">
      <nav className="flex items-stretch justify-between gap-3">
        <div className="flex items-stretch gap-3">
          <HeaderSection className="aspect-square h-auto self-stretch justify-center p-0">
            <HeaderBrand onNavigate={closeMobileMenu} />
          </HeaderSection>

          <AnimatePresence initial={false} mode="wait">
            {isDesktop ? (
              <motion.div
                key="desktop-nav"
                initial={{ opacity: 0, x: -12, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.98 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                <HeaderSection className="flex gap-2 px-3 py-2 text-sm text-muted-foreground sm:px-4">
                  <HeaderDesktopNav
                    pathname={pathname}
                    onNavigate={closeMobileMenu}
                  />
                </HeaderSection>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <HeaderSection className="flex items-stretch">
          <ThemeToggle />

          <AnimatePresence initial={false} mode="wait">
            {!isDesktop ? (
              <motion.div
                key="mobile-toggle"
                initial={{
                  opacity: 0,
                  x: 12,
                  scale: 0.96,
                  width: 0,
                  marginLeft: 0,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  width: 56,
                  marginLeft: 12,
                }}
                exit={{
                  opacity: 0,
                  x: 8,
                  scale: 0.96,
                  width: 0,
                  marginLeft: 0,
                }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <HeaderMobileToggle
                  isOpen={isMobileMenuOpen}
                  onToggle={toggleMobileMenu}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </HeaderSection>
      </nav>

      <HeaderMobileMenu
        isOpen={isMobileMenuOpen}
        pathname={pathname}
        onNavigate={closeMobileMenu}
      />
    </header>
  );
}
