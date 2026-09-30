"use client";

import { ViewTransition } from "react";

type ViewTransitionShellProps = {
  children: React.ReactNode;
};

export default function ViewTransitionShell({
  children,
}: ViewTransitionShellProps) {
  return <ViewTransition>{children}</ViewTransition>;
}
