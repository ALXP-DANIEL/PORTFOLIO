import { cache } from "react";
import { projectsConfig } from "@/config/project";
import {
  fetchRepoFile,
  fetchRepoReadme,
  type GitHubRepo,
  isGitHubConfigured,
  listShowcaseRepos,
  resolveRepoAsset,
} from "@/lib/github";
import {
  defineProjects,
  manifestToProject,
  projectManifestSchema,
} from "@/lib/project-schema";
import type { Project } from "@/types/project";

/** Hand-authored projects from config, normalized once. */
const manualProjects = defineProjects(projectsConfig);

function parseJson(text: string | null): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Per-repo load + normalize                                                   */
/* -------------------------------------------------------------------------- */

async function loadRepoProject(repo: GitHubRepo): Promise<Project | null> {
  // Resilient per-repo: a transient failure on one repo (rate limit, 5xx,
  // network) must not reject the whole batch and blank the work page.
  try {
    // A root project.json is the opt-in signal; repos without one are ignored.
    const parsed = projectManifestSchema.safeParse(
      parseJson(await fetchRepoFile(repo, "project.json")),
    );
    if (!parsed.success) return null;

    const readme = await fetchRepoReadme(repo);

    return {
      ...manifestToProject(parsed.data, {
        resolveAsset: (src) => resolveRepoAsset(repo, src),
        fallbackSlug: repo.name,
        // For now, keep displayed project data limited to project.json.
        // fallbackYear: new Date(repo.pushed_at).getFullYear().toString(),
        // fallbackOpen: repo.homepage ?? undefined,
        // fallbackGithub: repo.html_url,
        // stats: {
        //   stars: repo.stargazers_count,
        //   pushedAt: repo.pushed_at,
        //   homepage: repo.homepage,
        //   url: repo.html_url,
        // },
      }),
      readme: readme ?? undefined,
    };
  } catch (error) {
    console.error(`[work] failed to load ${repo.full_name}:`, error);
    return null;
  }
}

async function loadFromGitHub(): Promise<Project[]> {
  const repos = await listShowcaseRepos();
  const loaded = await Promise.all(repos.map((repo) => loadRepoProject(repo)));
  return loaded
    .filter((project): project is Project => project !== null)
    .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
}

/** First occurrence of each slug wins (GitHub before manual). */
function dedupeBySlug(projects: Project[]): Project[] {
  const seen = new Set<string>();
  const out: Project[] = [];
  for (const project of projects) {
    if (seen.has(project.slug)) continue;
    seen.add(project.slug);
    out.push(project);
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* Public API — cached per request                                            */
/* -------------------------------------------------------------------------- */

export const getProjects = cache(async (): Promise<Project[]> => {
  let github: Project[] = [];
  if (isGitHubConfigured()) {
    try {
      github = await loadFromGitHub();
    } catch (error) {
      console.error("[work] GitHub load failed:", error);
    }
  }

  // GitHub + hand-authored, deduped. No demo fallback — empty means empty.
  return dedupeBySlug([...github, ...manualProjects]);
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = await getProjects();
  const featured = projects.filter((project) => project.featured);
  // Never show an empty spotlight — fall back to the most recent few.
  return featured.length > 0 ? featured : projects.slice(0, 3);
});

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectWithIndex(slug: string) {
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  return index === -1 ? null : { project: projects[index], index, projects };
}
