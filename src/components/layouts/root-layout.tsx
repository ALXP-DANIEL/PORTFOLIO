"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Footer from "./footer";
import GridBackground from "./grid-background";
import Navigation from "./navigation";
import ViewTransitionShell from "./view-transition-shell";
import { useSplashReady } from "./splash-gate";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayoutWrapper({ children }: RootLayoutProps) {
  const isReady = useSplashReady();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady || !pathname) return;

    if (window.scrollY <= 16) {
      window.scrollTo({ top: 26, behavior: "smooth" });
    }
  }, [isReady, pathname]);

  return (
    <GridBackground>
      <Navigation />
      <main className="min-h-dvh py-25 px-5 lg:px-15">
        <ViewTransitionShell>
          <section className="w-full mx-auto max-w-6xl ">{children}</section>
        </ViewTransitionShell>
      </main>
      <Footer />
    </GridBackground>
  );
}
