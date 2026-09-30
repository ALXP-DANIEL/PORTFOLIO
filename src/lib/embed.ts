import { siteConfig } from "@/config/site";
import { GITHUB_SYNC_TAG } from "@/lib/github";

/** Hosts this portfolio is served from; a CSP naming one of them allows us. */
const OWN_HOSTS = [siteConfig.url.base, siteConfig.url.author].map(
  (url) => new URL(url).host,
);

/**
 * Whether a site lets other origins frame it, read from its response headers.
 * Anything unreachable or ambiguous counts as "no", so the caller falls back
 * to a plain new-tab link.
 */
export async function isEmbeddable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 * 60 * 24 * 7, tags: [GITHUB_SYNC_TAG] },
    });
    if (!res.ok) return false;

    const frameOptions = res.headers.get("x-frame-options")?.toLowerCase();
    if (frameOptions === "deny" || frameOptions === "sameorigin") return false;

    const csp = res.headers.get("content-security-policy") ?? "";
    const ancestors = csp
      .split(";")
      .map((directive) => directive.trim().toLowerCase())
      .find((directive) => directive.startsWith("frame-ancestors"));
    if (ancestors) {
      const sources = ancestors.split(/\s+/).slice(1);
      const allowsUs = sources.some(
        (source) =>
          source === "*" || OWN_HOSTS.some((host) => source.includes(host)),
      );
      if (!allowsUs) return false;
    }

    return true;
  } catch {
    return false;
  }
}
