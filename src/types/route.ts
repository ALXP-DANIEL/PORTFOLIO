import type { ElementType } from "react";

export type RouteTypes = {
  path: string;
  label: string;
  icon: ElementType;
};

export type NavigationTransition = {
  duration: number;
  ease: string;
};

export type NavigationProps = {
  links: readonly RouteTypes[];
  activeTransition: NavigationTransition;
};
