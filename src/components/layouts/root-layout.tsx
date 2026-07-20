"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Footer from "./footer";
import GridBackground from "./grid-background/grid-background";
import Navigation from "./navigation";
import { NavigationActionProvider } from "./navigation-action";
import { useSplashReady } from "./splash-gate";
import ViewTransitionShell from "./view-transition-shell";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayoutWrapper({ children }: RootLayoutProps) {
  const isReady = useSplashReady();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady || !pathname) return;

    // Nudge just past the nav's atTop threshold (usePageScrollState) so the
    // floating pill settles into place instead of fighting the nav's own state.
    if (window.scrollY === 0) {
      window.scrollTo({ top: 32, behavior: "smooth" });
    }
  }, [isReady, pathname]);

  return (
    <GridBackground>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-500 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
      >
        Skip to content
      </a>
      <NavigationActionProvider>
        <Navigation />
        <main id="main-content" className="min-h-svh py-25 px-5 lg:px-15">
          <ViewTransitionShell>
            <section className="w-full mx-auto max-w-6xl ">{children}</section>
          </ViewTransitionShell>
        </main>
      </NavigationActionProvider>
      <Footer />
    </GridBackground>
  );
}
