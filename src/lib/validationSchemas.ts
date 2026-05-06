import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title must be 255 characters or fewer"),
  description: z.string().trim().min(1, "Description is required"),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

export const updateIssueStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
});

export type UpdateIssueStatusInput = z.infer<typeof updateIssueStatusSchema>;

export const credentialsLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email must be valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CredentialsLoginInput = z.infer<typeof credentialsLoginSchema>;
