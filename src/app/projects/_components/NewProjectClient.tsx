"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useToaster } from "@/components/toaster-provider";
import { initialProjectFormData } from "@/lib/projects";
import { getNotification } from "@/lib/notifications";
import ProjectForm from "./ProjectForm";
import { useCreateProjectMutation, useProjectForm } from "../_hooks/hooks";

export default function NewProjectClient() {
  const router = useRouter();
  const { showToast } = useToaster();
  const {
    register,
    errors,
    submitError,
    buildSubmitHandler,
  } = useProjectForm({
    defaultValues: initialProjectFormData,
  });

  const createProjectMutation = useCreateProjectMutation({
    onSuccess: (newProject) => {
      showToast(getNotification("projects.create.success"));
      router.push(`/projects/${newProject.id}`);
      router.refresh();
    },
  });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={1}>
            <Typography
              variant="overline"
              sx={{ color: "primary.dark", letterSpacing: "0.24em" }}
            >
              Construction Management
            </Typography>
            <Typography variant="h4">Create New Project</Typography>
            <Typography color="text.secondary">
              Start with a project shell. Detailed construction levels can be
              created after the project workspace is available.
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            component="form"
            onSubmit={buildSubmitHandler((formData) => {
              return createProjectMutation.mutateAsync(formData);
            })}
          >
            <Stack spacing={3}>
              <ProjectForm
                errors={errors}
                register={register}
                submitError={submitError}
              />

              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
                <Button
                  component={Link}
                  href="/"
                  disabled={createProjectMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createProjectMutation.isPending}
                >
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
