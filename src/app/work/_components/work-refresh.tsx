"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

/**
 * Press "R" on the work page to bust the GitHub cache and re-fetch.
 */
export default function WorkRefresh() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const onKey = async (e: KeyboardEvent) => {
      if (e.key !== "r" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }

      setStatus("loading");
      try {
        const res = await fetch("/api/revalidate");
        setStatus(res.ok ? "done" : "error");
        if (res.ok) router.refresh();
      } catch {
        setStatus("error");
      } finally {
        window.setTimeout(() => setStatus("idle"), 2200);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  if (status === "idle") return null;

  const label =
    status === "loading"
      ? "Refreshing…"
      : status === "done"
        ? "Refreshed ✓"
        : "Refresh failed ✕";

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 left-5 z-300 rounded-full border border-white/10 bg-background/85 px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-foreground/75 shadow-lg backdrop-blur"
    >
      {label}
    </div>
  );
}
