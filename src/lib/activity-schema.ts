import { z } from "zod";
import { tagSlug } from "./activity-tags";

export const activitySchema = z.object({
  title: z.string().trim().min(1),
  date: z.union([z.string().trim().min(1), z.date()]).pipe(z.coerce.date()),
  tags: z.array(z.string().trim().min(1).refine((tag) => tagSlug(tag).length > 0, "Tag must contain a letter or number.")).min(1),
  description: z.string().optional(),
});
