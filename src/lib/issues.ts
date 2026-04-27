import type { Issue, User } from "@prisma/client";

export type IssueItem = {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  createdByName: string | null;
};

export const issueStatuses = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;
export const issueOrderByFields = [
  "id",
  "title",
  "createdByName",
  "status",
  "createdAt",
] as const;
export const issueOrderDirections = ["asc", "desc"] as const;

export type IssueStatus = (typeof issueStatuses)[number];
export type IssueStatusFilter = IssueStatus | "ALL";
export type IssueOrderBy = (typeof issueOrderByFields)[number];
export type IssueOrderDirection = (typeof issueOrderDirections)[number];

export type IssuesListParams = {
  status: IssueStatus | null;
  orderBy: IssueOrderBy;
  order: IssueOrderDirection;
};

export const isIssueStatus = (status: string): status is IssueStatus => {
  return issueStatuses.some((issueStatus) => issueStatus === status);
};

export const isIssueOrderBy = (orderBy: string): orderBy is IssueOrderBy => {
  return issueOrderByFields.some((field) => field === orderBy);
};

export const isIssueOrderDirection = (
  order: string,
): order is IssueOrderDirection => {
  return issueOrderDirections.some((direction) => direction === order);
};

export type FieldErrors = {
  title?: string[];
  description?: string[];
};

export type IssueFormData = {
  title: string;
  description: string;
};

export const initialIssueFormData: IssueFormData = {
  title: "",
  description: "",
};

export const issuesQueryKey = ["issues"] as const;
export const issuesListQueryKey = (params: IssuesListParams) => {
  return [...issuesQueryKey, params] as const;
};
export const issueQueryKey = (issueId: number) => ["issues", issueId] as const;

type IssueWithCreator = Issue & {
  creator: Pick<User, "name"> | null;
};

export const serializeIssue = (issue: IssueWithCreator): IssueItem => {
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    status: issue.status,
    createdAt: issue.createdAt.toISOString(),
    updatedAt: issue.updatedAt.toISOString(),
    createdByName: issue.creator?.name ?? null,
  };
};

export const fetchIssues = async ({
  status,
  orderBy,
  order,
}: IssuesListParams) => {
  const searchParams = new URLSearchParams();

  if (status) {
    searchParams.set("status", status);
  }

  searchParams.set("orderBy", orderBy);
  searchParams.set("order", order);

  const queryString = searchParams.toString();
  const response = await fetch(`/api/issues${queryString ? `?${queryString}` : ""}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load issues right now.");
  }

  return (await response.json()) as IssueItem[];
};

export const createIssue = async (formData: IssueFormData) => {
  const response = await fetch("/api/issues", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = (await response.json()) as
    | IssueItem
    | {
        error?: string;
        fieldErrors?: FieldErrors;
      };

  if (!response.ok) {
    const error = new Error(
      ("error" in data && data.error) || "Unable to create issue.",
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

  return data as IssueItem;
};

export const fetchIssue = async (issueId: number) => {
  const response = await fetch(`/api/issues/${issueId}`, {
    cache: "no-store",
  });

  const data = (await response.json()) as
    | IssueItem
    | {
        error?: string;
      };

  if (!response.ok) {
    throw new Error(("error" in data && data.error) || "Unable to load issue.");
  }

  return data as IssueItem;
};

export const updateIssue = async (issueId: number, formData: IssueFormData) => {
  const response = await fetch(`/api/issues/${issueId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = (await response.json()) as
    | IssueItem
    | {
        error?: string;
        fieldErrors?: FieldErrors;
      };

  if (!response.ok) {
    const error = new Error(
      ("error" in data && data.error) || "Unable to update issue.",
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

  return data as IssueItem;
};

export const deleteIssue = async (issueId: number) => {
  const response = await fetch(`/api/issues/${issueId}`, {
    method: "DELETE",
  });

  const data = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to delete issue.");
  }
};
