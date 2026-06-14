import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  BriefcaseIcon,
  CaretUpIcon,
  DiscordLogoIcon,
  EnvelopeIcon,
  GithubLogoIcon,
  HouseIcon,
  type Icon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  UserIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

import type { SocialLinks } from "@/config/sosial";

const SocialIcons = {
  X: XLogoIcon,
  GitHub: GithubLogoIcon,
  LinkedIn: LinkedinLogoIcon,
  Discord: DiscordLogoIcon,
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
  },

  Social: {
    ...SocialIcons,
  },

  Generic: {
    Back: ArrowLeftIcon,
  },
} as const;
