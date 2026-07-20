"use client";

import gsap from "gsap";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type SplashGateProps = {
  children: React.ReactNode;
};

const SPLASH_DURATION_MS = 450;
const APP_REVEAL_DELAY = 0.04;
const APP_REVEAL_MS = 220;
const SplashReadyContext = createContext(false);

export function useSplashReady() {
  return useContext(SplashReadyContext);
}

export default function SplashGate({ children }: SplashGateProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [splashRemoved, setSplashRemoved] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLOutputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION_MS);

    const readyTimer = window.setTimeout(
      () => setIsReady(true),
      SPLASH_DURATION_MS + APP_REVEAL_DELAY * 1000 + APP_REVEAL_MS,
    );

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(readyTimer);
    };
  }, []);

  // content fade-in, timed to start right as the splash begins fading out
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.to(el, {
      opacity: showSplash ? 0 : 1,
      delay: showSplash ? 0 : APP_REVEAL_DELAY,
      duration: APP_REVEAL_MS / 1000,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, [showSplash]);

  // splash fade/scale out, only unmounting once the animation finishes
  // (GSAP has no AnimatePresence-style exit-before-unmount, so this is
  // driven manually via onComplete instead of an immediate conditional).
  useEffect(() => {
    const el = splashRef.current;
    if (!el) return;
    if (showSplash) {
      gsap.set(el, { opacity: 1, scale: 1 });
      return;
    }
    gsap.to(el, {
      opacity: 0,
      scale: 1.01,
      duration: 0.42,
      ease: "power2.inOut",
      onComplete: () => setSplashRemoved(true),
    });
  }, [showSplash]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    gsap.fromTo(
      bar,
      { width: 0 },
      { width: 96, duration: 0.34, ease: "power2.inOut" },
    );
  }, []);

  return (
    <>
      <SplashReadyContext.Provider value={isReady}>
        <div ref={contentRef} style={{ opacity: 0 }}>
          {children}
        </div>
      </SplashReadyContext.Provider>

      {!splashRemoved ? (
        <output
          ref={splashRef}
          className="fixed inset-0 z-300 grid place-items-center bg-background text-foreground"
          aria-label="Loading portfolio"
        >
          <div className="flex flex-col items-center gap-5">
            <div ref={barRef} className="h-px bg-foreground/35" />
          </div>
        </output>
      ) : null}
    </>
  );
}
