# Work as a GitHub-driven CMS

The `/work` section pulls projects from your GitHub repos, refreshing weekly
(plus an instant manual refresh — press `R` on `/work`). You can also hardcode
projects locally in [`src/config/project.ts`](../src/config/project.ts); they're
merged in alongside the GitHub-sourced ones.

## How it fits together

```
Your GitHub repos (via the token's /user/repos)
   │  src/lib/github.ts   (fetch + cache tags + asset URL resolution)
   ├─ project.json   → structured Project (zod-validated; presence = opt-in)
   └─ README.md      → markdown body (rendered safely, no JSX)
        │  src/lib/work.ts   (normalize + cache + seed fallback)
        ▼
   getProjects() / getFeaturedProjects() / getProject(slug)
        │
   work/page.tsx · work/[slug]/page.tsx  (server)  →  client views
```

Discovery uses the token's `/user/repos`: every non-fork, non-archived repo you
own is scanned for a root **`project.json`**. A repo without one is ignored.

## Environment

Set in `.env` (all optional — omit to use seed data):

| Variable       | Purpose                                                         | Default |
| -------------- | --------------------------------------------------------------- | ------- |
| `GITHUB_TOKEN` | **The only var.** A read-only PAT; the owner is derived from it | —       |

The integration activates as soon as `GITHUB_TOKEN` is set — discovery uses
`/user/repos`, so it shows **your** repos automatically. A failed/empty load
degrades gracefully (per-repo failures are skipped; manual config still shows).

GitHub data is cached and revalidated **weekly** (ISR), so new repos and edits
appear on their own within a week — no webhooks, no extra config.

## Repo convention: `project.json`

Drop a `project.json` at the repo root (see a real example at
[ALXP-DANIEL/METEO](https://github.com/ALXP-DANIEL/METEO/blob/master/project.json)):

```json
{
  "slug": "meteo",
  "title": "METEO",
  "type": "Weather App",
  "category": "Realtime Forecast",
  "summary": "Real-time weather app built with Next.js…",
  "overview": "Longer paragraph shown above the README…",
  "year": "2026",
  "spotlight": true,
  "thumbnail": "./public/preview.png",
  "spotlightImage": "./public/preview-hero.png",
  "techStack": ["Next.js", "TypeScript", "Tailwind CSS"],
  "highlights": ["Current conditions", "7-day forecast", "Interactive map"],
  "previewImages": [{ "src": "https://…/shot.gif", "title": "Home", "caption": "…", "alt": "…" }],
  "actions": { "open": "https://meteo.example.com", "github": "https://github.com/…" }
}
```

Field mapping:

| `project.json`             | Used for                                                       |
| -------------------------- | -------------------------------------------------------------- |
| `title`                    | **required** — everything else has a default                   |
| `slug`                     | detail route (`/work/<slug>`); defaults to slugified repo name |
| `spotlight`                | promotes into the featured carousel                            |
| `thumbnail`                | card / hero cover image                                        |
| `spotlightImage`           | leads the detail gallery                                       |
| `techStack`                | stack tags                                                     |
| `highlights`               | highlights list                                                |
| `previewImages[]`          | detail gallery (string or `{ src, title, caption, alt }`)      |
| `overview`                 | intro paragraph above the README                               |
| `actions.open` / `.github` | buttons (default to repo homepage / URL)                       |

Relative paths (`./public/preview.png`) resolve to `raw.githubusercontent.com`
automatically; absolute URLs pass through untouched. The repo's `README.md` is
rendered as the long-form body below the overview.

## Keeping it fresh

- **Automatic:** GitHub data revalidates **weekly** (ISR) — zero config.
- **Instant:** open `/work` and press **`R`**. It hits the public
  `GET /api/revalidate`, busts the `github-sync` cache tag, and re-renders.
  No key/secret — worst case of abuse is a forced GitHub re-fetch, which
  degrades gracefully and is bounded by the token's rate limit.

## Notes & trade-offs

- **README is markdown-only** — rendered with `react-markdown` + `remark-gfm`
  through a fixed component map
  ([`work-readme.tsx`](../src/app/work/_components/work-readme.tsx)); no
  JSX/script from a README can execute.
- **Public repos assumed** for images (raw URLs aren't authenticated).
- **Missing `thumbnail`** → the generated gradient cover
  ([`work-cover.tsx`](../src/app/work/_components/work-cover.tsx)).
- One bad repo won't blank the page — per-repo failures are caught and skipped.
- Hardcode projects (private/unreleased) in
  [`src/config/project.ts`](../src/config/project.ts); they merge with GitHub
  ones, deduped by slug.
