import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Blog",
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | Blog`,
    description: siteConfig.description,
    url: "/blog",
    images: [siteConfig.ogImage],
  },
  twitter: {
    title: `${siteConfig.name} | Blog`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function BlogPage() {
  return (
    <>
      <span>later</span>
      BlogPage
    </>
  );
}
