import type { ElementType } from "react";

export type RouteTypes = {
  path: string;
  label: string;
  icon: ElementType;
};

export type NavigationTransition = {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
};

export type NavigationProps = {
  links: readonly RouteTypes[];
  activeTransition: NavigationTransition;
};
