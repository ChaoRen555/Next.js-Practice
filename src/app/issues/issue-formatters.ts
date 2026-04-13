import type { IssueItem } from "@/lib/issues";

export const formatStatus = (status: IssueItem["status"]) => {
  return status.replaceAll("_", " ");
};

export const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString();
};

export const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
};
