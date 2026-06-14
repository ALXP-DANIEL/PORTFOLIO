import { env } from "@/env";
import type { SiteTypes } from "@/types/site";

export const siteConfig: SiteTypes = {
  name: "Muhammad Alif Daniel Bin Mohd Hairul Hezzelin",
  author: "ALXP-DANIEL",
  description:
    "Full-stack web developer building role-based web apps with Angular, React, Node, Express, Laravel, Prisma, and MySQL — focused on clean code, practical problem-solving, and better UX.",
  keywords: [
    "Alif Daniel",
    "Full-Stack Web Developer",
    "Frontend Developer",
    "Angular",
    "React",
    "Next.js",
    "Node.js",
    "Laravel",
    "Prisma",
    "TypeScript",
  ],
  url: {
    base: env.NEXT_PUBLIC_SITE_URL,
    author: "https://alifdaniel.dpdns.org",
  },
  links: {
    github: "https://github.com/ALXP-DANIEL",
    instagram: "",
    linkedin: "",
    email: "alifdaniel.workspace@gmail.com",
  },
  ogImage: `${env.NEXT_PUBLIC_SITE_URL}/api/og`,
};
