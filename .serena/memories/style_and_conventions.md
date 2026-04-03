# Style and conventions
- Use TypeScript and TSX.
- Formatting is managed by Biome with 2-space indentation.
- Imports can be organized automatically by Biome (`source.organizeImports` is on).
- Biome lints with recommended rules plus Next and React domains.
- Project aliases from `components.json`: `@/components`, `@/lib`, `@/hooks`, `@/components/ui/shadcn`, `@/lib/utils`.
- UI layer uses shadcn/ui components in `src/components/ui/shadcn` and Tailwind utility classes.
- Tailwind theme tokens are centralized in `src/styles/globals.css` using CSS variables.
- Keep in mind the repo-specific instruction from AGENTS.md: review docs in `node_modules/next/dist/docs/` before writing Next.js-specific code because the app uses a newer breaking-change-heavy Next.js release.