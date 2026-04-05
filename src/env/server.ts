import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const serverEnv = createEnv({
  server: {
    SANITY_API_VERSION: z.string().min(1),
    SANITY_STUDIO_PROJECT_TITLE: z.string().min(1),
    SANITY_API_TOKEN: z.string().min(1),
    GITHUB_TOKEN: z.string().min(1),
    PROJECTS_SYNC_SECRET: z.string().min(1),
  },
  runtimeEnv: {
    SANITY_API_VERSION: process.env.SANITY_API_VERSION,
    SANITY_STUDIO_PROJECT_TITLE: process.env.SANITY_STUDIO_PROJECT_TITLE,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    PROJECTS_SYNC_SECRET: process.env.PROJECTS_SYNC_SECRET,
  },
});
