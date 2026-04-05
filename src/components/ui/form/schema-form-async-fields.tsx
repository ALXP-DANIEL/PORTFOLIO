"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { SELECT_EMPTY_VALUE } from "./schema-form.constants";
import type {
  AsyncMultiSelectProps,
  AsyncSearchableSelectProps,
  SchemaFormSelectOption,
  SearchableSelectProps,
} from "./schema-form.types";
import {
  getControlledSelectValue,
  mergeUniqueOptions,
  resolveHasMore,
  shouldClearSearchOnEscape,
  shouldStopSearchKeyPropagation,
} from "./schema-form-helpers";

export function SearchableSelect<TValue extends string>({
  value,
  options,
  isInvalid,
  clearable,
  emptyOptionLabel,
  noResultsLabel,
  searchPlaceholder,
  placeholder,
  onValueChange,
}: SearchableSelectProps<TValue>) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return options;
    }

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(normalized) ||
        option.value.toLowerCase().includes(normalized),
    );
  }, [options, query]);

  return (
    <Select
      value={getControlledSelectValue(value)}
      onValueChange={(nextValue) =>
        onValueChange(nextValue ?? SELECT_EMPTY_VALUE)
      }
    >
      <SelectTrigger aria-invalid={isInvalid}>
        <SelectValue
          placeholder={
            placeholder ??
            (clearable ? (emptyOptionLabel ?? "None") : "Select an option")
          }
        />
      </SelectTrigger>
      <SelectContent>
        <div className="p-1">
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (shouldClearSearchOnEscape(event.key, query)) {
                event.preventDefault();
                event.stopPropagation();
                setQuery("");
                return;
              }

              if (shouldStopSearchKeyPropagation(event.key, query)) {
                event.stopPropagation();
              }
            }}
            placeholder={searchPlaceholder ?? "Search options..."}
            className="h-7 w-full"
          />
        </div>

        {clearable ? (
          <SelectItem value={SELECT_EMPTY_VALUE}>
            {emptyOptionLabel ?? "None"}
          </SelectItem>
        ) : null}

        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))
        ) : (
          <div className="px-2 py-2 text-sm text-muted-foreground">
            {noResultsLabel ?? "No results found"}
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

export function AsyncSearchableSelect<TValue extends string>({
  value,
  initialOptions,
  searchOptions,
  isInvalid,
  clearable,
  emptyOptionLabel,
  noResultsLabel,
  loadingLabel,
  minSearchLengthLabel,
  searchPlaceholder,
  placeholder,
  debounceMs,
  minSearchLength,
  cacheTtlMs,
  cacheMaxEntries,
  loadMoreOptions,
  hasMoreOptions,
  loadingMoreLabel,
  retryLabel,
  errorLabel,
  loadMoreLabel,
  onValueChange,
}: AsyncSearchableSelectProps<TValue>) {
  const [query, setQuery] = useState("");
  const [resolvedOptions, setResolvedOptions] = useState<
    ReadonlyArray<SchemaFormSelectOption<TValue>>
  >(initialOptions ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const latestSearchId = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<
    Map<
      string,
      {
        timestamp: number;
        options: ReadonlyArray<SchemaFormSelectOption<TValue>>;
      }
    >
  >(new Map());
  const normalizedQuery = query.trim();

  useEffect(() => {
    let isCanceled = false;
    const normalized = normalizedQuery;
    const cacheKey = `${normalized.toLowerCase()}::${retryCount}`;
    const minLength = minSearchLength ?? 0;
    const ttlMs = cacheTtlMs ?? 30_000;
    const maxEntries = cacheMaxEntries ?? 100;

    if (normalized.length < minLength) {
      setResolvedOptions(initialOptions ?? []);
      setIsLoading(false);
      setIsLoadingMore(false);
      setSearchError(null);
      setHasMore(false);
      setStatusMessage(
        minLength > 0
          ? `Type at least ${minLength} character${minLength === 1 ? "" : "s"}`
          : "",
      );
      return () => {
        isCanceled = true;
      };
    }

    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttlMs) {
      setResolvedOptions(cached.options);
      setIsLoading(false);
      setSearchError(null);
      setHasMore(resolveHasMore(hasMoreOptions, cached.options, normalized));
      setStatusMessage(
        cached.options.length > 0
          ? `${cached.options.length} result${cached.options.length === 1 ? "" : "s"} found`
          : (noResultsLabel ?? "No results found"),
      );
      return () => {
        isCanceled = true;
      };
    }

    const currentSearchId = latestSearchId.current + 1;
    latestSearchId.current = currentSearchId;

    const timeoutId = window.setTimeout(() => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setSearchError(null);
      setStatusMessage(loadingLabel ?? "Loading...");

      void searchOptions(normalized, { signal: controller.signal })
        .then((options) => {
          if (isCanceled || latestSearchId.current !== currentSearchId) {
            return;
          }

          cacheRef.current.set(cacheKey, {
            timestamp: Date.now(),
            options,
          });

          if (cacheRef.current.size > maxEntries) {
            const oldestKey = cacheRef.current.keys().next().value;
            if (oldestKey) {
              cacheRef.current.delete(oldestKey);
            }
          }

          setResolvedOptions(options);
          setHasMore(resolveHasMore(hasMoreOptions, options, normalized));
          setStatusMessage(
            options.length > 0
              ? `${options.length} result${options.length === 1 ? "" : "s"} found`
              : (noResultsLabel ?? "No results found"),
          );
        })
        .catch((error: unknown) => {
          if (isCanceled || latestSearchId.current !== currentSearchId) {
            return;
          }

          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setResolvedOptions([]);
          setHasMore(false);
          setSearchError(errorLabel ?? "Failed to load options");
          setStatusMessage(errorLabel ?? "Failed to load options");
        })
        .finally(() => {
          if (isCanceled || latestSearchId.current !== currentSearchId) {
            return;
          }
          setIsLoading(false);
        });
    }, debounceMs ?? 250);

    return () => {
      isCanceled = true;
      abortControllerRef.current?.abort();
      window.clearTimeout(timeoutId);
    };
  }, [
    normalizedQuery,
    searchOptions,
    debounceMs,
    minSearchLength,
    initialOptions,
    cacheTtlMs,
    cacheMaxEntries,
    loadingLabel,
    noResultsLabel,
    hasMoreOptions,
    errorLabel,
    retryCount,
  ]);

  const minLength = minSearchLength ?? 0;
  const canSearch = normalizedQuery.length >= minLength;

  const handleLoadMore = () => {
    if (!loadMoreOptions || isLoadingMore || !canSearch) {
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingMore(true);
    setSearchError(null);
    setStatusMessage(loadingMoreLabel ?? "Loading more...");

    void loadMoreOptions(normalizedQuery, {
      signal: controller.signal,
      currentOptions: resolvedOptions,
    })
      .then((nextOptions) => {
        const merged = mergeUniqueOptions(resolvedOptions, nextOptions);
        setResolvedOptions(merged);
        setHasMore(resolveHasMore(hasMoreOptions, merged, normalizedQuery));
        setStatusMessage(
          `${merged.length} result${merged.length === 1 ? "" : "s"} found`,
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSearchError(errorLabel ?? "Failed to load options");
        setStatusMessage(errorLabel ?? "Failed to load options");
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
  };

  return (
    <Select
      value={getControlledSelectValue(value)}
      onValueChange={(nextValue) =>
        onValueChange(nextValue ?? SELECT_EMPTY_VALUE)
      }
    >
      <SelectTrigger aria-invalid={isInvalid}>
        <SelectValue
          placeholder={
            placeholder ??
            (clearable ? (emptyOptionLabel ?? "None") : "Select an option")
          }
        />
      </SelectTrigger>
      <SelectContent>
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <div className="p-1">
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (shouldClearSearchOnEscape(event.key, query)) {
                event.preventDefault();
                event.stopPropagation();
                setQuery("");
                return;
              }

              if (shouldStopSearchKeyPropagation(event.key, query)) {
                event.stopPropagation();
              }
            }}
            placeholder={searchPlaceholder ?? "Search options..."}
            className="h-7 w-full"
          />
        </div>

        {clearable ? (
          <SelectItem value={SELECT_EMPTY_VALUE}>
            {emptyOptionLabel ?? "None"}
          </SelectItem>
        ) : null}

        {!canSearch ? (
          <div className="px-2 py-2 text-sm text-muted-foreground">
            {minSearchLengthLabel ??
              `Type at least ${minLength} character${minLength === 1 ? "" : "s"}`}
          </div>
        ) : isLoading ? (
          <div className="px-2 py-2 text-sm text-muted-foreground">
            {loadingLabel ?? "Loading..."}
          </div>
        ) : searchError ? (
          <div className="space-y-2 px-2 py-2">
            <p className="text-sm text-destructive">{searchError}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRetryCount((current) => current + 1)}
            >
              {retryLabel ?? "Retry"}
            </Button>
          </div>
        ) : resolvedOptions.length > 0 ? (
          <>
            {resolvedOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}

            {loadMoreOptions && hasMore ? (
              <div className="px-2 py-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                >
                  {isLoadingMore
                    ? (loadingMoreLabel ?? "Loading more...")
                    : (loadMoreLabel ?? "Load more")}
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="px-2 py-2 text-sm text-muted-foreground">
            {noResultsLabel ?? "No results found"}
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

export function AsyncMultiSelect<TValue extends string>({
  value,
  initialOptions,
  searchOptions,
  loadMoreOptions,
  hasMoreOptions,
  isInvalid,
  noResultsLabel,
  loadingLabel,
  loadingMoreLabel,
  retryLabel,
  errorLabel,
  loadMoreLabel,
  searchPlaceholder,
  debounceMs,
  minSearchLength,
  orientation,
  onToggleValue,
}: AsyncMultiSelectProps<TValue>) {
  const [query, setQuery] = useState("");
  const [resolvedOptions, setResolvedOptions] = useState<
    ReadonlyArray<SchemaFormSelectOption<TValue>>
  >(initialOptions ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const latestSearchId = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const normalizedQuery = query.trim();
    const retryNonce = retryCount;
    const minLength = minSearchLength ?? 0;

    if (normalizedQuery.length < minLength) {
      setResolvedOptions(initialOptions ?? []);
      setSearchError(null);
      setHasMore(false);
      setIsLoading(false);
      setStatusMessage(
        minLength > 0
          ? `Type at least ${minLength} character${minLength === 1 ? "" : "s"}`
          : "",
      );
      return;
    }

    const currentSearchId = latestSearchId.current + 1 + retryNonce;
    latestSearchId.current = currentSearchId;

    const timeoutId = window.setTimeout(() => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setSearchError(null);
      setStatusMessage(loadingLabel ?? "Loading...");

      void searchOptions(normalizedQuery, { signal: controller.signal })
        .then((options) => {
          if (latestSearchId.current !== currentSearchId) {
            return;
          }

          setResolvedOptions(options);
          setHasMore(resolveHasMore(hasMoreOptions, options, normalizedQuery));
          setStatusMessage(
            options.length > 0
              ? `${options.length} result${options.length === 1 ? "" : "s"} found`
              : (noResultsLabel ?? "No results found"),
          );
        })
        .catch((error: unknown) => {
          if (latestSearchId.current !== currentSearchId) {
            return;
          }

          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setResolvedOptions([]);
          setHasMore(false);
          setSearchError(errorLabel ?? "Failed to load options");
          setStatusMessage(errorLabel ?? "Failed to load options");
        })
        .finally(() => {
          if (latestSearchId.current !== currentSearchId) {
            return;
          }

          setIsLoading(false);
        });
    }, debounceMs ?? 250);

    return () => {
      abortControllerRef.current?.abort();
      window.clearTimeout(timeoutId);
    };
  }, [
    query,
    searchOptions,
    minSearchLength,
    initialOptions,
    hasMoreOptions,
    errorLabel,
    debounceMs,
    retryCount,
    loadingLabel,
    noResultsLabel,
  ]);

  const normalizedQuery = query.trim();
  const minLength = minSearchLength ?? 0;
  const canSearch = normalizedQuery.length >= minLength;

  const handleLoadMore = () => {
    if (!loadMoreOptions || isLoadingMore || !canSearch) {
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingMore(true);
    setSearchError(null);
    setStatusMessage(loadingMoreLabel ?? "Loading more...");

    void loadMoreOptions(normalizedQuery, {
      signal: controller.signal,
      currentOptions: resolvedOptions,
    })
      .then((nextOptions) => {
        const merged = mergeUniqueOptions(resolvedOptions, nextOptions);
        setResolvedOptions(merged);
        setHasMore(resolveHasMore(hasMoreOptions, merged, normalizedQuery));
        setStatusMessage(
          `${merged.length} result${merged.length === 1 ? "" : "s"} found`,
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSearchError(errorLabel ?? "Failed to load options");
        setStatusMessage(errorLabel ?? "Failed to load options");
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
  };

  return (
    <div className="space-y-2">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </div>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder ?? "Search options..."}
        onKeyDown={(event) => {
          if (shouldClearSearchOnEscape(event.key, query)) {
            event.preventDefault();
            setQuery("");
          }
        }}
        aria-invalid={isInvalid}
      />

      {!canSearch ? (
        <p className="text-sm text-muted-foreground">
          Type at least {minLength} character{minLength === 1 ? "" : "s"}
        </p>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">
          {loadingLabel ?? "Loading..."}
        </p>
      ) : searchError ? (
        <div className="space-y-2">
          <p className="text-sm text-destructive">{searchError}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRetryCount((current) => current + 1)}
          >
            {retryLabel ?? "Retry"}
          </Button>
        </div>
      ) : resolvedOptions.length > 0 ? (
        <div
          className={
            orientation === "horizontal" ? "flex flex-wrap gap-3" : "space-y-2"
          }
        >
          {resolvedOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                id={`async-multi-${option.value}`}
                checked={value.includes(option.value)}
                onCheckedChange={() => onToggleValue(option.value)}
                aria-invalid={isInvalid}
              />
              <label
                htmlFor={`async-multi-${option.value}`}
                className="cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}

          {loadMoreOptions && hasMore ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoadingMore}
              onClick={handleLoadMore}
            >
              {isLoadingMore
                ? (loadingMoreLabel ?? "Loading more...")
                : (loadMoreLabel ?? "Load more")}
            </Button>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {noResultsLabel ?? "No results found"}
        </p>
      )}
    </div>
  );
}
