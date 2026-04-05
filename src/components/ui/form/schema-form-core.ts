import type { z } from "zod";
import type {
  AnyZodObject,
  EmptyValueStrategy,
  SchemaFormDateRange,
  SchemaFormFieldConfig,
} from "./schema-form.types";

export function getFieldErrors(errors: unknown[] | undefined): string[] {
  if (!errors?.length) {
    return [];
  }

  return errors
    .map((error) => {
      if (typeof error === "string") return error;
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        return (error as { message: string }).message;
      }

      return null;
    })
    .filter((error): error is string => Boolean(error));
}

export function getFieldValidator<TSchema extends AnyZodObject>(
  schema: TSchema,
  fieldName: string,
) {
  const fieldShape = schema.shape as Record<string, z.ZodTypeAny>;
  const fieldSchema = fieldShape[fieldName];

  if (!fieldSchema) {
    return () => undefined;
  }

  return ({ value }: { value: unknown }) => {
    const parsed = fieldSchema.safeParse(value);

    if (parsed.success) {
      return undefined;
    }

    return parsed.error.issues[0]?.message ?? "Invalid value";
  };
}

function resolveEmptyValue(strategy: EmptyValueStrategy | undefined) {
  return strategy === "null" ? null : undefined;
}

export function resolveDateRangeValue(current: unknown): SchemaFormDateRange {
  if (
    current &&
    typeof current === "object" &&
    "from" in current &&
    "to" in current
  ) {
    const candidate = current as { from?: unknown; to?: unknown };
    return {
      from: typeof candidate.from === "string" ? candidate.from : null,
      to: typeof candidate.to === "string" ? candidate.to : null,
    };
  }

  return { from: null, to: null };
}

export function sanitizeDraftValue(value: unknown): unknown {
  if (value instanceof File) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDraftValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        sanitizeDraftValue(item),
      ]),
    );
  }

  return value;
}

export function getHiddenFieldClearedValue<TSchema extends AnyZodObject>(
  fieldConfig: SchemaFormFieldConfig<TSchema>,
) {
  if (fieldConfig.type === "switch") {
    return false;
  }

  if (
    fieldConfig.type === "multiselect" ||
    fieldConfig.type === "multiselect-async"
  ) {
    return resolveEmptyValue(fieldConfig.emptyValueStrategy);
  }

  if (fieldConfig.type === "date-range") {
    return resolveEmptyValue(fieldConfig.emptyValueStrategy);
  }

  if (fieldConfig.type === "file") {
    return resolveEmptyValue(fieldConfig.emptyValueStrategy);
  }

  return resolveEmptyValue(fieldConfig.emptyValueStrategy);
}
