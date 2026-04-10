# Schema form system
- Main package location: `src/components/ui/form`.
- Public barrel exports come from `src/components/ui/form/index.ts` and should be the preferred import surface.
- Key modules: `schema-form.tsx` (main form), `schema-form.types.ts` (type system), `schema-form-core.ts` (validation/value helpers), `schema-form-field-control.tsx` (field renderer), `schema-form-async-fields.tsx` (async select UIs), and `schema-form-helpers.ts` (helper utilities).
- Supported field types include text, email, textarea, date, number, switch, select, searchable-select, searchable-select-async, native-select, multiselect, multiselect-async, date-range, and file.
- Important behaviors: conditional visibility (`showWhen` / `hideWhen`), draft autosave/restore, hidden-field clearing strategies, async retry/load-more behavior, and file validation.
- Tests under `src/test/` cover async multiselect flows, retry states, conditional visibility, file constraints, hidden-field preservation vs clear-on-hide, draft clearing behavior, and lower-level helper logic.
- If you add or change field types, update the implementation, tests, and docs together (`src/components/ui/form/docs.md` and README).