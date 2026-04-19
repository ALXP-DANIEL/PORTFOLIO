import { describe, expect, it } from "vitest";
import {
  getControlledSelectValue,
  mergeUniqueOptions,
  resolveHasMore,
  shouldClearSearchOnEscape,
  shouldStopSearchKeyPropagation,
  validateFileWithConstraints,
} from "@/components/ui/form";

describe("schema-form helpers", () => {
  it("maps empty/sentinel values to controlled null", () => {
    expect(getControlledSelectValue(undefined)).toBeNull();
    expect(getControlledSelectValue(null)).toBeNull();
    expect(getControlledSelectValue("__schema_form_empty__")).toBeNull();
    expect(getControlledSelectValue("core")).toBe("core");
  });

  it("supports escape key search UX", () => {
    expect(shouldClearSearchOnEscape("Escape", "abc")).toBe(true);
    expect(shouldClearSearchOnEscape("Escape", "")).toBe(false);
    expect(shouldStopSearchKeyPropagation("a", "abc")).toBe(true);
    expect(shouldStopSearchKeyPropagation("Escape", "abc")).toBe(true);
    expect(shouldStopSearchKeyPropagation("Escape", "")).toBe(false);
  });

  it("merges unique options by value while preserving order", () => {
    const current = [
      { label: "Ali", value: "ali" },
      { label: "Nadia", value: "nadia" },
    ] as const;
    const incoming = [
      { label: "Nadia Updated", value: "nadia" },
      { label: "Amir", value: "amir" },
    ] as const;

    expect(mergeUniqueOptions(current, incoming)).toEqual([
      { label: "Ali", value: "ali" },
      { label: "Nadia Updated", value: "nadia" },
      { label: "Amir", value: "amir" },
    ]);
  });

  it("resolves has-more from both boolean and callback", () => {
    const options = [
      { label: "Ali", value: "ali" },
      { label: "Nadia", value: "nadia" },
    ] as const;

    expect(resolveHasMore(true, options, "a")).toBe(true);
    expect(resolveHasMore(false, options, "a")).toBe(false);
    expect(
      resolveHasMore(
        (nextOptions, query) => nextOptions.length < 3 && query === "a",
        options,
        "a",
      ),
    ).toBe(true);
  });

  it("validates file size, mime type, and extension constraints", () => {
    const pngFile = new File(["abcd"], "avatar.png", { type: "image/png" });
    const txtFile = new File(["abcd"], "readme.txt", { type: "text/plain" });

    expect(
      validateFileWithConstraints(pngFile, {
        maxSizeBytes: 2,
      }),
    ).toContain("maximum size");

    expect(
      validateFileWithConstraints(txtFile, {
        allowedMimeTypes: ["image/png"],
      }),
    ).toContain("Unsupported file type");

    expect(
      validateFileWithConstraints(txtFile, {
        allowedExtensions: [".png"],
      }),
    ).toContain("Unsupported file extension");

    expect(
      validateFileWithConstraints(pngFile, {
        maxSizeBytes: 10,
        allowedMimeTypes: ["image/png"],
        allowedExtensions: ["png"],
      }),
    ).toBeUndefined();
  });
});
