"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/shadcn/field";
import type {
  AnyZodObject,
  SchemaFormFieldConfig,
  SchemaFormProps,
  SchemaFormValues,
} from "./schema-form.types";
import {
  getFieldErrors,
  getFieldValidator,
  getHiddenFieldClearedValue,
  resolveDateRangeValue,
  sanitizeDraftValue,
} from "./schema-form-core";
import { SchemaFormFieldControl } from "./schema-form-field-control";

export type {
  AnyZodObject,
  EmptyValueStrategy,
  SchemaFormDateRange,
  SchemaFormFieldConfig,
  SchemaFormProps,
  SchemaFormValues,
} from "./schema-form.types";

export function defineSchemaFormFields<TSchema extends AnyZodObject>(
  fields: ReadonlyArray<SchemaFormFieldConfig<TSchema>>,
) {
  return fields;
}

function DraftAutosaveBridge({
  draftKey,
  enabled,
  pausedSnapshot,
  values,
  onSaved,
  onResume,
}: {
  draftKey: string;
  enabled: boolean;
  pausedSnapshot: string | null;
  values: unknown;
  onSaved?: () => void;
  onResume?: () => void;
}) {
  useEffect(() => {
    if (!enabled || !draftKey || typeof window === "undefined") {
      return;
    }

    const currentDraft = JSON.stringify(sanitizeDraftValue(values));

    if (pausedSnapshot) {
      if (currentDraft === pausedSnapshot) {
        return;
      }

      onResume?.();
      return;
    }

    try {
      window.localStorage.setItem(draftKey, currentDraft);
      onSaved?.();
    } catch {
      // Ignore serialization/storage failures.
    }
  }, [draftKey, enabled, values, pausedSnapshot, onSaved, onResume]);

  return null;
}

