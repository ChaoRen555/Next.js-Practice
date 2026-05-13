import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title must be 255 characters or fewer"),
  description: z.string().trim().min(1, "Description is required"),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

export const projectStatuses = [
  "PLANNED",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
] as const;

const requiredDateString = (fieldName: string) => z
  .string()
  .trim()
  .min(1, `${fieldName} is required`)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: `${fieldName} must be valid`,
  });

export const createProjectSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required").max(255, "Project name must be 255 characters or fewer"),
    description: z.string().trim().min(1, "Description is required").max(5000, "Description must be 5000 characters or fewer"),
    status: z.enum(projectStatuses),
    startDate: requiredDateString("Start date"),
    dueDate: requiredDateString("Due date"),
  })
  .refine(
    (data) => {
      return new Date(data.startDate) <= new Date(data.dueDate);
    },
    {
      message: "Due date must be after start date",
      path: ["dueDate"],
    },
  );

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const createCommentSchema = z.object({
  body: z.string().trim().min(1, "Comment is required").max(5000, "Comment must be 5000 characters or fewer"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const updateIssueStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
});

export type UpdateIssueStatusInput = z.infer<typeof updateIssueStatusSchema>;

export const credentialsLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email must be valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CredentialsLoginInput = z.infer<typeof credentialsLoginSchema>;

export const credentialsRegisterSchema = credentialsLoginSchema
  .extend({
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type CredentialsRegisterInput = z.infer<typeof credentialsRegisterSchema>;

export const updateProfileSchema = z.object({
  name: z.string().trim().max(80, "Name must be 80 characters or fewer"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be 128 characters or fewer"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be 128 characters or fewer"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
