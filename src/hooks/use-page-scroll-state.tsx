"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type PageScrollState = {
  atTop: boolean;
  atBottom: boolean;
};

function getScrollState(): PageScrollState {
  const scrollBottom = window.scrollY + window.innerHeight;
  const pageBottom = document.documentElement.scrollHeight;

  return {
    atTop: window.scrollY <= 24,
    atBottom: scrollBottom >= pageBottom - 80,
  };
}

const PageScrollStateContext = createContext<PageScrollState | null>(null);

/** Owns the single scroll/resize listener shared by nav, footer, and the dev HUD. */
export function PageScrollStateProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<PageScrollState>({
    atTop: true,
    atBottom: false,
  });

  useEffect(() => {
    // Read at most once per frame, and only re-render the nav/footer when a
    // flag actually flips — scroll fires far more often than either changes.
    let pending = 0;
    const read = () => {
      pending = 0;
      const next = getScrollState();
      setState((prev) =>
        prev.atTop === next.atTop && prev.atBottom === next.atBottom
          ? prev
          : next,
      );
    };
    const sync = () => {
      if (!pending) pending = window.requestAnimationFrame(read);
    };

    if (!pathname) return;
    read();
    const frame = window.requestAnimationFrame(read);
    const timeout = window.setTimeout(read, 360);

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(pending);
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [pathname]);

  return (
    <PageScrollStateContext.Provider value={state}>
      {children}
    </PageScrollStateContext.Provider>
  );
}

export function usePageScrollState() {
  const context = useContext(PageScrollStateContext);

  if (!context) {
    throw new Error(
      "usePageScrollState must be used within PageScrollStateProvider",
    );
  }

  return context;
}
