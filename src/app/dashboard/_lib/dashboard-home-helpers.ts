import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/material";

import type { IssueItem } from "@/lib/issues";

export type StatusKey = IssueItem["status"];

export const statusMeta: Record<
  StatusKey,
  {
    label: string;
    accent: string;
    background: string;
  }
> = {
  OPEN: {
    label: "Open",
    accent: "var(--status-open)",
    background: "var(--status-open-bg)",
  },
  IN_PROGRESS: {
    label: "In Progress",
    accent: "var(--status-progress)",
    background: "var(--status-progress-bg)",
  },
  CLOSED: {
    label: "Closed",
    accent: "var(--status-closed)",
    background: "var(--status-closed-bg)",
  },
};

const dashboardDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const relativeDateFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

export const cardSx: SxProps<Theme> = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "30px",
  border: "1px solid var(--line)",
  backgroundColor: "var(--surface)",
  boxShadow: "0 24px 60px -38px var(--panel-shadow)",
};

export const sectionEyebrowSx: SxProps<Theme> = {
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: "var(--accent-strong)",
};

export const sectionTitleSx: SxProps<Theme> = {
  fontWeight: 600,
  color: "var(--text)",
};

export const issueCardSx: SxProps<Theme> = {
  display: "block",
  borderRadius: "24px",
  border: "1px solid var(--line)",
  backgroundColor: "var(--surface-soft)",
  px: 2.5,
  py: 2.25,
  transition: "background-color 0.3s ease, border-color 0.3s ease",
  "&:hover": {
    borderColor: "var(--accent)",
    backgroundColor: "var(--surface-hover)",
  },
};

export const formatTimestamp = (value: string) => {
  return dashboardDateFormatter.format(new Date(value));
};

export const formatRelativeUpdate = (value: string) => {
  const diffMs = new Date(value).getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  if (Math.abs(diffMinutes) < 60) {
    return relativeDateFormatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return relativeDateFormatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return relativeDateFormatter.format(diffDays, "day");
};

export const trimDescription = (value: string, maxLength = 108) => {
  const normalized = value
    .replace(/```[\s\S]*?```/g, " ")
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

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
};
