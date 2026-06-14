import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* Domain model — schemas are the single source of truth; types are inferred. */
/* -------------------------------------------------------------------------- */

export const projectImageSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});
export type ProjectImage = z.infer<typeof projectImageSchema>;

export const projectActionsSchema = z.object({
  open: z.string().optional(),
  github: z.string().optional(),
});
export type ProjectActions = z.infer<typeof projectActionsSchema>;

/** Section toggles (authored per-repo in element.json, or defaulted). */
export const projectFlagsSchema = z.object({
  spotlight: z.boolean(),
  showReadme: z.boolean(),
  showGallery: z.boolean(),
  showHighlights: z.boolean(),
  showStack: z.boolean(),
  showRepoStats: z.boolean(),
});
export type ProjectFlags = z.infer<typeof projectFlagsSchema>;

export const DEFAULT_FLAGS: ProjectFlags = {
  spotlight: false,
  showReadme: true,
  showGallery: true,
  showHighlights: true,
  showStack: true,
  showRepoStats: false,
};

/** Live repo facts pulled from the GitHub API. */
export const projectStatsSchema = z.object({
  stars: z.number(),
  pushedAt: z.string(),
  homepage: z.string().nullable(),
  url: z.string(),
});
export type ProjectStats = z.infer<typeof projectStatsSchema>;

/** The internal, normalized project the app renders. */
export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  type: z.string(),
  category: z.string(),
  summary: z.string(),
  overview: z.string().optional(),
  year: z.string(),
  tech: z.array(z.string()),
  highlights: z.array(z.string()),
  gallery: z.array(projectImageSchema),
  cover: z.string().optional(),
  /** Raw markdown body, sourced from the repo README. */
  readme: z.string().optional(),
  featured: z.boolean(),
  flags: projectFlagsSchema,
  stats: projectStatsSchema.optional(),
  actions: projectActionsSchema,
});
export type Project = z.infer<typeof projectSchema>;

/* -------------------------------------------------------------------------- */
/* Authoring input — the `project.json` shape (repos + hardcoded entries).     */
/* -------------------------------------------------------------------------- */

const imageInputSchema = z.union([
  z.string(),
  z.object({
    src: z.string(),
    alt: z.string().optional(),
    title: z.string().optional(),
    caption: z.string().optional(),
  }),
]);

/**
 * Matches the repo-root `project.json` convention (e.g.
 * github.com/ALXP-DANIEL/METEO/blob/master/project.json). Only `title` is
 * strictly required; everything else has a sensible default.
 */
export const projectManifestSchema = z.object({
  slug: z.string().optional(),
  title: z.string(),
  type: z.string().default("Project"),
  category: z.string().default(""),
  summary: z.string().default(""),
  overview: z.string().optional(),
  year: z.string().optional(),
  spotlight: z.boolean().default(false),
  techStack: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  spotlightImage: z.string().optional(),
  previewImages: z.array(imageInputSchema).default([]),
  actions: projectActionsSchema.default({}),
});

/** The hand-authored `project.json` shape. Write these to hardcode projects. */
export type ProjectManifest = z.input<typeof projectManifestSchema>;

type ManifestData = z.output<typeof projectManifestSchema>;
type ImageInput = z.infer<typeof imageInputSchema>;

/* -------------------------------------------------------------------------- */
/* Normalization — manifest input → internal Project                          */
/* -------------------------------------------------------------------------- */

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function normalizeImage(
  resolve: (src: string) => string,
  image: ImageInput,
): ProjectImage {
  const raw = typeof image === "string" ? { src: image } : image;
  const title = "title" in raw ? raw.title : undefined;
  return {
    src: resolve(raw.src),
    alt: raw.alt ?? title,
    caption: raw.caption ?? title,
  };
}

export type ManifestContext = {
  /** Map a relative asset path to an absolute URL (GitHub raw); identity by default. */
  resolveAsset?: (src: string) => string;
  fallbackSlug?: string;
  fallbackYear?: string;
  fallbackOpen?: string;
  fallbackGithub?: string;
  stats?: ProjectStats;
};

/** Normalize a validated manifest into the internal `Project` shape. */
export function manifestToProject(
  data: ManifestData,
  ctx: ManifestContext = {},
): Project {
  const resolve = ctx.resolveAsset ?? ((src) => src);
  const flags: ProjectFlags = { ...DEFAULT_FLAGS, spotlight: data.spotlight };

  // Gallery is only the authored preview strip; the main thumbnail/cover stays
  // separate so hero images do not appear in the preview thumbnails.
  const gallery = data.previewImages.map((image) =>
    normalizeImage(resolve, image),
  );

  return {
    slug: data.slug
      ? slugify(data.slug)
      : slugify(ctx.fallbackSlug ?? data.title),
    title: data.title,
    type: data.type,
    category: data.category,
    summary: data.summary,
    overview: data.overview,
    year: data.year ?? ctx.fallbackYear ?? new Date().getFullYear().toString(),
    tech: data.techStack,
    highlights: data.highlights,
    gallery,
    cover: data.thumbnail ? resolve(data.thumbnail) : undefined,
    featured: data.spotlight,
    flags,
    stats: ctx.stats,
    actions: {
      open: data.actions.open ?? ctx.fallbackOpen,
      github: data.actions.github ?? ctx.fallbackGithub,
    },
  };
}

/** Validate + normalize hand-authored `project.json`-shaped entries. */
export function defineProjects(manifests: ProjectManifest[]): Project[] {
  return manifests.map((manifest) =>
    manifestToProject(projectManifestSchema.parse(manifest)),
  );
}

/** Deterministic hue (0-359) derived from a slug, so each project owns a colour. */
export function projectHue(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 360;
  }
  return hash;
}
