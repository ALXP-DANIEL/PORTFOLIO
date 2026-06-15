import type { SosialsTypes } from "@/types/sosial";

export const socialsConfig = [
  {
    platform: "X",
    link: "https://x.com/thealifhaker1",
    icon: "X",
  },
  {
    platform: "GitHub",
    link: "https://github.com/ALXP-DANIEL",
    icon: "GitHub",
  },
  {
    platform: "Discord",
    link: "https://discord.gg/your-server",
    icon: "Discord",
  },
  {
    platform: "LinkedIn",
    link: "https://www.linkedin.com/in/thealifhaker1/",
    icon: "LinkedIn",
  },
  {
    platform: "Instagram",
    link: "https://www.instagram.com/thealifhaker1/",
    icon: "Instagram",
  },
] as const satisfies readonly SosialsTypes[];

export type SocialLinks = (typeof socialsConfig)[number]["icon"];
