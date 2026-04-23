import { Box, Stack } from "@mui/material";

import DashboardLatestIssuesSection from "./DashboardLatestIssuesSection";
import DashboardStatusBreakdown from "./DashboardStatusBreakdown";

import { prisma } from "@/lib/prisma";
import { serializeIssue } from "@/lib/issues";

export default async function HomePage() {
  const issues = await prisma.issue.findMany({
    include: {
      creator: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const serializedIssues = issues.map(serializeIssue);
  const totalIssues = serializedIssues.length;
  const recentActivity = serializedIssues.slice(0, 5);

  const statusBreakdown = [
    {
      key: "OPEN" as const,
      count: serializedIssues.filter((issue) => issue.status === "OPEN").length,
    },
    {
      key: "IN_PROGRESS" as const,
      count: serializedIssues.filter((issue) => issue.status === "IN_PROGRESS").length,
    },
    {
      key: "CLOSED" as const,
      count: serializedIssues.filter((issue) => issue.status === "CLOSED").length,
    },
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
          <DashboardLatestIssuesSection issues={recentActivity} />
          <Box sx={{ pt: { lg: 2, xl: 3 } }}>
            <DashboardStatusBreakdown
              items={statusBreakdown}
              totalIssues={totalIssues}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
