# Routes and content
- Home route (`src/app/(pages)/(home)/page.tsx`) renders `Hero`, then the three labeled sections `Experience`, `Education`, and `Projects`.
- The Projects section on the home page is not separate content; it reuses the `/projects` page component directly.
- `/projects` composes a featured carousel (`ProjectsShowcase`) plus a library grid (`ProjectsLibrary`).
- `/projects/[slug]` is statically generated from `getAllProjectParams()` and reads all content from `src/data/projects/projects-data.ts`.
- `/blog` currently renders a `StatusPage` “coming soon” placeholder and is intentionally commented out of the main header nav.
- `src/app/not-found.tsx` also uses the shared `StatusPage` component for 404 handling.
- Main navigation currently exposes only `Home` and `Projects` via `src/components/layout/header/header.constants.ts`.