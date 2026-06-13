"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import GlassSurface from "@/components/ui/glass-surface";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          key="footer"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="site-footer fixed bottom-5 left-1/2 z-200 hidden -translate-x-1/2 lg:block"
        >
          <GlassSurface
            as="footer"
            className="px-4 py-2"
            contentClassName="flex items-center gap-3 text-[11px] font-mono tracking-wide text-foreground/55"
          >
            <span>ALIF</span>
            <span className="h-1 w-1 rounded-full bg-foreground/25" />
            <span>{new Date().getFullYear()}</span>
          </GlassSurface>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
