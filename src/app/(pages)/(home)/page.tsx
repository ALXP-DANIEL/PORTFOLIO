import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BlogPage from "../blog/page";
import ProjectPage from "../projects/page";
import Hero from "./_components/hero";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | Home`,
    description: siteConfig.description,
    url: "/",
    images: [siteConfig.ogImage],
  },
  twitter: {
    title: `${siteConfig.name} | Home`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="space-y-6 py-10 sm:py-14">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Projects
        </h2>
        <ProjectPage />
      </section>

      <section className="space-y-6 py-10 sm:py-14">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Blog
        </h2>
        <BlogPage />
      </section>
    </>
  );
}
