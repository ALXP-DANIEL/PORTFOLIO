import type { HoverPreviewImage } from "@/components/ui/image-gallery";

type ProjectActionLink = {
  label: string;
  href: string;
};

type ProjectActions = {
  open: string;
  github: string;
  custom: ProjectActionLink;
};

export type ProjectDetail = {
  slug: string;
  title: string;
  type: string;
  kicker: string;
  summary: string;
  overview: string;
  year: string;
  stat: string;
  featured: boolean;
  techStack: readonly string[];
  highlights: readonly string[];
  previewImages: readonly HoverPreviewImage[];
  actions: ProjectActions;
};

export type ProjectLibraryItem = Pick<
  ProjectDetail,
  "slug" | "title" | "type" | "summary" | "year" | "actions"
> & {
  cover: string;
};

export type ProjectShowcaseItem = Pick<
  ProjectDetail,
  "slug" | "title" | "kicker" | "summary" | "stat" | "previewImages" | "actions"
>;

const FALLBACK_GITHUB_URL = "https://github.com";

export const getProjectDetailHref = (slug: string) => `/projects/${slug}`;

export const getPreviewImageSrc = (image: HoverPreviewImage) =>
  typeof image === "string" ? image : image.src;

export const projectDetails = [
  {
    slug: "atlas-workspace",
    title: "Atlas Workspace",
    type: "Collaboration Platform",
    kicker: "Featured Build",
    summary:
      "Realtime planning surface with streamlined editor tooling and release control.",
    overview:
      "Atlas Workspace brings planning, drafting, and release handoff into one collaborative surface. The product was shaped to keep editors, PMs, and reviewers inside a single flow with clear ownership, low-latency updates, and visible release checkpoints.",
    year: "2026",
    stat: "97 Lighthouse",
    featured: true,
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Realtime Sync",
      "Postgres",
    ],
    highlights: [
      "Unified planning lanes, editor blocks, and release approvals in one workspace.",
      "Reduced context switching for content teams with inline review and publishing states.",
      "Optimized the initial route shell so collaborative editing felt immediate on slower networks.",
    ],
    previewImages: [
      {
        src: "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
        title: "Workspace Overview",
        caption: "Live planning canvas with grouped project lanes.",
        alt: "Atlas workspace overview screen",
      },
      {
        src: "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
        title: "Release Control",
        caption: "Controlled rollouts with release checkpoints.",
        alt: "Release controls and deployment timeline",
      },
      {
        src: "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
        title: "Editor Surface",
        caption: "Focused writing area with version-aware edits.",
        alt: "Editor surface with content blocks",
      },
    ],
    actions: {
      open: "https://example.com/projects/atlas-workspace",
      github: FALLBACK_GITHUB_URL,
      custom: {
        label: "Case Study",
        href: getProjectDetailHref("atlas-workspace"),
      },
    },
  },
  {
    slug: "pulse-commerce",
    title: "Pulse Commerce",
    type: "Ecommerce",
    kicker: "Conversion System",
    summary:
      "Performance-first storefront with smart recommendations and fast checkout flow.",
    overview:
      "Pulse Commerce was designed as a conversion system rather than a generic storefront. Every screen balances speed, merchandizing flexibility, and purchasing confidence so campaign teams can launch quickly without sacrificing storefront polish.",
    year: "2026",
    stat: "+34% CVR",
    featured: true,
    techStack: ["Next.js", "TypeScript", "Stripe", "Analytics", "Tailwind CSS"],
    highlights: [
      "Built a modular merchandising system for seasonal campaigns and A/B landing pages.",
      "Shortened the checkout journey to three clear steps with stronger order context.",
      "Surfaced live funnel signals so growth teams could act on drop-off moments faster.",
    ],
    previewImages: [
      {
        src: "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
        title: "Landing Hero",
        caption: "Seasonal merchandising and high-contrast CTA layout.",
        alt: "Pulse Commerce homepage hero",
      },
      {
        src: "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
        title: "Product Grid",
        caption: "Quick filters and smart recommendation placements.",
        alt: "Product listing and filter interface",
      },
      {
        src: "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
        title: "Checkout Flow",
        caption: "Three-step checkout optimized for conversion speed.",
        alt: "Checkout steps and payment summary",
      },
      {
        src: "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
        title: "Revenue Dashboard",
        caption: "Realtime funnel and AOV metrics for campaign teams.",
        alt: "Commerce analytics dashboard",
      },
    ],
    actions: {
      open: "https://example.com/projects/pulse-commerce",
      github: FALLBACK_GITHUB_URL,
      custom: {
        label: "Live Demo",
        href: getProjectDetailHref("pulse-commerce"),
      },
    },
  },
  {
    slug: "nova-hiring",
    title: "Nova Hiring",
    type: "SaaS",
    kicker: "Hiring Platform",
    summary:
      "Application pipeline with AI summaries, role scorecards, and team collaboration.",
    overview:
      "Nova Hiring helps recruiting teams move from resume intake to offer approval without losing context. The experience emphasizes quick candidate scans, structured feedback, and a cleaner path for cross-functional interview teams to make decisions together.",
    year: "2025",
    stat: "5x faster review",
    featured: true,
    techStack: [
      "Next.js",
      "TypeScript",
      "AI Summaries",
      "Workflow Automation",
      "Postgres",
    ],
    highlights: [
      "Introduced AI-assisted summaries that accelerated first-pass candidate reviews.",
      "Turned messy panel feedback into weighted scorecards with clearer decision trails.",
      "Created a handoff-safe offer center for approvals, compensation comparison, and final sign-off.",
    ],
    previewImages: [
      {
        src: "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
        title: "Candidate Pipeline",
        caption: "Role stages, interview ownership, and score trends.",
        alt: "Hiring pipeline board with candidate cards",
      },
      {
        src: "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
        title: "Profile Summary",
        caption: "AI-generated highlights with confidence indicators.",
        alt: "Candidate profile summary view",
      },
      {
        src: "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
        title: "Panel Feedback",
        caption: "Structured notes and weighted final recommendations.",
        alt: "Interview panel feedback form",
      },
      {
        src: "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
        title: "Offer Center",
        caption: "Approval chain and offer package comparison.",
        alt: "Offer center with approvals",
      },
    ],
    actions: {
      open: "https://example.com/projects/nova-hiring",
      github: FALLBACK_GITHUB_URL,
      custom: {
        label: "Read Details",
        href: getProjectDetailHref("nova-hiring"),
      },
    },
  },
  {
    slug: "beacon-ops",
    title: "Beacon Ops",
    type: "Dashboard",
    kicker: "Operations Board",
    summary: "Live operations board for logistics and incident response teams.",
    overview:
      "Beacon Ops turns high-pressure operations into a readable command surface. It centralizes active incidents, regional status, and teammate ownership so dispatch and response teams can triage fast without digging through multiple tools.",
    year: "2025",
    stat: "99.9% uptime",
    featured: false,
    techStack: [
      "Next.js",
      "TypeScript",
      "Maps",
      "Realtime Events",
      "Incident Workflows",
    ],
    highlights: [
      "Gave response teams a single board for queue health, geography, and incident severity.",
      "Highlighted owner shifts and escalation paths directly inside the main dispatch view.",
      "Improved readability for dark-room monitoring with bold states and clearer critical signals.",
    ],
    previewImages: [
      {
        src: "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
        title: "Regional Command View",
        caption: "Status lanes and active dispatch coverage across zones.",
        alt: "Beacon Ops regional operations dashboard",
      },
      {
        src: "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
        title: "Incident Feed",
        caption: "Priority queue with owner, SLA, and escalation markers.",
        alt: "Beacon Ops incident feed",
      },
      {
        src: "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
        title: "Response Summary",
        caption: "High-level metrics for active incidents and response load.",
        alt: "Beacon Ops summary metrics",
      },
    ],
    actions: {
      open: "https://example.com/projects/beacon-ops",
      github: FALLBACK_GITHUB_URL,
      custom: {
        label: "Case Study",
        href: getProjectDetailHref("beacon-ops"),
      },
    },
  },
  {
    slug: "framefolio",
    title: "Framefolio",
    type: "Portfolio",
    kicker: "Creative Showcase",
    summary:
      "Creative showcase with CMS-powered content and smooth transitions.",
    overview:
      "Framefolio focuses on giving case studies more atmosphere without getting in the way of the work. The experience leans on editorial layouts, image-led storytelling, and CMS-driven pacing so creators can publish polished narratives without hand-coding every page.",
    year: "2024",
    stat: "2.4x longer sessions",
    featured: false,
    techStack: [
      "Next.js",
      "TypeScript",
      "Headless CMS",
      "Motion",
      "Tailwind CSS",
    ],
    highlights: [
      "Created an editorial page system that adapts to image-heavy and text-heavy stories.",
      "Improved case study pacing with progressive reveals and smoother section transitions.",
      "Enabled non-technical creators to publish polished updates from a CMS workflow.",
    ],
    previewImages: [
      {
        src: "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
        title: "Landing Experience",
        caption:
          "Editorial hero layout with art direction and project framing.",
        alt: "Framefolio landing page",
      },
      {
        src: "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
        title: "Case Study Builder",
        caption: "Structured story blocks driven by CMS content.",
        alt: "Framefolio case study builder",
      },
      {
        src: "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
        title: "Collection Grid",
        caption: "Responsive gallery system for campaigns, stills, and motion.",
        alt: "Framefolio project collection grid",
      },
    ],
    actions: {
      open: "https://example.com/projects/framefolio",
      github: FALLBACK_GITHUB_URL,
      custom: {
        label: "Preview",
        href: getProjectDetailHref("framefolio"),
      },
    },
  },
  {
    slug: "signal-api",
    title: "Signal API",
    type: "Developer Tool",
    kicker: "Developer Product",
    summary:
      "Observability toolkit designed for instant debugging with clean onboarding UX.",
    overview:
      "Signal API is a developer-facing toolkit for teams who need traces, alerts, and service health without heavyweight setup. The product pairs technical depth with a calmer onboarding flow so new teams can get to first signal quickly.",
    year: "2024",
    stat: "< 80ms avg",
    featured: true,
    techStack: [
      "Next.js",
      "TypeScript",
      "Tracing",
      "Alerting",
      "Developer Docs",
    ],
    highlights: [
      "Balanced advanced observability workflows with a much cleaner self-serve onboarding path.",
      "Added fast path diagnostics that surfaced likely issues before users dug into traces.",
      "Connected alerts, incident context, and traces in a tighter troubleshooting loop.",
    ],
    previewImages: [
      {
        src: "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
        title: "Trace Explorer",
        caption: "Latency map with endpoint-level drilldown.",
        alt: "API trace explorer with performance graph",
      },
      {
        src: "https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif",
        title: "Alert Rules",
        caption: "Threshold and anomaly rules with route controls.",
        alt: "Alert rule configuration panel",
      },
      {
        src: "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
        title: "Incident Timeline",
        caption: "Event stream with linked logs and traces.",
        alt: "Incident timeline and event correlation",
      },
      {
        src: "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
        title: "Quick Diagnostics",
        caption: "One-click health snapshots for active services.",
        alt: "Quick diagnostics service health cards",
      },
    ],
    actions: {
      open: "https://example.com/projects/signal-api",
      github: FALLBACK_GITHUB_URL,
      custom: {
        label: "Docs",
        href: getProjectDetailHref("signal-api"),
      },
    },
  },
  {
    slug: "orbit-notes",
    title: "Orbit Notes",
    type: "Productivity",
    kicker: "Knowledge System",
    summary: "Knowledge hub blending notes, tasks, and project context.",
    overview:
      "Orbit Notes combines writing, planning, and project memory into a single workspace built for fast-moving teams. The focus is on making context reusable so docs, tasks, and linked decisions stay close to the work they support.",
    year: "2023",
    stat: "3k linked docs",
    featured: false,
    techStack: [
      "Next.js",
      "TypeScript",
      "Search",
      "Content Graph",
      "Productivity Workflows",
    ],
    highlights: [
      "Blended project notes, tasks, and contextual references inside one writing flow.",
      "Introduced cross-document linking so teams could recover decisions without manual digging.",
      "Designed quick-capture patterns that worked on both desktop planning and daily note-taking.",
    ],
    previewImages: [
      {
        src: "https://i.pinimg.com/originals/f8/ba/9b/f8ba9b7f92fa91361e251c72e213c11a.gif",
        title: "Workspace Home",
        caption:
          "Recent notes, pinned workspaces, and active tasks in one view.",
        alt: "Orbit Notes workspace home",
      },
      {
        src: "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
        title: "Connected Notes",
        caption:
          "Linked references and lightweight task context beside the editor.",
        alt: "Orbit Notes connected editor",
      },
      {
        src: "https://i.pinimg.com/736x/64/20/b5/6420b5ba0dd45dc35aae9705c8e275dd.jpg",
        title: "Project Context",
        caption: "Shared timelines and decisions mapped back to related notes.",
        alt: "Orbit Notes project context dashboard",
      },
    ],
    actions: {
      open: "https://example.com/projects/orbit-notes",
      github: FALLBACK_GITHUB_URL,
      custom: {
        label: "Overview",
        href: getProjectDetailHref("orbit-notes"),
      },
    },
  },
] satisfies readonly ProjectDetail[];

export const projects: ProjectLibraryItem[] = projectDetails.map((project) => ({
  slug: project.slug,
  title: project.title,
  type: project.type,
  summary: project.summary,
  year: project.year,
  cover: getPreviewImageSrc(project.previewImages[0]),
  actions: project.actions,
}));

export const carouselProjects: ProjectShowcaseItem[] = projectDetails
  .filter((project) => project.featured)
  .map((project) => ({
    slug: project.slug,
    title: project.title,
    kicker: project.kicker,
    summary: project.summary,
    stat: project.stat,
    previewImages: project.previewImages,
    actions: project.actions,
  }));

export const getProjectBySlug = (slug: string) =>
  projectDetails.find((project) => project.slug === slug);

export const getAllProjectParams = () =>
  projectDetails.map((project) => ({
    slug: project.slug,
  }));
