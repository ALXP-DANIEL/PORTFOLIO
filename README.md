# My App

## SchemaForm Usage Guide

`SchemaForm` is a schema-driven form builder powered by TanStack Form + Zod.

Source files:
- `src/components/ui/schema-form.tsx`
- `src/components/ui/schema-form-helpers.ts`
- Demo: `src/app/(pages)/(home)/_components/schema-form-all-types-demo.tsx`

## Quick Start

```tsx
import { z } from "zod";
import { SchemaForm, defineSchemaFormFields, type SchemaFormValues } from "@/components/ui/schema-form";

const schema = z.object({
  name: z.string().min(2),
  role: z.enum(["owner", "editor"]).nullable().optional(),
});

type Values = SchemaFormValues<typeof schema>;

const fields = defineSchemaFormFields<typeof schema>([
  { name: "name", label: "Name", type: "text" },
  {
    name: "role",
    label: "Role",
    type: "select",
    clearable: true,
    emptyOptionLabel: "No role",
    emptyValueStrategy: "null",
    options: [
      { label: "Owner", value: "owner" },
      { label: "Editor", value: "editor" },
    ],
  },
]);

const defaults: Values = {
  name: "",
  role: null,
};
```

## Supported Field Types

String-like:
- `text`
- `email`
- `textarea`
- `date`

Numeric/boolean:
- `number`
- `switch`

Selects:
- `select`
- `native-select`
- `searchable-select`
- `searchable-select-async`

Arrays:
- `multiselect`
- `multiselect-async`

Advanced:
- `date-range` (value shape: `{ from: string | null; to: string | null }`)
- `file` (value type: `File | null | undefined`)

Conditional visibility:
- `showWhen(values) => boolean`
- `hideWhen(values) => boolean`

## Async Field Features

For `searchable-select-async` and `multiselect-async`:
- Debounce: `debounceMs`
- Minimum query length: `minSearchLength`
- Retry UI: `retryLabel`, `errorLabel`
- Pagination hooks: `loadMoreOptions`, `hasMoreOptions`, `loadMoreLabel`, `loadingMoreLabel`
- Cache controls (`searchable-select-async`): `cacheTtlMs`, `cacheMaxEntries`

Async function signatures:

```ts
searchOptions(query, { signal }) => Promise<Option[]>

loadMoreOptions(query, { signal, currentOptions }) => Promise<Option[]>
```

## Empty Value Strategy

Use `emptyValueStrategy` to control empty state writes:
- `"undefined"` (default)
- `"null"`

This is used for clearable selects, numeric inputs, dates, date-range, file, and multiselect variants.

## Draft & Hidden Field Controls

SchemaForm runtime options:
- `enableDraftAutosave`
- `draftKey`
- `promptDraftRestore`
- `clearDraftOnSubmit`
- `hiddenFieldBehavior` (`"preserve"` or `"clear-on-hide"`)

Example:

```tsx
<SchemaForm
  schema={schema}
  fields={fields}
  defaultValues={defaults}
  enableDraftAutosave
  draftKey="project-intake-draft"
  promptDraftRestore
  clearDraftOnSubmit
  hiddenFieldBehavior="clear-on-hide"
  onSubmit={async (values) => {
    console.log(values);
  }}
/>
```

## File Constraints

`file` fields support client-side constraints:
- `maxSizeBytes`
- `allowedMimeTypes`
- `allowedExtensions`
- `fileValidationMessage` (override default validation message)

## Real Form Example

This example combines conditional fields, file constraints, and async pagination:

```tsx
const schema = z.object({
  hasAttachment: z.boolean(),
  attachment: z.instanceof(File).nullable().optional(),
  assignee: z.enum(["ali", "nadia", "amir"]).nullable().optional(),
});

const fields = defineSchemaFormFields<typeof schema>([
  {
    name: "hasAttachment",
    label: "Has Attachment",
    type: "switch",
    sectionTitle: "Submission",
    sectionDescription: "Upload proof only when needed.",
  },
  {
    name: "attachment",
    label: "Attachment",
    type: "file",
    showWhen: (values) => values.hasAttachment,
    accept: ".png,.jpg,.jpeg,.pdf",
    maxSizeBytes: 2_000_000,
    allowedMimeTypes: ["image/png", "image/jpeg", "application/pdf"],
    allowedExtensions: [".png", ".jpg", ".jpeg", ".pdf"],
    fileValidationMessage: "Attachment must be PNG/JPG/PDF and <= 2MB.",
    emptyValueStrategy: "null",
    sectionTitle: "Submission",
  },
  {
    name: "assignee",
    label: "Assignee",
    type: "searchable-select-async",
    minSearchLength: 2,
    debounceMs: 300,
    clearable: true,
    emptyOptionLabel: "Unassigned",
    initialOptions: [{ label: "Ali", value: "ali" }],
    searchOptions: async (query, { signal }) => {
      // Replace with your async search source.
      void signal;
      return query.toLowerCase().includes("na")
        ? [{ label: "Nadia", value: "nadia" }]
        : [{ label: "Amir", value: "amir" }];
    },
    loadMoreOptions: async (_query, { signal, currentOptions }) => {
      void signal;
      return currentOptions.length === 1
        ? [{ label: "Nadia", value: "nadia" }]
        : [];
    },
    hasMoreOptions: (options) => options.length < 2,
    sectionTitle: "Assignment",
  },
]);
```

## Patterns Cookbook

1. Conditional + Async Select

```tsx
{
  name: "assignee",
  label: "Assignee",
  type: "searchable-select-async",
  showWhen: (values) => values.assignMode === "manual",
  minSearchLength: 2,
  searchOptions: async (query, { signal }) => {
    void signal;
    return [{ label: `Result for ${query}`, value: "ali" }];
  },
}
```

2. File Constraints + Validation

```tsx
{
  name: "attachment",
  label: "Attachment",
  type: "file",
  accept: ".png,.jpg,.jpeg,.pdf",
  maxSizeBytes: 2_000_000,
  allowedMimeTypes: ["image/png", "image/jpeg", "application/pdf"],
  allowedExtensions: [".png", ".jpg", ".jpeg", ".pdf"],
  fileValidationMessage: "Attachment must be PNG/JPG/PDF and <= 2MB.",
}
```

3. Date Range + Error Summary Submit UX

```tsx
<SchemaForm
  schema={schema}
  fields={fields}
  defaultValues={defaults}
  errorSummaryTitle="Please review required dates before submit."
  focusErrorLabel="Jump to first invalid field"
  onSubmit={submitHandler}
/>
```

## Testing

Commands:
- `npm run test`
- `npm run test:watch`

Current tests cover helper logic used by async/select behavior in:
- `src/components/ui/schema-form-helpers.test.ts`
