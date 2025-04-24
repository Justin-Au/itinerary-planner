import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    PORT: z.coerce.number().optional(),
    API_KEY: z.string(),

    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).default("localhost"),
    NEXTAUTH_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_CI_JOB_ID:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().default("localhost"),
  },
  clientPrefix: "NEXT_PUBLIC",
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
