/**
 * Project types are inferred from the zod schemas in
 * [`@/lib/project-schema`](../lib/project-schema.ts) — the single source of
 * truth. This module re-exports them as a stable, type-only import surface.
 */
export type {
  Project,
  ProjectActions,
  ProjectFlags,
  ProjectImage,
  ProjectManifest,
  ProjectStats,
} from "@/lib/project-schema";
