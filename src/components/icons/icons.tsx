import {
  ArrowUpRightIcon,
  CaretUpIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  ListIcon,
  MoonIcon,
  SunIcon,
  XIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

export const Icons = {
  arrowUpRight: ArrowUpRightIcon,
  caretUp: CaretUpIcon,
  close: XIcon,
  github: GithubLogoIcon,
  linkedin: LinkedinLogoIcon,
  menu: ListIcon,
  moon: MoonIcon,
  sun: SunIcon,
  x: XLogoIcon,
} as const;

export type IconName = keyof typeof Icons;
