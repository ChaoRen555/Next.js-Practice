import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title must be 255 characters or fewer"),
  description: z.string().trim().min(1, "Description is required"),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
