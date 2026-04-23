import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import type { IssueItem } from "@/lib/issues";

type DashboardHomeProps = {
  issues: IssueItem[];
};

type StatusKey = IssueItem["status"];

const statusMeta: Record<
  StatusKey,
  {
    label: string;
    accent: string;
    background: string;
  }
> = {
  OPEN: {
    label: "Open",
    accent: "#b94b4b",
    background: "rgba(185, 75, 75, 0.12)",
  },
  IN_PROGRESS: {
    label: "In Progress",
    accent: "#7561b5",
    background: "rgba(117, 97, 181, 0.12)",
  },
  CLOSED: {
    label: "Closed",
    accent: "#4e8b64",
    background: "rgba(78, 139, 100, 0.12)",
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

const cardSx = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "30px",
  border: "1px solid rgba(255, 255, 255, 0.65)",
  backgroundColor: "rgba(255, 255, 255, 0.55)",
  boxShadow: "0 24px 60px -38px rgba(95,121,113,0.34)",
};

const formatTimestamp = (value: string) => {
  return dashboardDateFormatter.format(new Date(value));
};

const formatRelativeUpdate = (value: string) => {
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

const trimDescription = (value: string, maxLength = 108) => {
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

export default function DashboardHome({ issues }: DashboardHomeProps) {
  const totalIssues = issues.length;
  const openIssues = issues.filter((issue) => issue.status === "OPEN");
  const inProgressIssues = issues.filter((issue) => issue.status === "IN_PROGRESS");
  const closedIssues = issues.filter((issue) => issue.status === "CLOSED");
  const recentActivity = issues.slice(0, 5);

  const statusBreakdown = [
    { key: "OPEN" as const, count: openIssues.length },
    { key: "IN_PROGRESS" as const, count: inProgressIssues.length },
    { key: "CLOSED" as const, count: closedIssues.length },
  ];

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        mx: "auto",
        width: "100%",
        maxWidth: "1200px",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 208,
          width: 208,
          borderRadius: "999px",
          backgroundColor: "rgba(220, 232, 224, 0.6)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: 48,
          right: 32,
          height: 176,
          width: 176,
          borderRadius: "999px",
          backgroundColor: "rgba(217, 228, 234, 0.5)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />
      <Stack spacing={3} sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "grid",
            alignItems: "start",
            gap: 2.5,
            gridTemplateColumns: { xs: "1fr", lg: "9fr 3fr" },
          }}
        >
          <Paper sx={{ ...cardSx, p: { xs: 3, sm: 3.5 }, minHeight: { xl: 620 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "#5f7971",
                  }}
                >
                  Latest Issues
                </Typography>
                <Typography sx={{ mt: 1.5, fontSize: "2rem", fontWeight: 600, color: "#273432" }}>
                  Main board focus stays on the newest work
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1.5} sx={{ mt: 3.5, pr: { lg: 1, xl: 2 } }}>
              {recentActivity.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: "24px",
                    borderStyle: "dashed",
                    borderColor: "rgba(93,118,112,0.2)",
                    backgroundColor: "rgba(255,255,255,0.45)",
                    px: 3,
                    py: 5,
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, color: "#273432" }}>
                    No issues yet
                  </Typography>
                  <Typography sx={{ mt: 1, fontSize: "0.95rem", lineHeight: 1.8, color: "#6f817d" }}>
                    Create the first issue to populate this dashboard.
                  </Typography>
                </Paper>
              ) : (
                recentActivity.map((issue) => {
                  const meta = statusMeta[issue.status];

                  return (
                    <Link
                      key={issue.id}
                      href={`/issues/${issue.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Paper
                        sx={{
                          display: "block",
                          borderRadius: "24px",
                          border: "1px solid rgba(255,255,255,0.65)",
                          backgroundColor: "rgba(255,255,255,0.5)",
                          px: 2.5,
                          py: 2.25,
                          transition: "background-color 0.3s ease, border-color 0.3s ease",
                          "&:hover": {
                            borderColor: "rgba(255,255,255,0.85)",
                            backgroundColor: "rgba(255,255,255,0.72)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography noWrap sx={{ fontSize: "1rem", fontWeight: 600, color: "#273432" }}>
                              {issue.title}
                            </Typography>
                            <Typography
                              sx={{
                                mt: 0.75,
                                fontSize: "0.95rem",
                                lineHeight: 1.7,
                                color: "#6f817d",
                              }}
                            >
                              {trimDescription(issue.description) || "No description provided."}
                            </Typography>
                          </Box>

                          <Chip
                            label={meta.label}
                            size="small"
                            sx={{
                              flexShrink: 0,
                              fontWeight: 600,
                              color: meta.accent,
                              border: `1px solid ${meta.accent}`,
                              backgroundColor: meta.background,
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            columnGap: 2,
                            rowGap: 0.5,
                            fontSize: "0.75rem",
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: "#6f817d",
                          }}
                        >
                          <Box component="span">Updated {formatRelativeUpdate(issue.updatedAt)}</Box>
                          <Box component="span">{formatTimestamp(issue.updatedAt)}</Box>
                          <Box component="span">{issue.createdByName ?? "Unknown author"}</Box>
                        </Box>
                      </Paper>
                    </Link>
                  );
                })
              )}
            </Stack>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-end" },
              }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
                <Link href="/issues/new">
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      backgroundColor: "#6d867d",
                      boxShadow: "0 16px 35px -18px rgba(95,121,113,0.55)",
                      "&:hover": {
                        backgroundColor: "#5f7971",
                      },
                    }}
                  >
                    Create New Issue
                  </Button>
                </Link>
                <Link href="/issues">
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      borderColor: "rgba(255,255,255,0.6)",
                      backgroundColor: "rgba(255,255,255,0.55)",
                      color: "#273432",
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.8)",
                        backgroundColor: "rgba(255,255,255,0.7)",
                      },
                    }}
                  >
                    View All Issues
                  </Button>
                </Link>
              </Stack>
            </Box>
          </Paper>

          <Box sx={{ pt: { lg: 2, xl: 3 } }}>
            <Paper sx={{ ...cardSx, borderRadius: "28px", p: { xs: 2.5, sm: 3 } }}>
              <Stack spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "#5f7971",
                  }}
                >
                  Status Breakdown
                </Typography>
                <Typography sx={{ fontSize: { xs: "1.25rem", sm: "1.6rem" }, fontWeight: 600, color: "#273432" }}>
                  Current distribution
                </Typography>
                <Typography sx={{ fontSize: "0.95rem", color: "#6f817d" }}>
                  {totalIssues === 0 ? "Waiting for the first issue" : `${totalIssues} total records`}
                </Typography>
              </Stack>

              <Stack spacing={2} sx={{ mt: 3 }}>
                {statusBreakdown.map((item) => {
                  const meta = statusMeta[item.key];
                  const percentage =
                    totalIssues === 0 ? 0 : Math.round((item.count / totalIssues) * 100);

                  return (
                    <Box key={item.key}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "999px",
                              backgroundColor: meta.accent,
                            }}
                          />
                          <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#273432" }}>
                            {meta.label}
                          </Typography>
                        </Box>

                        <Typography sx={{ fontSize: "0.9rem", color: "#6f817d" }}>
                          {item.count} / {percentage}%
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          height: 10,
                          borderRadius: "999px",
                          backgroundColor: "#edf2ee",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${percentage}%`,
                            borderRadius: "999px",
                            background: `linear-gradient(90deg, ${meta.accent}, ${meta.background})`,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
