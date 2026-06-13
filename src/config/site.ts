import { env } from "@/env";
import { SiteTypes } from "@/types/site";

export const siteConfig: SiteTypes = {
  name: "",
  author: "",
  description: "",
  keywords: [],
  url: {
    base: env.NEXT_PUBLIC_SITE_URL,
    author: "",
  },
  links: {
    github: "",
    instagram: "",
    linkedin: "",
    email: "",
  },
  ogImage: `${env.NEXT_PUBLIC_SITE_URL}/api/og`,
};
