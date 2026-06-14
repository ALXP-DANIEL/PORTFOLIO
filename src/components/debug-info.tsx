"use client";

import { BugIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/shadcn/button";

function useViewportLabel() {
  const [label, setLabel] = useState("server");

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setLabel("2xl");
      } else if (width >= 1280) {
        setLabel("xl");
      } else if (width >= 1024) {
        setLabel("lg");
      } else if (width >= 768) {
        setLabel("md");
      } else if (width >= 640) {
        setLabel("sm");
      } else {
        setLabel("xs");
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return label;
}

function useFps() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let raf = 0;
    let lastUpdate = performance.now();
    let frames = 0;

    const tick = (now: number) => {
      frames++;

      const elapsed = now - lastUpdate;
      if (elapsed >= 500) {
        setFps(Math.round((frames * 1000) / elapsed));
        frames = 0;
        lastUpdate = now;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return fps;
}

export function DebugInfo({ enabled }: { enabled: boolean }) {
  const viewport = useViewportLabel();
  const fps = useFps();
  const [unlocked, setUnlocked] = useState(enabled);
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(true);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [viewTransitions, setViewTransitions] = useState(false);
  const available = enabled || unlocked;

  useEffect(() => {
    const syncOnline = () => setOnline(navigator.onLine);
    syncOnline();
    setServiceWorkerReady("serviceWorker" in navigator);
    setViewTransitions("startViewTransition" in document);

    window.addEventListener("online", syncOnline);
    window.addEventListener("offline", syncOnline);
    return () => {
      window.removeEventListener("online", syncOnline);
      window.removeEventListener("offline", syncOnline);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setUnlocked(true);
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!available) {
    return null;
  }

  return (
    <motion.aside
      className="fixed bottom-22 left-3 z-50 flex flex-col items-start gap-2 text-xs sm:bottom-20 sm:left-6"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="rounded-3xl bg-background/65">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-expanded={open}
          aria-controls="qr-pixel-dev-hud"
          onClick={() => setOpen((current) => !current)}
          className="h-8 gap-2 rounded-2xl bg-transparent hover:bg-background/50 border border-border"
        >
          <BugIcon />
          DEV
        </Button>
      </div>
      {open && (
        <motion.div
          id="qr-pixel-dev-hud"
          className="glass-panel min-w-56 rounded-3xl bg-background/65 p-3 text-muted-foreground"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <dt>Viewport</dt>
            <dd className="text-foreground">{viewport}</dd>
            <dt>FPS</dt>
            <dd className="text-foreground tabular-nums">{fps}</dd>
            <dt>Network</dt>
            <dd className="text-foreground">{online ? "online" : "offline"}</dd>
            <dt>Service worker</dt>
            <dd className="text-foreground">
              {serviceWorkerReady ? "available" : "unavailable"}
            </dd>
            <dt>View transitions</dt>
            <dd className="text-foreground">
              {viewTransitions ? "supported" : "unsupported"}
            </dd>
          </dl>
        </motion.div>
      )}
    </motion.aside>
  );
}
