"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type SplashGateProps = {
  children: React.ReactNode;
};

const SPLASH_DURATION_MS = 1200;

export default function SplashGate({ children }: SplashGateProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          opacity: showSplash ? 0.35 : 1,
          scale: showSplash ? 0.99 : 1,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {showSplash ? (
          <motion.output
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed inset-0 z-300 grid place-items-center bg-background text-foreground"
            aria-label="Loading portfolio"
          >
            <div className="flex flex-col items-center gap-5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{
                  duration: 0.9,
                  ease: "easeInOut",
                }}
                className="h-px bg-foreground/35"
              />
            </div>
          </motion.output>
        ) : null}
      </AnimatePresence>
    </>
  );
}
