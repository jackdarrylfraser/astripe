import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { activitySchema } from "./lib/activity-schema";

const activities = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/activities", retainBody: true }),
  schema: activitySchema,
});

export const collections = { activities };
