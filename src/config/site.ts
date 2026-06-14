import { env } from "@/env";
import type { SiteTypes } from "@/types/site";

export const siteConfig: SiteTypes = {
  name: "Muhammad Alif Daniel Bin Mohd Hairul Hezzelin",
  author: "ALXP-DANIEL",
  description:
    "Full-stack web developer building web applications with a focus on clean architecture, practical problem-solving, and thoughtful user experience.",
  keywords: [
    "ALXP-DANIEL",
    "portfolio",
    "web development",
    "full-stack",
    "clean architecture",
    "practical problem-solving",
    "thoughtful user experience",
  ],
  url: {
    base: env.NEXT_PUBLIC_SITE_URL,
    author: "https://alifdaniel.dpdns.org",
  },
  links: {
    github: "https://github.com/ALXP-DANIEL",
    instagram: "https://www.instagram.com/thealifhaker1/",
    linkedin: "https://www.linkedin.com/in/thealifhaker1",
    email: "alifdaniel.workspace@gmail.com",
  },
  ogImage: `${env.NEXT_PUBLIC_SITE_URL}/api/og`,
};
