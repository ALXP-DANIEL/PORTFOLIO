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
  {
    slug: "atlas-lab",
    title: "Atlas Lab",
    type: "Analytics Dashboard",
    category: "Data Product",
    summary:
      "A test analytics workspace for scanning KPIs, campaign health, and operational activity across teams.",
    overview:
      "Atlas Lab is seeded test content for exercising dense dashboard cards, preview galleries, and detail-page copy. It is intentionally local-only and can be removed when real projects are ready.",
    year: "2026",
    spotlight: true,
    thumbnail: "https://picsum.photos/seed/atlas-lab-cover/1400/900",
    spotlightImage: "https://picsum.photos/seed/atlas-lab-hero/1800/1100",
    techStack: ["Next.js", "TypeScript", "Charts", "PostgreSQL"],
    highlights: [
      "Metric cards for revenue, activity, and retention.",
      "Filterable reporting views with saved segments.",
      "Responsive dashboard layout for repeated daily use.",
    ],
    previewImages: [
      {
        src: "https://picsum.photos/seed/atlas-lab-preview-1/1400/900",
        caption: "Primary analytics overview.",
      },
      {
        src: "https://picsum.photos/seed/atlas-lab-preview-2/1400/900",
        caption: "Segment drilldown and trend chart.",
      },
      {
        src: "https://picsum.photos/seed/atlas-lab-preview-3/1400/900",
        caption: "Team activity report.",
      },
    ],
    actions: {
      open: "/work/atlas-lab",
      github: "https://github.com/ALXP-DANIEL",
    },
  },
  {
    slug: "nimbus-notes",
    title: "Nimbus Notes",
    type: "Knowledge Tool",
    category: "Productivity",
    summary:
      "A test note-taking product with linked references, quick capture, and project-context organization.",
    overview:
      "Nimbus Notes exists as local seed content to validate project cards, gallery thumbnails, and long-form detail pages with a productivity-focused project.",
    year: "2025",
    spotlight: false,
    thumbnail: "https://picsum.photos/seed/nimbus-notes-cover/1400/900",
    spotlightImage: "https://picsum.photos/seed/nimbus-notes-hero/1800/1100",
    techStack: ["React", "IndexedDB", "Tailwind CSS", "Search"],
    highlights: [
      "Fast capture flow for notes and tasks.",
      "Backlink-style project context.",
      "Offline-first local workspace behavior.",
    ],
    previewImages: [
      {
        src: "https://picsum.photos/seed/nimbus-notes-preview-1/1400/900",
        caption: "Workspace home and pinned notes.",
      },
      {
        src: "https://picsum.photos/seed/nimbus-notes-preview-2/1400/900",
        caption: "Linked editor context.",
      },
    ],
    actions: {
      open: "/work/nimbus-notes",
      github: "https://github.com/ALXP-DANIEL",
    },
  },
  {
    slug: "pulse-commerce",
    title: "Pulse Commerce",
    type: "Storefront",
    category: "Commerce",
    summary:
      "A test storefront focused on quick product scanning, cart flow, and editorial product presentation.",
    overview:
      "Pulse Commerce is seeded to test image-heavy project cards and a commerce-style case study with multiple preview moments.",
    year: "2025",
    spotlight: true,
    thumbnail: "https://picsum.photos/seed/pulse-commerce-cover/1400/900",
    spotlightImage: "https://picsum.photos/seed/pulse-commerce-hero/1800/1100",
    techStack: ["Next.js", "Stripe", "CMS", "Tailwind CSS"],
    highlights: [
      "Product grid optimized for scanning.",
      "Checkout-friendly action hierarchy.",
      "Editorial content slots for launches.",
    ],
    previewImages: [
      {
        src: "https://picsum.photos/seed/pulse-commerce-preview-1/1400/900",
        caption: "Product listing and filters.",
      },
      {
        src: "https://picsum.photos/seed/pulse-commerce-preview-2/1400/900",
        caption: "Product detail page.",
      },
      {
        src: "https://picsum.photos/seed/pulse-commerce-preview-3/1400/900",
        caption: "Checkout review flow.",
      },
    ],
    actions: {
      open: "/work/pulse-commerce",
      github: "https://github.com/ALXP-DANIEL",
    },
  },
  {
    slug: "signal-crm",
    title: "Signal CRM",
    type: "Operations App",
    category: "SaaS",
    summary:
      "A test CRM workspace for pipelines, contact history, task follow-up, and account-level context.",
    overview:
      "Signal CRM helps validate operational UI density in the work grid and detail page without relying on a live repository.",
    year: "2024",
    spotlight: false,
    thumbnail: "https://picsum.photos/seed/signal-crm-cover/1400/900",
    spotlightImage: "https://picsum.photos/seed/signal-crm-hero/1800/1100",
    techStack: ["React", "TanStack Query", "Prisma", "PostgreSQL"],
    highlights: [
      "Pipeline stages with account context.",
      "Task queues for follow-up workflows.",
      "Compact table and detail-panel interaction.",
    ],
    previewImages: [
      {
        src: "https://picsum.photos/seed/signal-crm-preview-1/1400/900",
        caption: "Pipeline overview.",
      },
      {
        src: "https://picsum.photos/seed/signal-crm-preview-2/1400/900",
        caption: "Account detail panel.",
      },
    ],
    actions: {
      open: "/work/signal-crm",
      github: "https://github.com/ALXP-DANIEL",
    },
  },
  {
    slug: "forge-studio",
    title: "Forge Studio",
    type: "Creative Tool",
    category: "Design Systems",
    summary:
      "A test design-system workspace for tokens, components, previews, and export-ready documentation.",
    overview:
      "Forge Studio is a local seed project used to stress-test visual cards, spotlight ordering, and detail sections for design-tool style work.",
    year: "2024",
    spotlight: true,
    thumbnail: "https://picsum.photos/seed/forge-studio-cover/1400/900",
    spotlightImage: "https://picsum.photos/seed/forge-studio-hero/1800/1100",
    techStack: ["Figma", "React", "Tokens", "Storybook"],
    highlights: [
      "Token preview and component documentation.",
      "Reusable component states for product teams.",
      "Export-focused design system workflow.",
    ],
    previewImages: [
      {
        src: "https://picsum.photos/seed/forge-studio-preview-1/1400/900",
        caption: "Token and component overview.",
      },
      {
        src: "https://picsum.photos/seed/forge-studio-preview-2/1400/900",
        caption: "Component state documentation.",
      },
      {
        src: "https://picsum.photos/seed/forge-studio-preview-3/1400/900",
        caption: "Export preview workspace.",
      },
    ],
    actions: {
      open: "/work/forge-studio",
      github: "https://github.com/ALXP-DANIEL",
    },
  },
];
