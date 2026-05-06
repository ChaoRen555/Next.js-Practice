import type { UserRole } from "@prisma/client";

export type PermissionUser = {
  id: string;
  role: UserRole;
};

export type PermissionIssue = {
  creatorId: string | null;
};

export const isAdmin = (user: PermissionUser) => user.role === "ADMIN";

export const canManageIssue = (
  user: PermissionUser,
  issue: PermissionIssue,
) => {
  return isAdmin(user) || issue.creatorId === user.id;
};
