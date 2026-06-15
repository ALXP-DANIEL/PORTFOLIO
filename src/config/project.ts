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
  // for future use, currently empty as all projects are sourced from GitHub
];
