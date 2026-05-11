import type { UserRole } from "@prisma/client";

export type PermissionUser = {
  id: string;
  role: UserRole;
};

export type PermissionIssue = {
  creatorId: string | null;
};

export type PermissionComment = {
  authorId: string;
};

export const isAdmin = (user: PermissionUser) => user.role === "ADMIN";

export const canManageIssue = (
  user: PermissionUser,
  issue: PermissionIssue,
) => {
  return isAdmin(user) || issue.creatorId === user.id;
};

export const canUpdateIssueStatus = (user: PermissionUser) => isAdmin(user);

export const canDeleteComment = (
  user: PermissionUser,
  comment: PermissionComment,
) => {
  return isAdmin(user) || comment.authorId === user.id;
};
