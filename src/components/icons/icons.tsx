import {
  ArrowSquareOutIcon,
  ArrowUpRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  ListIcon,
  MoonIcon,
  SparkleIcon,
  SunIcon,
  XIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

export const Icons = {
  arrowSquareOut: ArrowSquareOutIcon,
  arrowUpRight: ArrowUpRightIcon,
  caretLeft: CaretLeftIcon,
  caretRight: CaretRightIcon,
  caretUp: CaretUpIcon,
  close: XIcon,
  github: GithubLogoIcon,
  linkedin: LinkedinLogoIcon,
  menu: ListIcon,
  moon: MoonIcon,
  sparkle: SparkleIcon,
  sun: SunIcon,
  x: XLogoIcon,
} as const;

export type IconName = keyof typeof Icons;
