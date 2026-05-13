import type { ProjectStatus } from "@prisma/client";

import { getNotificationText } from "@/lib/notifications";

export type ProjectItem = {
  id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string | null;
  ownerName: string | null;
};

export type ProjectFormData = {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  dueDate: string;
};

export type FieldErrors = {
  name?: string[];
  description?: string[];
  status?: string[];
  startDate?: string[];
  dueDate?: string[];
};

export const projectStatuses = [
  "PLANNED",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
] as const satisfies readonly ProjectStatus[];

export const initialProjectFormData: ProjectFormData = {
  name: "",
  description: "",
  status: "PLANNED",
  startDate: "",
  dueDate: "",
};

export const projectsQueryKey = ["projects"] as const;
export const projectQueryKey = (projectId: number) => [
  "projects",
  projectId,
] as const;

export const formatProjectStatus = (status: ProjectStatus) => {
  return status.replaceAll("_", " ");
};

export const createProject = async (formData: ProjectFormData) => {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = (await response.json()) as
    | ProjectItem
    | {
        error?: string;
        fieldErrors?: FieldErrors;
      };

  if (!response.ok) {
    const error = new Error(
      ("error" in data && data.error) ||
        getNotificationText("projects.create.error"),
    ) as Error & {
      status?: number;
      fieldErrors?: FieldErrors;
    };

    error.status = response.status;

    if ("fieldErrors" in data) {
      error.fieldErrors = data.fieldErrors;
    }

    throw error;
  }

  return data as ProjectItem;
};
