import type { ComponentType, CSSProperties } from "react";

export type NavigationIconWeight =
  | "thin"
  | "light"
  | "regular"
  | "bold"
  | "fill"
  | "duotone";

export type NavigationActionIconComponent = ComponentType<{
  size?: number;
  weight?: NavigationIconWeight;
  className?: string;
  style?: CSSProperties;
}>;

export type NavigationActionClassNames = {
  root?: string;
  content?: string;
  label?: string;
  icon?: string;
  iconWrapper?: string;
};

export type NavigationActionIconSpec = {
  name: string;
  position?: "left" | "right";
  size?: number;
  weight?: NavigationIconWeight;
  className?: string;
  style?: CSSProperties;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
};

type NavigationActionBase = {
  label?: string;
  disabled?: boolean;
  ariaLabel?: string;

  className?: string;
  style?: CSSProperties;
  classNames?: NavigationActionClassNames;

  icon?: NavigationActionIconSpec;
};

export type NavigationAnchorAction = NavigationActionBase & {
  kind: "a";
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
};

export type NavigationLinkAction = NavigationActionBase & {
  kind: "link";
  href: string;
};

export type NavigationButtonAction = NavigationActionBase & {
  kind: "button";
  actionId: string;
  type?: "button" | "submit" | "reset";
};

export type NavigationActionSpec =
  | NavigationAnchorAction
  | NavigationLinkAction
  | NavigationButtonAction;
