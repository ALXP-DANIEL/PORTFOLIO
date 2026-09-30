# ALXP-DANIEL — Portfolio

Personal portfolio of Muhammad Alif Daniel, a full-stack web developer based in Malaysia.
Live at [alifdaniel.dpdns.org](https://alifdaniel.dpdns.org).

## Stack

- Next.js 16 (App Router, React Compiler, view transitions) and React 19
- Tailwind CSS 4, Base UI and shadcn primitives, Phosphor icons
- GSAP for entrance, scroll and cursor motion
- Zod-validated project data, loaded from GitHub

## Features

- **GitHub as the CMS.** Any repository with a root `project.json` appears on
  `/work`, with its README rendered as the case study. See
  [docs/work-github-cms.md](docs/work-github-cms.md).
- **Command palette.** Press `⌘K`, `Ctrl+K` or `/` anywhere to jump to pages and
  projects, copy the email address, open the résumé or switch theme.
- **Interactive grid background** with a canvas reticle cursor and optional audio.
- Light and dark themes, reduced-motion support, generated OG images, sitemap
  and JSON-LD.

## Development

```bash
cp .env.example .env   # set NEXT_PUBLIC_SITE_URL and, optionally, GITHUB_TOKEN
npm install
npm run dev
```

| Script           | Purpose                        |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start the dev server           |
| `npm run build`  | Production build               |
| `npm run lint`   | Biome lint and format check    |
| `npm run format` | Apply Biome formatting         |

On `/work`, press `R` to revalidate the GitHub cache without waiting for the
weekly refresh.

## Layout

```
src/
  app/            routes: home, work, work/[slug], about, contact, api/og, api/revalidate
  components/     layouts (nav, footer, grid background), command palette, UI
  config/         site, routes, socials, résumé content
  lib/            GitHub client, project schema, work loader, metadata helpers
```

Résumé content lives in `src/config/resume.ts`; site-wide identity lives in
`src/config/site.ts`.
