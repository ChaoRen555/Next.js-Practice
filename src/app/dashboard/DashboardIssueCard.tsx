import { Box, Chip, Paper, Typography } from "@mui/material";
import Link from "next/link";

import type { IssueItem } from "@/lib/issues";

import {
  formatRelativeUpdate,
  formatTimestamp,
  issueCardSx,
  statusMeta,
  trimDescription,
} from "./dashboard-home-helpers";

type DashboardIssueCardProps = {
  issue: IssueItem;
};

export default function DashboardIssueCard({
  issue,
}: DashboardIssueCardProps) {
  const meta = statusMeta[issue.status];

  return (
    <Link href={`/issues/${issue.id}`} style={{ textDecoration: "none" }}>
      <Paper sx={issueCardSx}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{ fontSize: "1rem", fontWeight: 600, color: "#273432" }}
            >
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
          <Box component="span">
            Updated {formatRelativeUpdate(issue.updatedAt)}
          </Box>
          <Box component="span">{formatTimestamp(issue.updatedAt)}</Box>
          <Box component="span">{issue.createdByName ?? "Unknown author"}</Box>
        </Box>
      </Paper>
    </Link>
  );
}
