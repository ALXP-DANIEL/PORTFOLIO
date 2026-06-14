"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!isReady) return;

    if (window.scrollY <= 16) {
      window.scrollTo({ top: 40, behavior: "smooth" });
    }
  }, [isReady]);

  return (
    <GridBackground>
      <Navigation />
      <main className="min-h-dvh py-20 px-5 lg:px-15">
        <ViewTransitionShell>
          <section className="w-full mx-auto max-w-6xl ">{children}</section>
        </ViewTransitionShell>
      </main>
      <Footer />
    </GridBackground>
  );
}
