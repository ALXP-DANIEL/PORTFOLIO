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
      // Cache indefinitely — freshness comes solely from the push webhook,
      // which busts the `github-sync` tag via /api/revalidate.
      revalidate: false,
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

/**
 * List candidate repos to scan for a root `project.json`: the token owner's
 * own, non-fork, non-archived repos.
 */
export async function listShowcaseRepos(): Promise<GitHubRepo[]> {
  const repos = await fetchGitHubJson<GitHubRepo[]>(
    `/user/repos?per_page=100&sort=updated&affiliation=owner`,
    ["repos:me"],
  );
  return (repos ?? []).filter((repo) => !repo.fork && !repo.archived);
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
