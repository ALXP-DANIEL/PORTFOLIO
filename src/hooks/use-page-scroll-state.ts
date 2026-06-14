import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

export function usePageScrollState() {
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

  return state;
}
