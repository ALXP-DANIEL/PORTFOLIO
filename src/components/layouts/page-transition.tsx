"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

type PageTransitionProps = {
  children: React.ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <ViewTransition
      key={pathname}
      enter={{ "page-slide": "page-slide", default: "none" }}
      exit={{ "page-slide": "page-slide", default: "none" }}
      default="none"
    >
      <div className="min-h-[calc(100dvh-10rem)]">{children}</div>
    </ViewTransition>
  );
}
