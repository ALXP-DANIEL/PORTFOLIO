import { useEffect } from "react";

/**
 * The canvas reticle cursor paints at z-250, beneath modal overlays, so while
 * one is open the native cursor has to come back or the pointer vanishes.
 * Counted, so stacked overlays restore it only when the last one closes.
 */
let openOverlays = 0;

export function useOverlayCursor(active: boolean) {
  useEffect(() => {
    if (!active) return;
    openOverlays += 1;
    document.documentElement.dataset.overlayOpen = "true";

    return () => {
      openOverlays -= 1;
      if (openOverlays === 0)
        delete document.documentElement.dataset.overlayOpen;
    };
  }, [active]);
}
