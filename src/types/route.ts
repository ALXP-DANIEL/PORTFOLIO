import type { ElementType } from "react";

export type RouteTypes = {
  path: string;
  label: string;
  icon: ElementType;
};

export type NavigationTransitionTypes = {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
};

export type NavigationProps = {
  links: readonly RouteTypes[];
  pageTransitionTypes: string[];
  activeTransition: NavigationTransitionTypes;
};
