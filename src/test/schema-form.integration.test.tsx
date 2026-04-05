import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  defineSchemaFormFields,
  SchemaForm,
  type SchemaFormValues,
} from "@/components/ui/form";

const testSchema = z.object({
  tags: z.array(z.enum(["api", "auth", "perf"])).optional(),
});

const visibilityAndFileSchema = z.object({
  hasAttachment: z.boolean(),
  attachment: z.instanceof(File).nullable().optional(),
});

const hiddenSubmitSchema = z.object({
  hasSecret: z.boolean(),
  secret: z.string().optional(),
});

type TestValues = SchemaFormValues<typeof testSchema>;

const baseFields = defineSchemaFormFields<typeof testSchema>([
  {
    name: "tags",
    label: "Tags",
    type: "multiselect-async",
    minSearchLength: 1,
    searchPlaceholder: "Search tags...",
    searchOptions: async (query: string) => {
      const all = [
        { label: "API", value: "api" },
        { label: "Auth", value: "auth" },
        { label: "Perf", value: "perf" },
      ] as const;
      return all.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      );
    },
    noResultsLabel: "No tags",
    emptyValueStrategy: "undefined",
  },
]);

describe("SchemaForm integration", () => {
  it("supports async multiselect toggle flow", async () => {
    const user = userEvent.setup();
    const submitted: TestValues[] = [];

    render(
      <SchemaForm
        schema={testSchema}
        fields={baseFields}
        defaultValues={{ tags: [] }}
        onSubmit={async (values) => {
          submitted.push(values);
        }}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search tags...");
    await user.type(searchInput, "a");

    await waitFor(() => {
      expect(screen.getByText("API")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("checkbox", { name: "API" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(submitted).toHaveLength(1);
      expect(submitted[0]?.tags).toEqual(["api"]);
    });
  });

  it("shows retry for async multiselect search failure", async () => {
    const user = userEvent.setup();

    const failingFields = defineSchemaFormFields<typeof testSchema>([
      {
        name: "tags",
        label: "Tags",
        type: "multiselect-async",
        minSearchLength: 1,
        searchPlaceholder: "Search tags...",
        searchOptions: async () => {
          throw new Error("failed");
        },
        errorLabel: "Failed to load tags",
        retryLabel: "Retry tags",
      },
    ]);

    render(
      <SchemaForm
        schema={testSchema}
        fields={failingFields}
        defaultValues={{ tags: [] }}
        onSubmit={async () => {
          return;
        }}
      />,
    );

    await user.type(screen.getByPlaceholderText("Search tags..."), "a");

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load tags", { selector: "p" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Retry tags" }),
      ).toBeInTheDocument();
    });
  });

  it("supports conditional field visibility with showWhen", async () => {
    const user = userEvent.setup();

    const fields = defineSchemaFormFields<typeof visibilityAndFileSchema>([
      {
        name: "hasAttachment",
        label: "Has attachment",
        type: "switch",
      },
      {
        name: "attachment",
        label: "Attachment",
        type: "file",
        showWhen: (values) => values.hasAttachment,
      },
    ]);

    render(
      <SchemaForm
        schema={visibilityAndFileSchema}
        fields={fields}
        defaultValues={{ hasAttachment: false, attachment: null }}
        onSubmit={async () => {
          return;
        }}
      />,
    );

    expect(screen.queryByLabelText("Attachment")).not.toBeInTheDocument();

    await user.click(screen.getByRole("switch", { name: "Has attachment" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Attachment")).toBeInTheDocument();
    });
  });

  it("rejects invalid files based on constraints", async () => {
    const user = userEvent.setup();

    const fields = defineSchemaFormFields<typeof visibilityAndFileSchema>([
      {
        name: "hasAttachment",
        label: "Has attachment",
        type: "switch",
      },
      {
        name: "attachment",
        label: "Attachment",
        type: "file",
        showWhen: (values) => values.hasAttachment,
        maxSizeBytes: 2,
        allowedMimeTypes: ["image/png"],
        allowedExtensions: [".png"],
      },
    ]);

    render(
      <SchemaForm
        schema={visibilityAndFileSchema}
        fields={fields}
        defaultValues={{ hasAttachment: true, attachment: null }}
        onSubmit={async () => {
          return;
        }}
      />,
    );

    const fileInput = screen.getByLabelText("Attachment") as HTMLInputElement;

    await user.upload(
      fileInput,
      new File(["too-big"], "bad.txt", { type: "text/plain" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /maximum size|unsupported file type|unsupported file extension/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("preserves hidden field values through submit and reset", async () => {
    const user = userEvent.setup();
    const submissions: Array<SchemaFormValues<typeof hiddenSubmitSchema>> = [];

    const fields = defineSchemaFormFields<typeof hiddenSubmitSchema>([
      {
        name: "hasSecret",
        label: "Has secret",
        type: "switch",
      },
      {
        name: "secret",
        label: "Secret",
        type: "text",
        showWhen: (values) => values.hasSecret,
      },
    ]);

    render(
      <SchemaForm
        schema={hiddenSubmitSchema}
        fields={fields}
        defaultValues={{ hasSecret: true, secret: "initial-secret" }}
        onSubmit={async (values) => {
          submissions.push(values);
        }}
      />,
    );

    await user.click(screen.getByRole("switch", { name: "Has secret" }));

    await waitFor(() => {
      expect(screen.queryByLabelText("Secret")).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(submissions).toHaveLength(1);
      expect(submissions[0]).toMatchObject({
        hasSecret: false,
        secret: "initial-secret",
      });
    });

    await user.click(screen.getByRole("button", { name: "Reset" }));

    await waitFor(() => {
      const secretInput = screen.getByLabelText("Secret") as HTMLInputElement;
      expect(secretInput.value).toBe("initial-secret");
    });
  });

  it("clears hidden field values when hiddenFieldBehavior is clear-on-hide", async () => {
    const user = userEvent.setup();
    const submissions: Array<SchemaFormValues<typeof hiddenSubmitSchema>> = [];

    const fields = defineSchemaFormFields<typeof hiddenSubmitSchema>([
      {
        name: "hasSecret",
        label: "Has secret",
        type: "switch",
      },
      {
        name: "secret",
        label: "Secret",
        type: "text",
        showWhen: (values) => values.hasSecret,
      },
    ]);

    render(
      <SchemaForm
        schema={hiddenSubmitSchema}
        fields={fields}
        defaultValues={{ hasSecret: true, secret: "initial-secret" }}
        hiddenFieldBehavior="clear-on-hide"
        onSubmit={async (values) => {
          submissions.push(values);
        }}
      />,
    );

    await user.click(screen.getByRole("switch", { name: "Has secret" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(submissions).toHaveLength(1);
      expect(submissions[0]).toMatchObject({
        hasSecret: false,
        secret: undefined,
      });
    });
  });

  it("does not immediately recreate a draft after clearing it", async () => {
    const user = userEvent.setup();

    const draftSchema = z.object({
      title: z.string().min(1),
    });

    const draftFields = defineSchemaFormFields<typeof draftSchema>([
      {
        name: "title",
        label: "Title",
        type: "text",
      },
    ]);

    const draftKey = "schema-form-draft-regression";
    const draftStore = new Map<string, string>();
    const localStorageMock = {
      getItem: (key: string) => draftStore.get(key) ?? null,
      setItem: (key: string, value: string) => {
        draftStore.set(key, value);
      },
      removeItem: (key: string) => {
        draftStore.delete(key);
      },
      clear: () => {
        draftStore.clear();
      },
    };

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: localStorageMock,
    });

    render(
      <SchemaForm
        schema={draftSchema}
        fields={draftFields}
        defaultValues={{ title: "" }}
        draftKey={draftKey}
        enableDraftAutosave
        promptDraftRestore={false}
        onSubmit={async () => {
          return;
        }}
      />,
    );

    await user.type(screen.getByLabelText("Title"), "Draft title");

    await waitFor(() => {
      expect(localStorageMock.getItem(draftKey)).toContain("Draft title");
    });

    await user.click(screen.getByRole("button", { name: "Clear draft" }));

    await waitFor(() => {
      expect(localStorageMock.getItem(draftKey)).toBeNull();
    });
  });
});
