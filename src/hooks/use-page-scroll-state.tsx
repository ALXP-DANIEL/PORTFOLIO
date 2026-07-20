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
    const sync = () => setState(getScrollState());

    if (!pathname) return;
    sync();
    const frame = window.requestAnimationFrame(sync);
    const timeout = window.setTimeout(sync, 360);

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      window.cancelAnimationFrame(frame);
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
