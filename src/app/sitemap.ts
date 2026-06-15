import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProjects } from "@/lib/work";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.base;
  const now = new Date();

  const staticRoutes = ["", "/work", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projects = await getProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${base}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
