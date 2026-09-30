import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BriefcaseIcon,
  CaretUpIcon,
  CircleHalfIcon,
  CommandIcon,
  CopyIcon,
  EnvelopeIcon,
  FileTextIcon,
  FolderIcon,
  GithubLogoIcon,
  HouseIcon,
  type Icon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PaperPlaneTiltIcon,
  SunIcon,
  TerminalIcon,
  UserIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

import type { SocialLinks } from "@/config/sosial";

const SocialIcons = {
  X: XLogoIcon,
  GitHub: GithubLogoIcon,
  LinkedIn: LinkedinLogoIcon,
  Instagram: InstagramLogoIcon,
} as const satisfies Record<SocialLinks, Icon>;

export const Icons = {
  Layout: {
    Navigation: {
      Home: HouseIcon,
      Work: BriefcaseIcon,
      About: UserIcon,
      Contact: EnvelopeIcon,
    },

    Footer: {
      Social: SocialIcons,
      ArrowUpRight: ArrowUpRightIcon,
      CaretUp: CaretUpIcon,
    },

    Theme: {
      Sun: SunIcon,
      Dark: MoonIcon,
    },
  },

  Social: {
    ...SocialIcons,
  },

  Generic: {
    Back: ArrowLeftIcon,
    Forward: ArrowRightIcon,
  },

  Palette: {
    Command: CommandIcon,
    Search: MagnifyingGlassIcon,
    Copy: CopyIcon,
    Resume: FileTextIcon,
    Theme: CircleHalfIcon,
    Send: PaperPlaneTiltIcon,
    Project: FolderIcon,
    Terminal: TerminalIcon,
  },
} as const;
