import type { Metadata } from "next";
import ProjectsLibrary from "@/app/(pages)/projects/_components/projects-library";
import ProjectsShowcase from "@/app/(pages)/projects/_components/projects-showcase";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Projects",
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | Projects`,
    description: siteConfig.description,
    url: "/projects",
    images: [siteConfig.ogImage],
  },
  twitter: {
    title: `${siteConfig.name} | Projects`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function ProjectPage() {
  return (
    <>
      <ProjectsShowcase />
      <ProjectsLibrary />
    </>
  );
}
