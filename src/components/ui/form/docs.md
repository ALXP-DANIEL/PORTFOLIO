# Schema Form

This folder contains the reusable, schema-driven form system used across the app.

## Public API

Prefer importing from the folder barrel:

```ts
import {
  SchemaForm,
  defineSchemaFormFields,
  type SchemaFormValues,
} from "@/components/ui/form";
```

The barrel also re-exports the lower-level modules if you need them:

- `schema-form.tsx` - main form component
- `schema-form.types.ts` - shared types
- `schema-form-core.ts` - core helpers
- `schema-form-field-control.tsx` - field renderer
- `schema-form-async-fields.tsx` - async select and multiselect UI
- `schema-form-helpers.ts` - small utility helpers

## Quick Start

Use `SchemaForm` with a Zod schema, field config, and default values.

```tsx
import { z } from "zod";
import {
  SchemaForm,
  defineSchemaFormFields,
  type SchemaFormValues,
} from "@/components/ui/form";

const schema = z.object({
  fullName: z.string().trim().min(2),
  email: z.email(),
  bio: z.string().trim().min(10),
});

type Values = SchemaFormValues<typeof schema>;

const fields = defineSchemaFormFields<typeof schema>([
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    placeholder: "Alicia Rahman",
  },
  {
    name: "email",
    label: "Work email",
    type: "email",
    placeholder: "alicia@company.com",
  },
  {
    name: "bio",
    label: "Bio",
    type: "textarea",
    placeholder: "Tell us about your role and focus.",
  },
]);

const defaultValues: Values = {
  fullName: "",
  email: "",
  bio: "",
};

export function MyForm() {
  return (
    <SchemaForm
      schema={schema}
      fields={fields}
      defaultValues={defaultValues}
      onSubmit={async (values) => {
        console.log(values);
      }}
    />
  );
}
```

## Supported Field Types

- `text`
- `email`
- `textarea`
- `date`
- `number`
- `switch`
- `select`
- `searchable-select`
- `searchable-select-async`
- `native-select`
- `multiselect`
- `multiselect-async`
- `date-range`
- `file`

## Useful Behaviors

- Conditional visibility with `showWhen` and `hideWhen`
- Optional draft autosave and restore
- Error summary with focus-first-invalid behavior
- Clear-on-hide field handling
- Async search with retry and load-more support
- File validation for size, MIME type, and extension

## Notes

- Use the barrel import from `@/components/ui/form` in app code.
- Keep new field logic split into the existing module files instead of growing `schema-form.tsx` again.
- If you want a new field type, add its typing in `schema-form.types.ts` and its renderer in `schema-form-field-control.tsx`.
