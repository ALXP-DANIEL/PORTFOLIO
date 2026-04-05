"use client";

import type { Dispatch, SetStateAction } from "react";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Input } from "@/components/ui/shadcn/input";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/shadcn/native-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Switch } from "@/components/ui/shadcn/switch";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { SELECT_EMPTY_VALUE } from "./schema-form.constants";
import type {
  AnyZodObject,
  EmptyValueStrategy,
  SchemaFormDateRange,
  SchemaFormFieldConfig,
  SchemaFormNativeSelectOptionGroup,
  SchemaFormSelectOption,
} from "./schema-form.types";
import {
  AsyncMultiSelect,
  AsyncSearchableSelect,
  SearchableSelect,
} from "./schema-form-async-fields";
import { validateFileWithConstraints } from "./schema-form-helpers";

type SchemaFieldAdapter = {
  name: string;
  state: { value: unknown };
  handleBlur: () => void;
  handleChange: (value: never) => void;
};

type CommonMeta = {
  id: string;
  name: string;
  onBlur: () => void;
};

type SchemaFormFieldControlProps<TSchema extends AnyZodObject> = {
  fieldConfig: SchemaFormFieldConfig<TSchema>;
  field: SchemaFieldAdapter;
  isInvalid: boolean;
  inputValue: string;
  arrayValue: string[];
  dateRangeValue: SchemaFormDateRange;
  commonMeta: CommonMeta;
  setFileErrors: Dispatch<SetStateAction<Record<string, string>>>;
};

function isNativeSelectGroup<TValue extends string>(
  option:
    | SchemaFormSelectOption<TValue>
    | SchemaFormNativeSelectOptionGroup<TValue>,
): option is SchemaFormNativeSelectOptionGroup<TValue> {
  return "options" in option;
}

function resolveEmptyValue(strategy: EmptyValueStrategy | undefined) {
  return strategy === "null" ? null : undefined;
}

