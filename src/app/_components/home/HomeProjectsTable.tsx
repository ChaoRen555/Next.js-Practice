"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import AppTable, { type AppTableColumn } from "@/components/ui/AppTable";
import { formatProjectStatus, type ProjectItem } from "@/lib/projects";

type HomeProjectsTableProps = {
  projects: Pick<ProjectItem, "description" | "id" | "name" | "status">[];
};

const HomeProjectsTable = ({ projects }: HomeProjectsTableProps) => {
  const columns: Array<AppTableColumn<HomeProjectsTableProps["projects"][number]>> = [
    {
      id: "name",
      label: "Name",
      renderCell: (project) => (
        <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
          {project.name}
        </Typography>
      ),
    },
    {
      id: "description",
      label: "Description",
      renderCell: (project) => (
        <Typography
          sx={{
            color: "text.secondary",
            maxWidth: 520,
            overflowWrap: "anywhere",
          }}
        >
          {project.description}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      sx: {
        width: 160,
      },
      renderCell: (project) => (
        <Chip
          label={formatProjectStatus(project.status)}
          size="small"
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4">Projects</Typography>
          <Typography color="text.secondary">
            Select a project workspace or create a new one.
          </Typography>
        </Stack>

        <Button component={Link} href="/projects/new" variant="contained">
          Create New Project
        </Button>
      </Box>

      <AppTable
        columns={columns}
        rows={projects}
        getRowKey={(project) => project.id}
        getRowHref={(project) => `/projects/${project.id}`}
        emptyTitle="No projects yet"
        emptyDescription="Create a project to start building its construction work breakdown."
      />
    </Stack>
  );
};

export default HomeProjectsTable;
