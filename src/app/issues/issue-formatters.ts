import type { IssueItem } from "@/lib/issues";

export const formatStatus = (status: IssueItem["status"]) => {
  return status.replaceAll("_", " ");
};

export const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString();
};

const stripMarkdown = (value: string) => {
  return value
    .replace(/```[\s\S]*?```/g, (match) =>
      match.replace(/```/g, " ").replace(/\n/g, " "),
    )
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const formatDescriptionPreview = (value: string, maxLength = 90) => {
  const plainText = stripMarkdown(value);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
};
