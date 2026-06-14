import type { ProjectManifest } from "@/lib/project-schema";

/**
 * Local hardcoded projects, authored in the same `project.json` shape used by
 * GitHub repos. `src/lib/work.ts` merges these with GitHub projects and dedupes
 * by slug, with GitHub entries winning when both sources use the same slug.
 *
 * Use this for private work, unreleased work, or projects that do not have a
 * repo-level `project.json` yet.
 */
export const projectsConfig: ProjectManifest[] = [
  {
    slug: "portfolio-new",
    title: "Portfolio New",
    type: "Personal Site",
    category: "Portfolio System",
    summary:
      "A motion-led portfolio built around GitHub-sourced work data, local hardcoded project entries, and focused project story pages.",
    overview:
      "This portfolio treats projects as content: GitHub repos can opt in with a root project.json, while local config can hardcode private or unreleased work. The interface keeps the work grid dense, the spotlight cinematic, and the detail pages structured for screenshots, stack, highlights, and README context.",
    year: "2026",
    spotlight: true,
    thumbnail: "https://picsum.photos/seed/portfolio-new-cover/1400/900",
    spotlightImage: "https://picsum.photos/seed/portfolio-new-hero/1800/1100",
    techStack: ["Next.js", "React", "TypeScript", "GSAP", "Tailwind CSS"],
    highlights: [
      "GitHub and local config project sources share one schema.",
      "Mouse-reactive project covers preserve the tilted image interaction.",
      "Slug detail pages render gallery, highlights, stack, actions, and README content.",
    ],
    previewImages: [
      {
        src: "https://picsum.photos/seed/portfolio-new-gallery-1/1400/900",
        caption: "Work index and spotlight system.",
      },
      {
        src: "https://picsum.photos/seed/portfolio-new-gallery-2/1400/900",
        caption: "Project detail layout with cover and narrative sections.",
      },
    ],
    actions: {
      open: "/",
      github: "https://github.com/ALXP-DANIEL",
    },
  },
];
