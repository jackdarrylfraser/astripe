import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Upstash Redis
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    // Vercel Blob
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  },
  client: {
    // Add your client-side environment variables here
    // Note: Variables must be prefixed with PUBLIC_ to be exposed to the client
    // Example: PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: import.meta.env,
  clientPrefix: "PUBLIC_",
  skipValidation: import.meta.env.MODE === "development",
});
