type OptionLike<TValue extends string> = {
  label: string;
  value: TValue;
};

export type FileConstraintOptions = {
  maxSizeBytes?: number;
  allowedMimeTypes?: ReadonlyArray<string>;
  allowedExtensions?: ReadonlyArray<string>;
};

const SELECT_EMPTY_VALUE = "__schema_form_empty__";

export function getControlledSelectValue(value: string | null | undefined) {
  return value && value !== SELECT_EMPTY_VALUE ? value : null;
}

export function shouldClearSearchOnEscape(key: string, query: string) {
  return key === "Escape" && query.length > 0;
}

export function shouldStopSearchKeyPropagation(key: string, query: string) {
  return key !== "Escape" || query.length > 0;
}

export function mergeUniqueOptions<TValue extends string>(
  current: ReadonlyArray<OptionLike<TValue>>,
  incoming: ReadonlyArray<OptionLike<TValue>>,
) {
  const map = new Map<string, OptionLike<TValue>>();

  for (const option of current) {
    map.set(option.value, option);
  }

  for (const option of incoming) {
    map.set(option.value, option);
  }

  return Array.from(map.values());
}

export function resolveHasMore<TValue extends string>(
  hasMoreOptions:
    | boolean
    | ((options: ReadonlyArray<OptionLike<TValue>>, query: string) => boolean)
    | undefined,
  options: ReadonlyArray<OptionLike<TValue>>,
  query: string,
) {
  if (typeof hasMoreOptions === "function") {
    return hasMoreOptions(options, query);
  }

  return Boolean(hasMoreOptions);
}

export function validateFileWithConstraints(
  file: File,
  options: FileConstraintOptions,
) {
  if (options.maxSizeBytes !== undefined && file.size > options.maxSizeBytes) {
    return `File exceeds maximum size of ${options.maxSizeBytes} bytes.`;
  }

  if (
    options.allowedMimeTypes?.length &&
    !options.allowedMimeTypes.includes(file.type)
  ) {
    return `Unsupported file type: ${file.type || "unknown"}.`;
  }

  if (options.allowedExtensions?.length) {
    const normalizedAllowed = options.allowedExtensions.map((extension) =>
      extension.startsWith(".")
        ? extension.toLowerCase()
        : `.${extension.toLowerCase()}`,
    );
    const lastDotIndex = file.name.lastIndexOf(".");
    const extension =
      lastDotIndex >= 0 ? file.name.slice(lastDotIndex).toLowerCase() : "";

    if (!normalizedAllowed.includes(extension)) {
      return `Unsupported file extension: ${extension || "none"}.`;
    }
  }

  return undefined;
}
