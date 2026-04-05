import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
  type SchemaFormDateRange,
  type SchemaFormFieldConfig,
  SchemaFormFieldControl,
} from "@/components/ui/form";

const nativeSelectSchema = z.object({
  team: z.string().optional().nullable(),
});

const fileSchema = z.object({
  attachment: z.instanceof(File).nullable().optional(),
});

const dateRangeSchema = z.object({
  availability: z
    .object({
      from: z.string().nullable(),
      to: z.string().nullable(),
    })
    .optional()
    .nullable(),
});

function createBaseProps() {
  return {
    field: {
      name: "team",
      state: { value: "core" },
      handleBlur: vi.fn(),
      handleChange: vi.fn(),
    },
    isInvalid: false,
    inputValue: "core",
    arrayValue: [],
    dateRangeValue: { from: null, to: null } as SchemaFormDateRange,
    commonMeta: {
      id: "team",
      name: "team",
      onBlur: vi.fn(),
    },
    setFileErrors: vi.fn(),
  };
}

describe("SchemaFormFieldControl", () => {
  it("clears native-select to empty strategy value", () => {
    const props = createBaseProps();
    const fieldConfig = {
      name: "team",
      label: "Team",
      type: "native-select" as const,
      clearable: true,
      emptyOptionLabel: "None",
      emptyValueStrategy: "undefined" as const,
      options: [
        { label: "Core", value: "core" },
        { label: "Growth", value: "growth" },
      ],
    } satisfies SchemaFormFieldConfig<typeof nativeSelectSchema>;

    const { container } = render(
      <SchemaFormFieldControl<typeof nativeSelectSchema>
        {...props}
        fieldConfig={fieldConfig}
      />,
    );

    const select = container.querySelector("select");
    expect(select).not.toBeNull();

    fireEvent.change(select as HTMLSelectElement, {
      target: { value: "__schema_form_empty__" },
    });

    expect(props.field.handleChange).toHaveBeenCalledWith(undefined);
  });

  it("applies file validation and writes file error state", async () => {
    const user = userEvent.setup();
    const props = createBaseProps();
    const fieldConfig = {
      name: "attachment",
      label: "Attachment",
      type: "file" as const,
      maxSizeBytes: 2,
      fileValidationMessage: "File invalid",
    } satisfies SchemaFormFieldConfig<typeof fileSchema>;

    const { container } = render(
      <SchemaFormFieldControl<typeof fileSchema>
        {...props}
        field={{
          ...props.field,
          name: "attachment",
          state: { value: null },
        }}
        commonMeta={{
          ...props.commonMeta,
          id: "attachment",
          name: "attachment",
        }}
        fieldConfig={fieldConfig}
      />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await user.upload(fileInput, new File(["too-big"], "bad.txt"));

    expect(props.field.handleChange).toHaveBeenCalledWith(undefined);
    expect(fileInput.value).toBe("");

    const fileErrorUpdate = props.setFileErrors.mock.calls.at(-1)?.[0] as
      | ((current: Record<string, string>) => Record<string, string>)
      | undefined;

    expect(typeof fileErrorUpdate).toBe("function");
    expect(fileErrorUpdate?.({})).toEqual({ attachment: "File invalid" });
  });

  it("clears date-range to empty value when both dates are removed", () => {
    const props = createBaseProps();

    const fieldConfig = {
      name: "availability",
      label: "Availability",
      type: "date-range" as const,
      emptyValueStrategy: "undefined" as const,
    } satisfies SchemaFormFieldConfig<typeof dateRangeSchema>;

    const { container, rerender } = render(
      <SchemaFormFieldControl<typeof dateRangeSchema>
        {...props}
        dateRangeValue={{ from: "2026-01-01", to: "2026-01-02" }}
        fieldConfig={fieldConfig}
      />,
    );

    const dateInputs = container.querySelectorAll('input[type="date"]');
    expect(dateInputs).toHaveLength(2);

    fireEvent.change(dateInputs[0] as HTMLInputElement, {
      target: { value: "" },
    });

    rerender(
      <SchemaFormFieldControl<typeof dateRangeSchema>
        {...props}
        dateRangeValue={{ from: null, to: "2026-01-02" }}
        fieldConfig={fieldConfig}
      />,
    );

    const updatedInputs = container.querySelectorAll('input[type="date"]');
    fireEvent.change(updatedInputs[1] as HTMLInputElement, {
      target: { value: "" },
    });

    expect(props.field.handleChange).toHaveBeenCalledWith({
      from: null,
      to: "2026-01-02",
    });
    expect(props.field.handleChange).toHaveBeenLastCalledWith(undefined);
  });
});
