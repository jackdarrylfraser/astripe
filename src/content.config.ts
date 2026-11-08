import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const activities = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/activities" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { activities };
