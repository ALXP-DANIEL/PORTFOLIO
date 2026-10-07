# GitHub as the Portfolio CMS

The Portfolio treats GitHub repositories as project records. There is no
separate project database or admin dashboard: each repository opts into the
portfolio by publishing a valid `project.json` at its root.

## Account coverage

The site can scan two GitHub identities:

- `GITHUB_TOKEN` — personal repositories
- `GITHUB_WORK_TOKEN` — work and client repositories

The code derives repository owners from the tokens and scans repositories the
identity owns or collaborates on. Tokens are server-only secrets and must be
stored in local `.env` files or Vercel environment variables, never committed.

## Repository contract

Add a root `project.json` following this shape:

```json
{
  "slug": "project-name",
  "title": "Project Name",
  "type": "Full-Stack Web App",
  "category": "Business Platform",
  "summary": "One concise portfolio-card description.",
  "overview": "A fuller case-study overview.",
  "year": "2026",
  "spotlight": true,
  "thumbnail": "./metadata/picture/thumbnail.jpeg",
  "spotlightImage": "./metadata/picture/thumbnail.jpeg",
  "techStack": ["Next.js", "TypeScript"],
  "highlights": ["A concrete capability or result."],
  "previewImages": [
    {
      "src": "./metadata/picture/preview-1.jpeg",
      "title": "Feature",
      "caption": "What this screen demonstrates.",
      "alt": "Accessible image description"
    }
  ],
  "actions": {
    "open": "https://example.com",
    "github": "https://github.com/account/repository"
  }
}
```

Only `title` is strictly required, but complete manifests produce better cards
and case-study pages. The repository README is also loaded as the long-form
technical description.

## Images

Follow [Project presentation](project-presentation.md) for image dimensions,
filenames, crop rules, and the shared portfolio/profile design. `thumbnail`
drives the index and case-study cover; `spotlightImage` drives the spotlight
with thumbnail fallback. `profileImage` and `profileSummary` are used by the
profile repository's bento generator.

For public repositories, relative image paths are resolved through
`raw.githubusercontent.com`.

For private repositories, browsers cannot load raw GitHub assets without a
credential. Use an absolute public image URL instead, normally an asset served
by the production website:

```json
{
  "thumbnail": "https://example.com/portfolio/thumbnail.jpeg"
}
```

Never expose a GitHub token through an image URL or client-side request.

## Refresh behavior

GitHub responses use a one-week Next.js cache tagged `github-sync`. Updates can
be made visible in either of these ways:

1. Wait for weekly revalidation.
2. Trigger the protected `/api/revalidate` endpoint.
3. Use the Portfolio's manual refresh control, which calls the same
   revalidation flow.

A GitHub push webhook may call the revalidation endpoint for immediate sync.
The webhook secret must remain in Vercel environment variables.

## Adding a project

1. Audit the current code and integrations; do not copy stale marketing text.
2. Add or update the root `project.json`.
3. Add accurate gallery assets.
4. Use real captures for live software. Label generated presentation mockups as
   concepts.
5. Validate the JSON.
6. Commit and push the manifest and images to the project repository.
7. Confirm the relevant Portfolio GitHub token can see the repository.
8. Trigger Portfolio revalidation and verify the project card, case-study page,
   gallery, links, and mobile layout.

## Current indexed client/business projects

- Kampung Hills Eatery
- Kopi Rumah Nenek
- GASAK
- WasteGrab
