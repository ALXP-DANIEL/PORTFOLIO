import { env } from "@/env";

const GITHUB_API_BASE = "https://api.github.com";

export const GITHUB_SYNC_TAG = "github-sync";

export type GitHubRepo = {
  name: string;
  full_name: string;
  default_branch: string;
  fork: boolean;
  archived: boolean;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  pushed_at: string;
  updated_at: string;
  owner: { login: string };
};

function headers(accept = "application/vnd.github+json"): Headers {
  const h = new Headers({
    Accept: accept,
    "User-Agent": "portfolio-site",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  if (env.GITHUB_TOKEN) {
    h.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
  }
  return h;
}

async function request(
  path: string,
  tags: string[],
  accept?: string,
): Promise<Response | null> {
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: headers(accept),
    next: {
      // Refresh from GitHub at most weekly (ISR). A push webhook or the manual
      // refresh can bust the `github-sync` tag for an instant update.
      revalidate: 60 * 60 * 24 * 7,
      tags: [GITHUB_SYNC_TAG, ...tags],
    },
  });

  // Treat "not found" as a soft miss so callers can fall back gracefully.
  if (res.status === 404 || res.status === 409) return null;
  if (!res.ok) {
    throw new Error(`GitHub request failed for ${path}: ${res.status}`);
  }
  return res;
}

export async function fetchGitHubJson<T>(
  path: string,
  tags: string[],
): Promise<T | null> {
  const res = await request(path, tags);
  return res ? ((await res.json()) as T) : null;
}

export async function fetchGitHubText(
  path: string,
  tags: string[],
  accept = "application/vnd.github.raw+json",
): Promise<string | null> {
  const res = await request(path, tags, accept);
  return res ? await res.text() : null;
}

// The token is the only thing required — it identifies whose repos to scan.
export const isGitHubConfigured = () => Boolean(env.GITHUB_TOKEN);

// Safety ceiling so a misconfig can't loop forever (100 repos/page).
const MAX_REPO_PAGES = 20;

/**
 * List candidate repos to scan for a root `project.json`: every one of the
 * token owner's own, non-fork, non-archived repos (paginated — no 100 cap).
 */
export async function listShowcaseRepos(): Promise<GitHubRepo[]> {
  const all: GitHubRepo[] = [];

  for (let page = 1; page <= MAX_REPO_PAGES; page++) {
    const repos = await fetchGitHubJson<GitHubRepo[]>(
      `/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner`,
      [`repos:me:${page}`],
    );
    if (!repos || repos.length === 0) break;
    all.push(...repos);
    if (repos.length < 100) break; // last page
  }

  return all.filter((repo) => !repo.fork && !repo.archived);
}

/** Fetch a text file (e.g. metadata/info.json) from a repo, or null if absent. */
export function fetchRepoFile(repo: GitHubRepo, path: string) {
  return fetchGitHubText(
    `/repos/${repo.owner.login}/${repo.name}/contents/${path}`,
    [`repo:${repo.full_name}:${path}`],
  );
}

/** Fetch the rendered-source README markdown, or null. */
export function fetchRepoReadme(repo: GitHubRepo) {
  return fetchGitHubText(`/repos/${repo.owner.login}/${repo.name}/readme`, [
    `repo:${repo.full_name}:readme`,
  ]);
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

/** Resolve a repo-relative asset path to a raw.githubusercontent URL. */
export function resolveRepoAsset(repo: GitHubRepo, value: string): string {
  if (isAbsoluteUrl(value)) return value;
  const clean = value.replace(/^\.?\//, "").replace(/^\/+/, "");
  return `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/${clean}`;
}
