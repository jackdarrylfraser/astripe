import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { activitySchema } from "./lib/activity-schema";

const activities = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/activities", retainBody: true }),
  schema: activitySchema.describe("Activity metadata with URL-safe tag slugs"),
});

export const collections = { activities };
