import { env } from "@/env";
import type { SiteTypes } from "@/types/site";

const siteUrl = env.NEXT_PUBLIC_APP_URL ?? env.NEXT_PUBLIC_SITE_URL ?? "";
const githubUrl = "https://github.com/THEALIFHAKER1";
const instagramUrl = "https://instagram.com/thealifhaker1";
const linkedinUrl = "https://linkedin.com/in/thealifhaker1";
const email = "alifdaniel.workspace@gmail.com";

export const siteConfig: SiteTypes = {
  name: "Alif Daniel",
  author: "Muhammad Alif Daniel Bin Mohd Hairul Hezzelin",
  description:
    "Portfolio of Alif Daniel, a fullstack web developer focused on React, Next.js, scalable UI systems, and legacy platform migrations.",
  keywords: [
    "Alif Daniel",
    "Muhammad Alif Daniel",
    "fullstack web developer",
    "React developer",
    "Next.js portfolio",
    "TypeScript developer",
    "Tailwind CSS",
    "Shadcn UI",
    "Laravel",
    "NestJS",
  ],
  url: {
    base: siteUrl,
    author: "THEALIFHAKER1",
  },
  links: {
    github: githubUrl,
    instagram: instagramUrl,
    linkedin: linkedinUrl,
    email: email,
  },
  ogImage: siteUrl ? `${siteUrl}/api/og` : "",
};