function coerceNumberInput(
  raw: string,
  strategy: EmptyValueStrategy | undefined,
): number | null | undefined {
  if (raw.trim() === "") {
    return resolveEmptyValue(strategy);
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : resolveEmptyValue(strategy);
}

function toggleInStringArray(
  current: unknown,
  next: string,
  strategy: EmptyValueStrategy | undefined,
) {
  const currentList = Array.isArray(current)
    ? current.filter((item): item is string => typeof item === "string")
    : [];

  const nextSet = new Set(currentList);

  if (nextSet.has(next)) {
    nextSet.delete(next);
  } else {
    nextSet.add(next);
  }

  const result = Array.from(nextSet);
  if (result.length === 0) {
    return resolveEmptyValue(strategy);
  }

  return result;
}

export function SchemaFormFieldControl<TSchema extends AnyZodObject>({
  fieldConfig,
  field,
  isInvalid,
  inputValue,
  arrayValue,
  dateRangeValue,
  commonMeta,
  setFileErrors,
}: SchemaFormFieldControlProps<TSchema>) {
  if (fieldConfig.type === "textarea") {
    return (
      <Textarea
        {...commonMeta}
        value={inputValue}
        onChange={(event) => field.handleChange(event.target.value as never)}
        placeholder={fieldConfig.placeholder}
        aria-invalid={isInvalid}
      />
    );
  }

  if (fieldConfig.type === "searchable-select-async") {
    return (
      <AsyncSearchableSelect
        value={inputValue === "" ? null : inputValue}
        initialOptions={fieldConfig.initialOptions}
        searchOptions={fieldConfig.searchOptions}
        isInvalid={isInvalid}
        clearable={fieldConfig.clearable}
        emptyOptionLabel={fieldConfig.emptyOptionLabel}
        noResultsLabel={fieldConfig.noResultsLabel}
        loadingLabel={fieldConfig.loadingLabel}
        minSearchLengthLabel={fieldConfig.minSearchLengthLabel}
        searchPlaceholder={fieldConfig.searchPlaceholder}
        placeholder={fieldConfig.placeholder}
        debounceMs={fieldConfig.debounceMs}
        minSearchLength={fieldConfig.minSearchLength}
        cacheTtlMs={fieldConfig.cacheTtlMs}
        cacheMaxEntries={fieldConfig.cacheMaxEntries}
        loadMoreOptions={fieldConfig.loadMoreOptions}
        hasMoreOptions={fieldConfig.hasMoreOptions}
        loadingMoreLabel={fieldConfig.loadingMoreLabel}
        retryLabel={fieldConfig.retryLabel}
        errorLabel={fieldConfig.errorLabel}
        loadMoreLabel={fieldConfig.loadMoreLabel}
        onValueChange={(value) =>
          field.handleChange(
            (value === SELECT_EMPTY_VALUE
              ? resolveEmptyValue(fieldConfig.emptyValueStrategy)
              : value) as never,
          )
        }
      />
    );
  }

  if (fieldConfig.type === "searchable-select") {
    return (
      <SearchableSelect
        value={inputValue === "" ? null : inputValue}
        options={fieldConfig.options}
        isInvalid={isInvalid}
        clearable={fieldConfig.clearable}
        emptyOptionLabel={fieldConfig.emptyOptionLabel}
        noResultsLabel={fieldConfig.noResultsLabel}
        searchPlaceholder={fieldConfig.searchPlaceholder}
        placeholder={fieldConfig.placeholder}
        onValueChange={(value) =>
          field.handleChange(
            (value === SELECT_EMPTY_VALUE
              ? resolveEmptyValue(fieldConfig.emptyValueStrategy)
              : value) as never,
          )
        }
      />
    );
  }

  if (fieldConfig.type === "native-select") {
    return (
      <NativeSelect
        id={field.name}
        name={field.name}
        value={
          fieldConfig.clearable ? inputValue || SELECT_EMPTY_VALUE : inputValue
        }
        onChange={(event) =>
          field.handleChange(
            (event.target.value === SELECT_EMPTY_VALUE
              ? resolveEmptyValue(fieldConfig.emptyValueStrategy)
              : event.target.value) as never,
          )
        }
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      >
        {fieldConfig.clearable ? (
          <NativeSelectOption value={SELECT_EMPTY_VALUE}>
            {fieldConfig.emptyOptionLabel ?? "None"}
          </NativeSelectOption>
        ) : null}
        {fieldConfig.options.map((option) => {
          if (isNativeSelectGroup(option)) {
            return (
              <NativeSelectOptGroup
                key={`${String(fieldConfig.name)}-group-${option.label}`}
                label={option.label}
              >
                {option.options.map((groupOption) => (
                  <NativeSelectOption
                    key={`${String(fieldConfig.name)}-${groupOption.value}`}
                    value={groupOption.value}
                  >
                    {groupOption.label}
                  </NativeSelectOption>
                ))}
              </NativeSelectOptGroup>
            );
          }

          return (
            <NativeSelectOption
              key={`${String(fieldConfig.name)}-${option.value}`}
              value={option.value}
            >
              {option.label}
            </NativeSelectOption>
          );
        })}
      </NativeSelect>
    );
  }

  if (fieldConfig.type === "select") {
    return (
      <Select
        value={inputValue === "" ? null : inputValue}
        onValueChange={(value) =>
          field.handleChange(
            (value === SELECT_EMPTY_VALUE
              ? resolveEmptyValue(fieldConfig.emptyValueStrategy)
              : value) as never,
          )
        }
      >
        <SelectTrigger aria-invalid={isInvalid}>
          <SelectValue
            placeholder={
              fieldConfig.placeholder ??
              (fieldConfig.clearable
                ? (fieldConfig.emptyOptionLabel ?? "None")
                : "Select an option")
            }
          />
        </SelectTrigger>
        <SelectContent>
          {fieldConfig.clearable ? (
            <SelectItem value={SELECT_EMPTY_VALUE}>
              {fieldConfig.emptyOptionLabel ?? "None"}
            </SelectItem>
          ) : null}
          {fieldConfig.options.map((option) => (
            <SelectItem
              key={`${String(fieldConfig.name)}-${option.value}`}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (fieldConfig.type === "number") {
    return (
      <Input
        {...commonMeta}
        type="number"
        min={fieldConfig.min}
        max={fieldConfig.max}
        step={fieldConfig.step}
        value={
          typeof field.state.value === "number" ? String(field.state.value) : ""
        }
        onChange={(event) =>
          field.handleChange(
            coerceNumberInput(
              event.target.value,
              fieldConfig.emptyValueStrategy,
            ) as never,
          )
        }
        placeholder={fieldConfig.placeholder}
        aria-invalid={isInvalid}
      />
    );
  }

  if (fieldConfig.type === "switch") {
    return (
      <Switch
        {...commonMeta}
        checked={Boolean(field.state.value)}
        onCheckedChange={(checked) =>
          field.handleChange(Boolean(checked) as never)
        }
        size={fieldConfig.switchSize ?? "default"}
        aria-invalid={isInvalid}
      />
    );
  }

  if (fieldConfig.type === "multiselect") {
    return (
      <div
        className={
          fieldConfig.orientation === "horizontal"
            ? "flex flex-wrap gap-3"
            : "space-y-2"
        }
      >
        {fieldConfig.options.map((option) => (
          <div
            key={`${String(fieldConfig.name)}-${option.value}`}
            className="flex items-center gap-2 text-sm"
          >
            <Checkbox
              id={`${field.name}-${option.value}`}
              checked={arrayValue.includes(option.value)}
              onCheckedChange={() =>
                field.handleChange(
                  toggleInStringArray(
                    field.state.value,
                    option.value,
                    fieldConfig.emptyValueStrategy,
                  ) as never,
                )
              }
              aria-invalid={isInvalid}
            />
            <label
              htmlFor={`${field.name}-${option.value}`}
              className="cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    );
  }

  if (fieldConfig.type === "multiselect-async") {
    return (
      <AsyncMultiSelect
        value={arrayValue}
        initialOptions={fieldConfig.initialOptions}
        searchOptions={fieldConfig.searchOptions}
        loadMoreOptions={fieldConfig.loadMoreOptions}
        hasMoreOptions={fieldConfig.hasMoreOptions}
        isInvalid={isInvalid}
        noResultsLabel={fieldConfig.noResultsLabel}
        loadingLabel={fieldConfig.loadingLabel}
        loadingMoreLabel={fieldConfig.loadingMoreLabel}
        retryLabel={fieldConfig.retryLabel}
        errorLabel={fieldConfig.errorLabel}
        loadMoreLabel={fieldConfig.loadMoreLabel}
        searchPlaceholder={fieldConfig.searchPlaceholder}
        debounceMs={fieldConfig.debounceMs}
        minSearchLength={fieldConfig.minSearchLength}
        orientation={fieldConfig.orientation}
        onToggleValue={(nextValue) =>
          field.handleChange(
            toggleInStringArray(
              field.state.value,
              nextValue,
              fieldConfig.emptyValueStrategy,
            ) as never,
          )
        }
      />
    );
  }

  if (fieldConfig.type === "date-range") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">
            {fieldConfig.fromLabel ?? "From"}
          </span>
          <Input
            {...commonMeta}
            type="date"
            value={dateRangeValue.from ?? ""}
            onChange={(event) => {
              const nextFrom =
                event.target.value === "" ? null : event.target.value;
              const nextValue = { ...dateRangeValue, from: nextFrom };
              const shouldClear = !nextValue.from && !nextValue.to;

              field.handleChange(
                (shouldClear
                  ? resolveEmptyValue(fieldConfig.emptyValueStrategy)
                  : nextValue) as never,
              );
            }}
            aria-invalid={isInvalid}
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">
            {fieldConfig.toLabel ?? "To"}
          </span>
          <Input
            {...commonMeta}
            type="date"
            value={dateRangeValue.to ?? ""}
            onChange={(event) => {
              const nextTo =
                event.target.value === "" ? null : event.target.value;
              const nextValue = { ...dateRangeValue, to: nextTo };
              const shouldClear = !nextValue.from && !nextValue.to;

              field.handleChange(
                (shouldClear
                  ? resolveEmptyValue(fieldConfig.emptyValueStrategy)
                  : nextValue) as never,
              );
            }}
            aria-invalid={isInvalid}
          />
        </div>
      </div>
    );
  }

  if (fieldConfig.type === "file") {
    return (
      <div className="space-y-2">
        <Input
          {...commonMeta}
          type="file"
          accept={fieldConfig.accept}
          onChange={(event) => {
            const nextFile = event.target.files?.item(0);

            if (!nextFile) {
              setFileErrors((current) => {
                const { [field.name]: _removed, ...rest } = current;
                return rest;
              });
              field.handleChange(
                resolveEmptyValue(fieldConfig.emptyValueStrategy) as never,
              );
              event.target.value = "";
              return;
            }

            const invalidReason = validateFileWithConstraints(nextFile, {
              maxSizeBytes: fieldConfig.maxSizeBytes,
              allowedMimeTypes: fieldConfig.allowedMimeTypes,
              allowedExtensions: fieldConfig.allowedExtensions,
            });

            if (invalidReason) {
              const message =
                fieldConfig.fileValidationMessage ?? invalidReason;

              setFileErrors((current) => ({
                ...current,
                [field.name]: message,
              }));
              field.handleChange(
                resolveEmptyValue(fieldConfig.emptyValueStrategy) as never,
              );
              event.target.value = "";
              return;
            }

            setFileErrors((current) => {
              const { [field.name]: _removed, ...rest } = current;
              return rest;
            });

            field.handleChange(nextFile as never);
            event.target.value = "";
          }}
          aria-invalid={isInvalid}
        />
        {field.state.value instanceof File ? (
          <p className="text-xs text-muted-foreground">
            Selected: {field.state.value.name}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <Input
      {...commonMeta}
      type={
        fieldConfig.type === "email"
          ? "email"
          : fieldConfig.type === "date"
            ? "date"
            : "text"
      }
      value={inputValue}
      onChange={(event) =>
        field.handleChange(
          (event.target.value === ""
            ? resolveEmptyValue(fieldConfig.emptyValueStrategy)
            : event.target.value) as never,
        )
      }
      placeholder={fieldConfig.placeholder}
      aria-invalid={isInvalid}
    />
  );
}
