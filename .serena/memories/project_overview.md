# my-app overview
- Purpose: early-stage Next.js app with App Router structure, shadcn/ui components, and Tailwind CSS v4 styling. The repo currently looks like a personal/site-style app with home, blog, and projects route groups under `src/app/(pages)`.
- Tech stack: Next.js 16.2.2, React 19.2.4, TypeScript 5, Tailwind CSS 4, shadcn/ui (style `base-nova`), Biome 2.2.0, next-themes, class-variance-authority, clsx, tailwind-merge, phosphor icons.
- Important note: AGENTS.md says this Next.js version has breaking changes and relevant guides in `node_modules/next/dist/docs/` should be consulted before making framework-specific code changes.
- Top-level structure: `src/app` for routes/layout, `src/components` for shared components, `src/components/ui/shadcn` for UI primitives, `src/styles/globals.css` for Tailwind theme tokens, `src/lib` for utilities, `public` for assets.
- Styling setup: Tailwind CSS is imported from `src/styles/globals.css` with CSS variables and OKLCH tokens for light/dark themes.
- Fonts/layout: root layout defines font variables and applies a monospace default through global styles.