# What to do after changes
- Run `npm run lint` after code changes.
- Run `npm run build` when changes affect app behavior, routing, or framework integration.
- Run `npm run format` if formatting is needed or before finalizing larger edits.
- There is currently no dedicated test script in `package.json`, so rely on lint/build unless tests are added later.
- For Next.js framework work, sanity-check current behavior against docs in `node_modules/next/dist/docs/` when APIs or conventions are involved.