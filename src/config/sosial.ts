import type { SosialsTypes } from "@/types/sosial";

export const socialsConfig = [
  {
    platform: "X",
    link: "",
    icon: "X",
  },
  {
    platform: "GitHub",
    link: "https://github.com/ALXP-DANIEL",
    icon: "GitHub",
  },
  {
    platform: "Discord",
    link: "",
    icon: "Discord",
  },
  {
    platform: "LinkedIn",
    link: "",
    icon: "LinkedIn",
  },
  {
    platform: "Instagram",
    link: "",
    icon: "Instagram",
  },
] as const satisfies readonly SosialsTypes[];

export type SocialLinks = (typeof socialsConfig)[number]["icon"];
