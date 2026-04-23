import { Box, Paper, Stack, Typography } from "@mui/material";

import {
  cardSx,
  sectionEyebrowSx,
  sectionTitleSx,
  statusMeta,
  type StatusKey,
} from "./dashboard-home-helpers";

type DashboardStatusBreakdownProps = {
  items: Array<{
    key: StatusKey;
    count: number;
  }>;
  totalIssues: number;
};

export default function DashboardStatusBreakdown({
  items,
  totalIssues,
}: DashboardStatusBreakdownProps) {
  return (
    <Paper sx={{ ...cardSx, borderRadius: "28px", p: { xs: 2.5, sm: 3 } }}>
      <Stack spacing={0.75}>
        <Typography sx={sectionEyebrowSx}>Status Breakdown</Typography>
        <Typography
          sx={{ ...sectionTitleSx, fontSize: { xs: "1.25rem", sm: "1.6rem" } }}
        >
          Current distribution
        </Typography>
        <Typography sx={{ fontSize: "0.95rem", color: "#6f817d" }}>
          {totalIssues === 0
            ? "Waiting for the first issue"
            : `${totalIssues} total records`}
        </Typography>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {items.map((item) => {
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
                  <Typography
                    sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#273432" }}
                  >
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
  );
}
