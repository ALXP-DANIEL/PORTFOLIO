import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import ProjectPage from "../projects/page";
import EducationSection from "./_components/education-section";
import ExperienceSection from "./_components/experience-section";
import Hero from "./_components/hero";

const homeSections = [
  { label: "Experience", Component: ExperienceSection },
  { label: "Education", Component: EducationSection },
  { label: "Projects", Component: ProjectPage },
] as const;

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

      {homeSections.map(({ label, Component }) => (
        <section key={label} className="space-y-6 py-5 sm:py-10">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </p>

          <Component />
        </section>
      ))}
    </>
  );
}
