"use client";

import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

import HeaderBrand from "@/components/layout/header-brand";
import HeaderDesktopNav from "@/components/layout/header-desktop-nav";
import HeaderMobileMenu from "@/components/layout/header-mobile-menu";
import HeaderMobileToggle from "@/components/layout/header-mobile-toggle";
import HeaderSection from "@/components/layout/header-section";
import ThemeToggle from "@/components/theme-toggle";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((open) => !open),
    [],
  );

  return (
    <header className="sticky top-0 z-20 mb-8">
      <nav className="flex items-stretch justify-between gap-3">
        <div className="flex items-stretch gap-3">
          <HeaderSection className="aspect-square h-auto self-stretch justify-center p-0">
            <HeaderBrand onNavigate={closeMobileMenu} />
          </HeaderSection>

          <HeaderSection className="hidden gap-2 px-3 py-2 text-sm text-muted-foreground sm:flex sm:px-4">
            <HeaderDesktopNav
              pathname={pathname}
              onNavigate={closeMobileMenu}
            />
          </HeaderSection>
        </div>

        <div className="flex items-stretch gap-3">
          <ThemeToggle />
          <HeaderMobileToggle
            isOpen={isMobileMenuOpen}
            onToggle={toggleMobileMenu}
          />
        </div>
      </nav>

      <HeaderMobileMenu
        isOpen={isMobileMenuOpen}
        pathname={pathname}
        onNavigate={closeMobileMenu}
      />
    </header>
  );
}