export function SchemaForm<TSchema extends AnyZodObject>({
  schema,
  fields,
  defaultValues,
  submitLabel = "Submit",
  submittingLabel = "Submitting...",
  resetLabel = "Reset",
  draftKey,
  enableDraftAutosave = false,
  clearDraftOnSubmit = true,
  promptDraftRestore = true,
  draftRestoredLabel = "Draft available from a previous session.",
  restoreDraftLabel = "Restore draft",
  discardDraftLabel = "Discard draft",
  clearDraftLabel = "Clear draft",
  hiddenFieldBehavior = "preserve",
  errorSummaryTitle = "Please fix the highlighted fields before submitting.",
  focusErrorLabel = "Focus first error",
  onSubmit,
}: SchemaFormProps<TSchema>) {
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [pendingDraft, setPendingDraft] =
    useState<SchemaFormValues<TSchema> | null>(null);
  const [draftAutosavePausedSnapshot, setDraftAutosavePausedSnapshot] =
    useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<
    "idle" | "saved" | "restored" | "discarded" | "cleared"
  >("idle");

  const focusFirstInvalidField = () => {
    if (typeof document === "undefined") {
      return;
    }

    const firstInvalid = document.querySelector(
      "[aria-invalid='true']",
    ) as HTMLElement | null;

    firstInvalid?.focus();
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value as SchemaFormValues<TSchema>);

      if (enableDraftAutosave && clearDraftOnSubmit && draftKey) {
        try {
          window.localStorage.removeItem(draftKey);
          setDraftStatus("cleared");
          setDraftAutosavePausedSnapshot(
            JSON.stringify(sanitizeDraftValue(value)),
          );
        } catch {
          // Ignore storage failures.
        }
      }

      setSubmitAttempted(false);
    },
  });

  useEffect(() => {
    if (!enableDraftAutosave || !draftKey || typeof window === "undefined") {
      return;
    }

    try {
      const rawDraft = window.localStorage.getItem(draftKey);
      if (!rawDraft) {
        return;
      }

      const parsed = JSON.parse(rawDraft) as SchemaFormValues<TSchema>;

      if (promptDraftRestore) {
        setPendingDraft(parsed);
      } else {
        form.reset(parsed);
        setDraftStatus("restored");
      }
    } catch {
      // Ignore malformed draft payloads.
    }
  }, [draftKey, enableDraftAutosave, form, promptDraftRestore]);

  const hiddenFields =
    hiddenFieldBehavior === "clear-on-hide"
      ? fields.filter((fieldConfig) => {
          const values = form.state.values as SchemaFormValues<TSchema>;
          const hiddenByShowRule = fieldConfig.showWhen?.(values) === false;
          const hiddenByHideRule = fieldConfig.hideWhen?.(values) === true;
          return hiddenByShowRule || hiddenByHideRule;
        })
      : [];

  useEffect(() => {
    if (hiddenFieldBehavior !== "clear-on-hide") {
      return;
    }

    for (const hiddenField of hiddenFields) {
      const currentValue = (form.state.values as Record<string, unknown>)[
        hiddenField.name
      ];
      const nextValue = getHiddenFieldClearedValue(hiddenField);

      if (currentValue !== nextValue) {
        (
          form as unknown as {
            setFieldValue: (name: string, value: unknown) => void;
          }
        ).setFieldValue(String(hiddenField.name), nextValue);
      }
    }
  }, [form, hiddenFieldBehavior, hiddenFields]);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSubmitAttempted(true);
        void form.handleSubmit();
      }}
    >
      {enableDraftAutosave && draftKey ? (
        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <DraftAutosaveBridge
              draftKey={draftKey}
              enabled={enableDraftAutosave && !pendingDraft}
              pausedSnapshot={draftAutosavePausedSnapshot}
              values={values}
              onSaved={() => setDraftStatus("saved")}
              onResume={() => setDraftAutosavePausedSnapshot(null)}
            />
          )}
        </form.Subscribe>
      ) : null}

      {pendingDraft && enableDraftAutosave && draftKey ? (
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-sm text-muted-foreground">{draftRestoredLabel}</p>
          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                form.reset(pendingDraft);
                setPendingDraft(null);
                setDraftAutosavePausedSnapshot(null);
                setDraftStatus("restored");
              }}
            >
              {restoreDraftLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setDraftAutosavePausedSnapshot(
                  JSON.stringify(sanitizeDraftValue(form.state.values)),
                );
                setPendingDraft(null);
                setDraftStatus("discarded");
                try {
                  window.localStorage.removeItem(draftKey);
                } catch {
                  // Ignore storage failures.
                }
              }}
            >
              {discardDraftLabel}
            </Button>
          </div>
        </div>
      ) : null}

      {enableDraftAutosave && draftKey ? (
        <div className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2 text-xs text-muted-foreground">
          <span>
            Draft status:{" "}
            {draftStatus === "idle"
              ? "Autosaving"
              : draftStatus === "saved"
                ? "Saved"
                : draftStatus === "restored"
                  ? "Restored"
                  : draftStatus === "discarded"
                    ? "Discarded"
                    : "Cleared"}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              try {
                window.localStorage.removeItem(draftKey);
                setDraftStatus("cleared");
                setDraftAutosavePausedSnapshot(
                  JSON.stringify(sanitizeDraftValue(form.state.values)),
                );
              } catch {
                // Ignore storage failures.
              }
            }}
          >
            {clearDraftLabel}
          </Button>
        </div>
      ) : null}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) =>
          submitAttempted && !canSubmit ? (
            <div
              className="rounded-lg border border-destructive/30 bg-destructive/5 p-3"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-sm text-destructive">{errorSummaryTitle}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={focusFirstInvalidField}
              >
                {focusErrorLabel}
              </Button>
            </div>
          ) : null
        }
      </form.Subscribe>

      <FieldGroup>
        <form.Subscribe selector={(state) => state.values}>
          {(allValues) =>
            fields
              .filter((fieldConfig) => {
                const values = allValues as SchemaFormValues<TSchema>;
                const hiddenByShowRule =
                  fieldConfig.showWhen?.(values) === false;
                const hiddenByHideRule =
                  fieldConfig.hideWhen?.(values) === true;

                return !(hiddenByShowRule || hiddenByHideRule);
              })
              .map((fieldConfig, index, visibleFields) => {
                const previousField = visibleFields[index - 1];
                const currentSectionKey =
                  fieldConfig.sectionId ??
                  fieldConfig.sectionTitle ??
                  "__default";
                const previousSectionKey =
                  previousField?.sectionId ??
                  previousField?.sectionTitle ??
                  "__default";
                const startsNewSection =
                  currentSectionKey !== previousSectionKey;

                const validator = getFieldValidator(
                  schema,
                  String(fieldConfig.name),
                );

                return (
                  <div key={String(fieldConfig.name)} className="space-y-3">
                    {startsNewSection && fieldConfig.sectionTitle ? (
                      <div className="space-y-1 border-b border-border/50 pb-2">
                        <p className="text-sm font-semibold">
                          {fieldConfig.sectionTitle}
                        </p>
                        {fieldConfig.sectionDescription ? (
                          <p className="text-xs text-muted-foreground">
                            {fieldConfig.sectionDescription}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <form.Field
                      name={fieldConfig.name as never}
                      validators={{ onChange: validator, onSubmit: validator }}
                    >
                      {(field) => {
                        const errors = getFieldErrors(field.state.meta.errors);
                        const customFileError = fileErrors[field.name];
                        const firstError = customFileError ?? errors[0];
                        const isInvalid = Boolean(firstError);
                        const inputValue =
                          typeof field.state.value === "string"
                            ? field.state.value
                            : String(field.state.value ?? "");
                        const arrayValue = Array.isArray(field.state.value)
                          ? field.state.value.filter(
                              (item): item is string =>
                                typeof item === "string",
                            )
                          : [];
                        const dateRangeValue = resolveDateRangeValue(
                          field.state.value,
                        );

                        const commonMeta = {
                          id: field.name,
                          name: field.name,
                          onBlur: field.handleBlur,
                        };

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              {fieldConfig.label}
                            </FieldLabel>
                            <FieldContent>
                              <SchemaFormFieldControl
                                fieldConfig={fieldConfig}
                                field={field}
                                isInvalid={isInvalid}
                                inputValue={inputValue}
                                arrayValue={arrayValue}
                                dateRangeValue={dateRangeValue}
                                commonMeta={commonMeta}
                                setFileErrors={setFileErrors}
                              />

                              {fieldConfig.description ? (
                                <FieldDescription>
                                  {fieldConfig.description}
                                </FieldDescription>
                              ) : null}

                              <FieldError>{firstError}</FieldError>
                            </FieldContent>
                          </Field>
                        );
                      }}
                    </form.Field>
                  </div>
                );
              })
          }
        </form.Subscribe>
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFileErrors({});
                form.reset();
                if (enableDraftAutosave && draftKey) {
                  try {
                    window.localStorage.removeItem(draftKey);
                    setDraftStatus("cleared");
                    setDraftAutosavePausedSnapshot(
                      JSON.stringify(sanitizeDraftValue(defaultValues)),
                    );
                  } catch {
                    // Ignore storage failures.
                  }
                }
              }}
            >
              {resetLabel}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
