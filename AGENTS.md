<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:serena-agent-rules -->
# Serena First When Helpful

Use Serena first for codebase exploration, symbol lookup, and precise edits whenever it can handle the task. Prefer Serena over reading entire source files or broad shell searches unless the work is non-code, the symbol is unknown, or Serena is not a good fit.
<!-- END:serena-agent-rules -->

<!-- BEGIN:shadcn-registry-guardrails -->
# Preserve Base shadcn Registry

Do not modify base shadcn registry component files under `src/components/ui/shadcn/` unless explicitly requested by the user.

For app-specific behavior or styling changes, create wrappers or custom components under `src/components/ui/` (outside the `shadcn` folder) and consume those wrappers in the app.
<!-- END:shadcn-registry-guardrails -->
