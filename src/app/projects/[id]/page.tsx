import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { WorkStatus } from "@prisma/client";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatProjectStatus } from "@/lib/projects";
import { buildProjectWorkBreakdownSummary } from "@/lib/work-breakdown";
import WorkBreakdownImportPanel from "../_components/WorkBreakdownImportPanel";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const workStatusLabels: Record<WorkStatus, string> = {
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  PAUSED: "Paused",
  PLANNED: "Planned",
};

const formatDate = (date: Date | null) => {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatQuantity = (quantity: { toString: () => string } | null) => {
  if (!quantity) {
    return "-";
  }

  return quantity.toString();
};

type StatCardProps = {
  label: string;
  value: string | number;
};

const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <Box className="app-surface rounded-lg p-4">
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
      <Typography sx={{ mt: 1 }} variant="h4">
        {value}
      </Typography>
    </Box>
  );
};

type BarListProps = {
  emptyLabel: string;
  items: Array<{
    label: string;
    count: number;
  }>;
  title: string;
};

const BarList = ({ emptyLabel, items, title }: BarListProps) => {
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <Box className="app-surface rounded-lg p-4">
      <Typography variant="h6">{title}</Typography>
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {items.length === 0 ? (
          <Typography color="text.secondary">{emptyLabel}</Typography>
        ) : null}

        {items.map((item) => (
          <Box key={item.label}>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography variant="body2">{item.label}</Typography>
              <Typography color="text.secondary" variant="body2">
                {item.count}
              </Typography>
            </Stack>
            <Box
              sx={{
                backgroundColor: "var(--surface-soft)",
                borderRadius: 999,
                height: 8,
                mt: 0.75,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "primary.main",
                  height: "100%",
                  width: `${Math.round((item.count / maxCount) * 100)}%`,
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const ProjectDetailPage = async ({
  params,
}: ProjectDetailPageProps) => {
  const session = await auth();
  const { id } = await params;
  const projectId = Number.parseInt(id, 10);

  if (!session?.user || !Number.isInteger(projectId) || projectId <= 0) {
    notFound();
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    include: {
      unitProjects: {
        include: {
          divisionWorks: {
            include: {
              subItemWorks: {
                orderBy: [
                  {
                    sortOrder: "asc",
                  },
                  {
                    createdAt: "asc",
                  },
                ],
              },
            },
            orderBy: [
              {
                sortOrder: "asc",
              },
              {
                createdAt: "asc",
              },
            ],
          },
        },
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
    },
  });

  if (!project) {
    notFound();
  }

  const summary = buildProjectWorkBreakdownSummary(project);
  const statusChartItems = Object.entries(summary.statusCounts).map(
    ([status, count]) => ({
      label: workStatusLabels[status as WorkStatus],
      count,
    }),
  );

  return (
    <Box component="section" sx={{ pb: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Box className="app-panel rounded-lg p-5">
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Project Workspace
                </Typography>
                <Typography sx={{ mt: 0.5 }} variant="h4">
                  {project.name}
                </Typography>
              </Box>
              <Chip label={formatProjectStatus(project.status)} />
            </Stack>

            {project.description ? (
              <Typography color="text.secondary">
                {project.description}
              </Typography>
            ) : null}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ color: "text.secondary" }}
            >
              <Typography>Start: {formatDate(project.startDate)}</Typography>
              <Typography>Due: {formatDate(project.dueDate)}</Typography>
            </Stack>
          </Stack>
        </Box>

        <WorkBreakdownImportPanel projectId={project.id} />

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
          }}
        >
          <StatCard label="Unit Projects" value={summary.totalUnitProjects} />
          <StatCard label="Division Works" value={summary.totalDivisionWorks} />
          <StatCard label="Sub-item Works" value={summary.totalSubItemWorks} />
          <StatCard label="Overdue Sub-items" value={summary.overdueSubItemWorks} />
        </Box>

        <Box className="app-panel rounded-lg p-4">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
          >
            <Box>
              <Typography variant="h6">Overall Progress</Typography>
              <Typography color="text.secondary">
                Average progress across unit, division, and sub-item work.
              </Typography>
            </Box>
            <Typography variant="h4">{summary.averageProgress}%</Typography>
          </Stack>
          <LinearProgress
            value={summary.averageProgress}
            variant="determinate"
            sx={{ mt: 2 }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          <BarList
            emptyLabel="No work items yet."
            items={statusChartItems}
            title="Status Breakdown"
          />
          <BarList
            emptyLabel="No trade data yet."
            items={summary.tradeCounts}
            title="Top Trades"
          />
          <BarList
            emptyLabel="No category data yet."
            items={summary.categoryCounts}
            title="Top Categories"
          />
        </Box>

        <Box className="app-panel rounded-lg p-4">
          <Typography variant="h6">Work Breakdown</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Imported unit projects, division works, and sub-item works.
          </Typography>

          <Stack spacing={2.5} sx={{ mt: 3 }}>
            {project.unitProjects.length === 0 ? (
              <Box className="app-surface rounded-lg p-4">
                <Typography sx={{ fontWeight: 700 }}>No work breakdown yet</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Import a CSV or Excel file to populate this project workspace.
                </Typography>
              </Box>
            ) : null}

            {project.unitProjects.map((unitProject) => (
              <Box key={unitProject.id} className="app-surface rounded-lg p-4">
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Box>
                    <Typography variant="h6">{unitProject.name}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {unitProject.divisionWorks.length} division works
                    </Typography>
                  </Box>
                  <Chip label={workStatusLabels[unitProject.status]} size="small" />
                </Stack>

                {unitProject.divisionWorks.map((divisionWork) => (
                  <Box key={divisionWork.id} sx={{ mt: 2.5 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          {divisionWork.name}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {divisionWork.category ?? "Uncategorized"}
                        </Typography>
                      </Box>
                      <Typography color="text.secondary" variant="body2">
                        {divisionWork.progress}% complete
                      </Typography>
                    </Stack>

                    <TableContainer component={Paper} sx={{ mt: 1.5, overflowX: "auto" }}>
                      <Table size="small" sx={{ minWidth: 760 }}>
                        <TableHead sx={{ backgroundColor: "var(--surface-soft)" }}>
                          <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Sub-item Work</TableCell>
                            <TableCell>Trade</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Planned End</TableCell>
                            <TableCell>Progress</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {divisionWork.subItemWorks.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7}>
                                <Typography color="text.secondary">
                                  No sub-item works.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : null}

                          {divisionWork.subItemWorks.map((subItemWork) => (
                            <TableRow key={subItemWork.id}>
                              <TableCell>{subItemWork.code ?? "-"}</TableCell>
                              <TableCell>{subItemWork.name}</TableCell>
                              <TableCell>{subItemWork.trade ?? "-"}</TableCell>
                              <TableCell>
                                {formatQuantity(subItemWork.quantity)} {subItemWork.unit ?? ""}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={workStatusLabels[subItemWork.status]}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {formatDate(subItemWork.plannedEndDate)}
                              </TableCell>
                              <TableCell>{subItemWork.progress}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProjectDetailPage;
