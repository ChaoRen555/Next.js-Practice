import type { IssueItem } from "@/lib/issues";
import type { SxProps, Theme } from "@mui/material/styles";

export const formatStatus = (status: IssueItem["status"]) => {
  return status.replaceAll("_", " ");
};

const statusColorMap: Record<IssueItem["status"], string> = {
  OPEN: "#c24141",
  CLOSED: "#2f7d4c",
  IN_PROGRESS: "#7a4db3",
};

const statusBackgroundMap: Record<IssueItem["status"], string> = {
  OPEN: "rgba(194, 65, 65, 0.12)",
  CLOSED: "rgba(47, 125, 76, 0.12)",
  IN_PROGRESS: "rgba(122, 77, 179, 0.12)",
};

export const getStatusChipSx = (
  status: IssueItem["status"],
): SxProps<Theme> => {
  const color = statusColorMap[status];
  const backgroundColor = statusBackgroundMap[status];

  return {
    backgroundColor,
    color,
    fontWeight: 600,
    border: `1px solid ${color}`,
  };
};

export const getStatusTextSx = (
  status: IssueItem["status"],
): SxProps<Theme> => {
  return {
    color: statusColorMap[status],
    fontWeight: 600,
  };
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
