import type { Metadata } from "next";

import StatusPage from "@/components/ui/status-page";
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
    <StatusPage
      eyebrow="Coming Soon"
      code="Stay tuned for updates!"
      title="Articles are on the roadmap."
      description="In the meantime, feel free to check out my projects and experience sections to learn more about my work and background."
      actions={[
        {
          href: "/",
          label: "Back home",
          variant: "secondary",
        },
      ]}
    />
  );
}
