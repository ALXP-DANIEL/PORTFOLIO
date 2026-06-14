"use client";

import * as React from "react";

type ViewTransitionShellProps = {
  children: React.ReactNode;
};

export default function ViewTransitionShell({
  children,
}: ViewTransitionShellProps) {
  const ViewTransition = (
    React as typeof React & {
      ViewTransition?: React.ComponentType<{ children: React.ReactNode }>;
    }
  ).ViewTransition;

  if (!ViewTransition) {
    return <>{children}</>;
  }

  return <ViewTransition>{children}</ViewTransition>;
}
