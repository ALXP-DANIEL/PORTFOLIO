# Work as a GitHub-driven CMS

The `/work` section can pull projects from your GitHub repos at build time and
keep them fresh via a push webhook. Until it's configured, it renders the local
**seed data** in [`src/data/projects.ts`](../src/data/projects.ts) — so the site
always works.

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

| Variable | Purpose | Default |
| --- | --- | --- |
| `GITHUB_TOKEN` | **The only required var.** A read-only PAT; the owner is derived from it | — |
| `GITHUB_WEBHOOK_SECRET` | Shared secret for the push webhook (the sole refresh path) | — |

The integration activates as soon as `GITHUB_TOKEN` is set — discovery uses
`/user/repos`, so it shows **your** repos automatically. If a live load returns
zero projects or throws, it falls back to seed.

GitHub data is cached **indefinitely** (`revalidate: false`); it only updates
when the push webhook busts the cache. Without the webhook configured, content
changes won't appear until the next deploy — so set up the webhook below.

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
  "previewImages": [
    { "src": "https://…/shot.gif", "title": "Home", "caption": "…", "alt": "…" }
  ],
  "actions": { "open": "https://meteo.example.com", "github": "https://github.com/…" }
}
```

Field mapping:

| `project.json` | Used for |
| --- | --- |
| `title` | **required** — everything else has a default |
| `slug` | detail route (`/work/<slug>`); defaults to slugified repo name |
| `spotlight` | promotes into the featured carousel |
| `thumbnail` | card / hero cover image |
| `spotlightImage` | leads the detail gallery |
| `techStack` | stack tags |
| `highlights` | highlights list |
| `previewImages[]` | detail gallery (string or `{ src, title, caption, alt }`) |
| `overview` | intro paragraph above the README |
| `actions.open` / `.github` | buttons (default to repo homepage / URL) |

Relative paths (`./public/preview.png`) resolve to `raw.githubusercontent.com`
automatically; absolute URLs pass through untouched. The repo's `README.md` is
rendered as the long-form body below the overview.

## Keeping it fresh (webhook)

1. Set `GITHUB_WEBHOOK_SECRET` in the deployment env.
2. Repo (or org) → Settings → Webhooks → Add webhook:
   - **Payload URL**: `https://your-site.com/api/revalidate`
   - **Content type**: `application/json`
   - **Secret**: the same value
   - **Events**: just `push`
3. On push, the route verifies the HMAC and calls
   `revalidateTag("github-sync", { expire: 0 })`, busting every GitHub-sourced
   fetch. The next visit to `/work` shows the update — no redeploy.

## Notes & trade-offs

- **README is markdown-only** — rendered with `react-markdown` + `remark-gfm`
  through a fixed component map
  ([`project-readme.tsx`](../src/app/work/_components/project-readme.tsx)); no
  JSX/script from a README can execute.
- **Public repos assumed** for images (raw URLs aren't authenticated).
- **Missing `thumbnail`** → the generated gradient cover
  ([`project-cover.tsx`](../src/app/work/_components/project-cover.tsx)).
- The seed array stays the schema's source of truth and the offline fallback.
