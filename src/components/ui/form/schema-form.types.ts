import type { z } from "zod";

export type AnyZodObject = z.ZodObject<z.ZodRawShape>;

type PrimitiveFieldValue = string | number | boolean;
export type EmptyValueStrategy = "undefined" | "null";

export type SchemaFormValues<TSchema extends AnyZodObject> = z.infer<TSchema>;

type NonNullish<T> = Exclude<T, null | undefined>;

type PrimitiveSchemaValues<TSchema extends AnyZodObject> = {
  [K in keyof SchemaFormValues<TSchema> as NonNullish<
    SchemaFormValues<TSchema>[K]
  > extends PrimitiveFieldValue
    ? K
    : never]: SchemaFormValues<TSchema>[K];
};

type FieldNamesByValue<TSchema extends AnyZodObject, TValue> = Extract<
  {
    [K in keyof PrimitiveSchemaValues<TSchema>]: NonNullish<
      PrimitiveSchemaValues<TSchema>[K]
    > extends TValue
      ? K
      : never;
  }[keyof PrimitiveSchemaValues<TSchema>],
  string
>;

type StringArrayFieldNames<TSchema extends AnyZodObject> = Extract<
  {
    [K in keyof SchemaFormValues<TSchema>]: NonNullish<
      SchemaFormValues<TSchema>[K]
    > extends Array<infer U>
      ? U extends string
        ? K
        : never
      : never;
  }[keyof SchemaFormValues<TSchema>],
  string
>;

type FileFieldNames<TSchema extends AnyZodObject> = Extract<
  {
    [K in keyof SchemaFormValues<TSchema>]: NonNullish<
      SchemaFormValues<TSchema>[K]
    > extends File
      ? K
      : never;
  }[keyof SchemaFormValues<TSchema>],
  string
>;

export type SchemaFormDateRange = {
  from: string | null;
  to: string | null;
};

type DateRangeFieldNames<TSchema extends AnyZodObject> = Extract<
  {
    [K in keyof SchemaFormValues<TSchema>]: NonNullish<
      SchemaFormValues<TSchema>[K]
    > extends SchemaFormDateRange
      ? K
      : never;
  }[keyof SchemaFormValues<TSchema>],
  string
>;

type VisibilityRule<TSchema extends AnyZodObject> = {
  showWhen?: (values: SchemaFormValues<TSchema>) => boolean;
  hideWhen?: (values: SchemaFormValues<TSchema>) => boolean;
};

type BaseFieldConfig<TName extends string> = {
  name: TName;
  label: string;
  placeholder?: string;
  description?: string;
  sectionId?: string;
  sectionTitle?: string;
  sectionDescription?: string;
};

export type SchemaFormSelectOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

export type SchemaFormNativeSelectOptionGroup<TValue extends string = string> =
  {
    label: string;
    options: ReadonlyArray<SchemaFormSelectOption<TValue>>;
  };

type StringFieldConfig<TSchema extends AnyZodObject> = BaseFieldConfig<
  FieldNamesByValue<TSchema, string>
> & {
  type?: "text" | "email" | "textarea" | "date";
  emptyValueStrategy?: EmptyValueStrategy;
};

type SelectFieldConfig<TSchema extends AnyZodObject> = {
  [K in FieldNamesByValue<TSchema, string>]: BaseFieldConfig<K> & {
    type: "select";
    options: ReadonlyArray<
      SchemaFormSelectOption<NonNullish<SchemaFormValues<TSchema>[K]> & string>
    >;
    clearable?: boolean;
    emptyOptionLabel?: string;
    emptyValueStrategy?: EmptyValueStrategy;
  };
}[FieldNamesByValue<TSchema, string>];

type SearchableSelectFieldConfig<TSchema extends AnyZodObject> = {
  [K in FieldNamesByValue<TSchema, string>]: BaseFieldConfig<K> & {
    type: "searchable-select";
    options: ReadonlyArray<
      SchemaFormSelectOption<NonNullish<SchemaFormValues<TSchema>[K]> & string>
    >;
    clearable?: boolean;
    emptyOptionLabel?: string;
    noResultsLabel?: string;
    searchPlaceholder?: string;
    emptyValueStrategy?: EmptyValueStrategy;
  };
}[FieldNamesByValue<TSchema, string>];

