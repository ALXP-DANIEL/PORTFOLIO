import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";

type MagneticOptions = {
  /** Horizontal pull as a fraction of cursor distance from center. */
  strengthX?: number;
  /** Vertical pull as a fraction of cursor distance from center. */
  strengthY?: number;
};

/**
 * Magnetic hover: the referenced element eases toward the cursor while
 * hovered and springs back on leave. GSAP `quickTo` keeps it smooth.
 */
export function useMagnetic<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { strengthX = 0.3, strengthY = 0.5 }: MagneticOptions = {},
) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();

        xTo((e.clientX - (r.left + r.width / 2)) * strengthX);
        yTo((e.clientY - (r.top + r.height / 2)) * strengthY);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );
}
