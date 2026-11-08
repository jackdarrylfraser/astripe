import { z } from "zod";

export const activitySchema = z.object({
  title: z.string().trim().min(1),
  date: z.union([z.string().trim().min(1), z.date()]).pipe(z.coerce.date()),
  tags: z.array(z.string().trim().min(1)).min(1),
  description: z.string().optional(),
});