type AsyncSearchableSelectFieldConfig<TSchema extends AnyZodObject> = {
  [K in FieldNamesByValue<TSchema, string>]: BaseFieldConfig<K> & {
    type: "searchable-select-async";
    initialOptions?: ReadonlyArray<
      SchemaFormSelectOption<NonNullish<SchemaFormValues<TSchema>[K]> & string>
    >;
    searchOptions: (
      query: string,
      context: { signal: AbortSignal },
    ) => Promise<
      ReadonlyArray<
        SchemaFormSelectOption<
          NonNullish<SchemaFormValues<TSchema>[K]> & string
        >
      >
    >;
    debounceMs?: number;
    minSearchLength?: number;
    cacheTtlMs?: number;
    cacheMaxEntries?: number;
    loadMoreOptions?: (
      query: string,
      context: {
        signal: AbortSignal;
        currentOptions: ReadonlyArray<
          SchemaFormSelectOption<
            NonNullish<SchemaFormValues<TSchema>[K]> & string
          >
        >;
      },
    ) => Promise<
      ReadonlyArray<
        SchemaFormSelectOption<
          NonNullish<SchemaFormValues<TSchema>[K]> & string
        >
      >
    >;
    hasMoreOptions?:
      | boolean
      | ((
          options: ReadonlyArray<
            SchemaFormSelectOption<
              NonNullish<SchemaFormValues<TSchema>[K]> & string
            >
          >,
          query: string,
        ) => boolean);
    clearable?: boolean;
    emptyOptionLabel?: string;
    noResultsLabel?: string;
    loadingLabel?: string;
    loadingMoreLabel?: string;
    retryLabel?: string;
    errorLabel?: string;
    loadMoreLabel?: string;
    minSearchLengthLabel?: string;
    searchPlaceholder?: string;
    emptyValueStrategy?: EmptyValueStrategy;
  };
}[FieldNamesByValue<TSchema, string>];

type NativeSelectFieldConfig<TSchema extends AnyZodObject> = {
  [K in FieldNamesByValue<TSchema, string>]: BaseFieldConfig<K> & {
    type: "native-select";
    options: ReadonlyArray<
      | SchemaFormSelectOption<
          NonNullish<SchemaFormValues<TSchema>[K]> & string
        >
      | SchemaFormNativeSelectOptionGroup<
          NonNullish<SchemaFormValues<TSchema>[K]> & string
        >
    >;
    clearable?: boolean;
    emptyOptionLabel?: string;
    emptyValueStrategy?: EmptyValueStrategy;
  };
}[FieldNamesByValue<TSchema, string>];

type NumberFieldConfig<TSchema extends AnyZodObject> = BaseFieldConfig<
  FieldNamesByValue<TSchema, number>
> & {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  emptyValueStrategy?: EmptyValueStrategy;
};

type BooleanFieldConfig<TSchema extends AnyZodObject> = BaseFieldConfig<
  FieldNamesByValue<TSchema, boolean>
> & {
  type: "switch";
  switchSize?: "sm" | "default";
};

type MultiSelectFieldConfig<TSchema extends AnyZodObject> = {
  [K in StringArrayFieldNames<TSchema>]: BaseFieldConfig<K> & {
    type: "multiselect";
    options: ReadonlyArray<
      SchemaFormSelectOption<
        NonNullish<SchemaFormValues<TSchema>[K]> extends Array<infer U>
          ? U & string
          : string
      >
    >;
    orientation?: "vertical" | "horizontal";
    emptyValueStrategy?: EmptyValueStrategy;
  };
}[StringArrayFieldNames<TSchema>];

type AsyncMultiSelectFieldConfig<TSchema extends AnyZodObject> = {
  [K in StringArrayFieldNames<TSchema>]: BaseFieldConfig<K> & {
    type: "multiselect-async";
    initialOptions?: ReadonlyArray<
      SchemaFormSelectOption<
        NonNullish<SchemaFormValues<TSchema>[K]> extends Array<infer U>
          ? U & string
          : string
      >
    >;
    searchOptions: (
      query: string,
      context: { signal: AbortSignal },
    ) => Promise<
      ReadonlyArray<
        SchemaFormSelectOption<
          NonNullish<SchemaFormValues<TSchema>[K]> extends Array<infer U>
            ? U & string
            : string
        >
      >
    >;
    loadMoreOptions?: (
      query: string,
      context: {
        signal: AbortSignal;
        currentOptions: ReadonlyArray<
          SchemaFormSelectOption<
            NonNullish<SchemaFormValues<TSchema>[K]> extends Array<infer U>
              ? U & string
              : string
          >
        >;
      },
    ) => Promise<
      ReadonlyArray<
        SchemaFormSelectOption<
          NonNullish<SchemaFormValues<TSchema>[K]> extends Array<infer U>
            ? U & string
            : string
        >
      >
    >;
    hasMoreOptions?:
      | boolean
      | ((
          options: ReadonlyArray<
            SchemaFormSelectOption<
              NonNullish<SchemaFormValues<TSchema>[K]> extends Array<infer U>
                ? U & string
                : string
            >
          >,
          query: string,
        ) => boolean);
    debounceMs?: number;
    minSearchLength?: number;
    loadingLabel?: string;
    loadingMoreLabel?: string;
    retryLabel?: string;
    errorLabel?: string;
    loadMoreLabel?: string;
    noResultsLabel?: string;
    searchPlaceholder?: string;
    orientation?: "vertical" | "horizontal";
    emptyValueStrategy?: EmptyValueStrategy;
  };
}[StringArrayFieldNames<TSchema>];

type FileFieldConfig<TSchema extends AnyZodObject> = BaseFieldConfig<
  FileFieldNames<TSchema>
