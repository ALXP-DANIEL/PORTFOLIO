import { env } from "@/env";
import type { SiteTypes } from "@/types/site";

const siteUrl =
  env.NEXT_PUBLIC_APP_URL ??
  env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";
const githubUrl = env.NEXT_PUBLIC_GITHUB_REPO_URL ?? "";

export const siteConfig: SiteTypes = {
  name: "",
  author: "",
  description: "",
  keywords: [],
  url: {
    base: siteUrl,
    author: "",
  },
  links: {
    github: githubUrl,
  },
  ogImage: `${siteUrl}/api/og`,
};
