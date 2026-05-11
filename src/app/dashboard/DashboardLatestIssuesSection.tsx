import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

import type { IssueItem } from "@/lib/issues";

import DashboardIssueCard from "./DashboardIssueCard";
import {
  cardSx,
  sectionEyebrowSx,
  sectionTitleSx,
} from "./dashboard-home-helpers";

type DashboardLatestIssuesSectionProps = {
  issues: IssueItem[];
};

export default function DashboardLatestIssuesSection({
  issues,
}: DashboardLatestIssuesSectionProps) {
  return (
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
          <Typography sx={sectionEyebrowSx}>Latest Issues</Typography>
          <Typography
            sx={{ ...sectionTitleSx, mt: 1.5, fontSize: "2rem" }}
          >
            Main board focus stays on the newest work
          </Typography>
        </Box>
      </Box>

      <Stack spacing={1.5} sx={{ mt: 3.5, pr: { lg: 1, xl: 2 } }}>
        {issues.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              borderRadius: "24px",
              borderStyle: "dashed",
              borderColor: "var(--line-strong)",
              backgroundColor: "var(--surface-soft)",
              px: 3,
              py: 5,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text)" }}
            >
              No issues yet
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: "0.95rem",
                lineHeight: 1.8,
                color: "var(--muted)",
              }}
            >
              Create the first issue to populate this dashboard.
            </Typography>
          </Paper>
        ) : (
          issues.map((issue) => (
            <DashboardIssueCard key={issue.id} issue={issue} />
          ))
        )}
      </Stack>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: { xs: "stretch", sm: "flex-end" },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Link href="/issues/new">
            <Button
              fullWidth
              variant="contained"
              sx={{
                px: 2.5,
                py: 1.5,
                backgroundColor: "var(--accent-strong)",
                boxShadow: "0 16px 35px -18px var(--nav-shadow)",
                "&:hover": {
                  backgroundColor: "var(--accent)",
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
                borderColor: "var(--line)",
                backgroundColor: "var(--surface-soft)",
                color: "var(--text)",
                "&:hover": {
                  borderColor: "var(--accent)",
                  backgroundColor: "var(--surface-hover)",
                },
              }}
            >
              View All Issues
            </Button>
          </Link>
        </Stack>
      </Box>
    </Paper>
  );
}
