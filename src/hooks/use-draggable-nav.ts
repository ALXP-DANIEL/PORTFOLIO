"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RouteTypes } from "@/types/route";

/**
 * Lets the active-link indicator be dragged horizontally between nav items
 * (ported from ASTRA-NEXT's nav) — press the active link, drag toward a
 * neighbor, release to navigate. A plain click still navigates normally.
 */
export function useDraggableNav(links: readonly RouteTypes[]) {
  const pathname = usePathname();
  const router = useRouter();
  const trackRef = useRef<HTMLElement>(null);
  const pointer = useRef({ active: false, moved: false, lastPos: 0 });

  const activeIndex = links.findIndex(({ path }) => path === pathname);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pressed, setPressed] = useState(false);

  const visibleIndex = dragIndex ?? activeIndex;

  // Hold the indicator at the drag position until the new route lands.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    setDragIndex(null);
  }, [pathname]);

  const getHoveredIndex = useCallback(
    (pos: number, axis: "x" | "y") => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return activeIndex;

      const size = axis === "x" ? rect.width : rect.height;
      const start = axis === "x" ? rect.left : rect.top;
      const cell = size / links.length;

      return Math.max(
        0,
        Math.min(links.length - 1, Math.floor((pos - start) / cell)),
      );
    },
    [activeIndex, links.length],
  );

  function release(event: React.PointerEvent) {
    pointer.current.active = false;
    setPressed(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function getLinkHandlers(index: number, axis: "x" | "y" = "x") {
    return {
      draggable: false,
      onClick: (event: React.MouseEvent) => {
        if (pointer.current.moved) {
          event.preventDefault();
          pointer.current.moved = false;
        }
      },
      onPointerDown: (event: React.PointerEvent) => {
        if (index !== activeIndex) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        pointer.current.active = true;
        pointer.current.moved = false;
        pointer.current.lastPos = axis === "x" ? event.clientX : event.clientY;
        setPressed(true);
      },
      onPointerMove: (event: React.PointerEvent) => {
        const p = pointer.current;
        if (
          !p.active ||
          !event.currentTarget.hasPointerCapture(event.pointerId)
        )
          return;

        const pos = axis === "x" ? event.clientX : event.clientY;
        if (Math.abs(pos - p.lastPos) > 2) p.moved = true;
        p.lastPos = pos;
        setDragIndex(getHoveredIndex(pos, axis));
      },
      onPointerUp: (event: React.PointerEvent) => {
        if (!pointer.current.active) return;
        release(event);
        if (dragIndex !== null && dragIndex !== activeIndex) {
          router.push(links[dragIndex].path);
        } else {
          setDragIndex(null);
        }
      },
      onPointerCancel: (event: React.PointerEvent) => {
        pointer.current.moved = false;
        release(event);
        setDragIndex(null);
      },
    };
  }

  return { trackRef, activeIndex, visibleIndex, pressed, getLinkHandlers };
}
