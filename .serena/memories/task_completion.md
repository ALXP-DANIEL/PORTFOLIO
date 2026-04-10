# What to do after changes
- Run `npm run lint` after most code changes.
- Run `npm run test` whenever you touch the shared schema-form package or its related helpers/tests.
- Run `npm run build` when changes affect routing, metadata, layout, or framework integration.
- Run `npm run format` if Biome reports formatting drift or before finalizing larger edits.
- For Next.js-specific work, sanity-check current behavior against the docs in `node_modules/next/dist/docs/` because this repo targets a newer, breaking-change-heavy release.