> & {
  type: "file";
  accept?: string;
  maxSizeBytes?: number;
  allowedMimeTypes?: ReadonlyArray<string>;
  allowedExtensions?: ReadonlyArray<string>;
  fileValidationMessage?: string;
  emptyValueStrategy?: EmptyValueStrategy;
};

type DateRangeFieldConfig<TSchema extends AnyZodObject> = BaseFieldConfig<
  DateRangeFieldNames<TSchema>
> & {
  type: "date-range";
  fromLabel?: string;
  toLabel?: string;
  emptyValueStrategy?: EmptyValueStrategy;
};

export type SchemaFormFieldConfig<TSchema extends AnyZodObject> = (
  | StringFieldConfig<TSchema>
  | SelectFieldConfig<TSchema>
  | SearchableSelectFieldConfig<TSchema>
  | AsyncSearchableSelectFieldConfig<TSchema>
  | NativeSelectFieldConfig<TSchema>
  | NumberFieldConfig<TSchema>
  | BooleanFieldConfig<TSchema>
  | MultiSelectFieldConfig<TSchema>
  | AsyncMultiSelectFieldConfig<TSchema>
  | FileFieldConfig<TSchema>
  | DateRangeFieldConfig<TSchema>
) &
  VisibilityRule<TSchema>;

export type SchemaFormProps<TSchema extends AnyZodObject> = {
  schema: TSchema;
  fields: ReadonlyArray<SchemaFormFieldConfig<TSchema>>;
  defaultValues: SchemaFormValues<TSchema>;
  submitLabel?: string;
  submittingLabel?: string;
  resetLabel?: string;
  draftKey?: string;
  enableDraftAutosave?: boolean;
  clearDraftOnSubmit?: boolean;
  promptDraftRestore?: boolean;
  draftRestoredLabel?: string;
  restoreDraftLabel?: string;
  discardDraftLabel?: string;
  clearDraftLabel?: string;
  hiddenFieldBehavior?: "preserve" | "clear-on-hide";
  errorSummaryTitle?: string;
  focusErrorLabel?: string;
  onSubmit: (values: SchemaFormValues<TSchema>) => void | Promise<void>;
};

export type SearchableSelectProps<TValue extends string> = {
  value: string | null;
  options: ReadonlyArray<SchemaFormSelectOption<TValue>>;
  isInvalid: boolean;
  clearable?: boolean;
  emptyOptionLabel?: string;
  noResultsLabel?: string;
  searchPlaceholder?: string;
  placeholder?: string;
  onValueChange: (nextValue: string) => void;
};

export type AsyncSearchableSelectProps<TValue extends string> = {
  value: string | null;
  initialOptions?: ReadonlyArray<SchemaFormSelectOption<TValue>>;
  searchOptions: (
    query: string,
    context: { signal: AbortSignal },
  ) => Promise<ReadonlyArray<SchemaFormSelectOption<TValue>>>;
  isInvalid: boolean;
  clearable?: boolean;
  emptyOptionLabel?: string;
  noResultsLabel?: string;
  loadingLabel?: string;
  minSearchLengthLabel?: string;
  searchPlaceholder?: string;
  placeholder?: string;
  debounceMs?: number;
  minSearchLength?: number;
  cacheTtlMs?: number;
  cacheMaxEntries?: number;
  loadMoreOptions?: (
    query: string,
    context: {
      signal: AbortSignal;
      currentOptions: ReadonlyArray<SchemaFormSelectOption<TValue>>;
    },
  ) => Promise<ReadonlyArray<SchemaFormSelectOption<TValue>>>;
  hasMoreOptions?:
    | boolean
    | ((
        options: ReadonlyArray<SchemaFormSelectOption<TValue>>,
        query: string,
      ) => boolean);
  loadingMoreLabel?: string;
  retryLabel?: string;
  errorLabel?: string;
  loadMoreLabel?: string;
  onValueChange: (nextValue: string) => void;
};

export type AsyncMultiSelectProps<TValue extends string> = {
  value: ReadonlyArray<string>;
  initialOptions?: ReadonlyArray<SchemaFormSelectOption<TValue>>;
  searchOptions: (
    query: string,
    context: { signal: AbortSignal },
  ) => Promise<ReadonlyArray<SchemaFormSelectOption<TValue>>>;
  loadMoreOptions?: (
    query: string,
    context: {
      signal: AbortSignal;
      currentOptions: ReadonlyArray<SchemaFormSelectOption<TValue>>;
    },
  ) => Promise<ReadonlyArray<SchemaFormSelectOption<TValue>>>;
  hasMoreOptions?:
    | boolean
    | ((
        options: ReadonlyArray<SchemaFormSelectOption<TValue>>,
        query: string,
      ) => boolean);
  isInvalid: boolean;
  noResultsLabel?: string;
  loadingLabel?: string;
  loadingMoreLabel?: string;
  retryLabel?: string;
  errorLabel?: string;
  loadMoreLabel?: string;
  searchPlaceholder?: string;
  debounceMs?: number;
  minSearchLength?: number;
  orientation?: "vertical" | "horizontal";
  onToggleValue: (value: string) => void;
};
