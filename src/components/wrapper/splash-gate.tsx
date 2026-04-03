"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSessionStorage } from "usehooks-ts";

type SplashGateProps = {
  children: React.ReactNode;
};

const SPLASH_DURATION_MS = 1700;
const SPLASH_SESSION_KEY = "portfolio:splash-seen";

export default function SplashGate({ children }: SplashGateProps) {
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [hasSeenSplash, setHasSeenSplash] = useSessionStorage(
    SPLASH_SESSION_KEY,
    false,
  );

  useEffect(() => {
    setMounted(true);

    if (hasSeenSplash) {
      setShowSplash(false);
      return;
    }

    setShowSplash(true);

    const timer = window.setTimeout(() => {
      setHasSeenSplash(true);
      setShowSplash(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasSeenSplash, setHasSeenSplash]);

  const showOverlay = mounted && showSplash;

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: showOverlay ? 0 : 1, scale: showOverlay ? 0.995 : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {showOverlay ? (
          <motion.div
            key="splash-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-120 flex items-center justify-center bg-background"
            aria-live="polite"
            aria-label="Loading"
          >
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="animate-pulse"
              >
                <Image
                  src="/brand/logo.svg"
                  alt="Loading portfolio"
                  width={128}
                  height={128}
                  priority
                  className="h-28 w-28 select-none sm:h-32 sm:w-32"
                  draggable={false}
                />
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
