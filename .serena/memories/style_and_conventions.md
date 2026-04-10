# Style and conventions
- Use TypeScript and TSX with Biome formatting (2-space indentation, organize-imports enabled).
- Prefer Serena-first exploration/editing when possible; AGENTS.md explicitly asks for Serena-first indexing and symbol lookup.
- This repo uses Next.js 16.x with breaking changes; before framework-specific edits, check the relevant docs under `node_modules/next/dist/docs/`.
- Do not modify base shadcn registry files under `src/components/ui/shadcn/` unless the user explicitly asks. Add wrappers or app-specific components elsewhere under `src/components/ui/`.
- Styling is data-token driven from `src/styles/globals.css`; the UI leans on translucent surfaces, rounded cards, subtle borders, and motion-heavy presentation.
- Shared layout primitives include `LayoutWrapper` for the app shell and `SectionWrapper` for bordered card-like sections.
- The project prefers `motion/react` animations, route groups under `src/app/(pages)`, and data-driven sections instead of hardcoded repeated markup.
- For form work, prefer the barrel import `@/components/ui/form`. New field types should be reflected in `schema-form.types.ts`, `schema-form-field-control.tsx`, tests, and docs.