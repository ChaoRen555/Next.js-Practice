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
import { initialIssueFormData } from "@/lib/issues";
import { useCreateIssueMutation, useIssueForm } from "../hooks";
import IssueForm from "../IssueForm";

export default function NewIssueClient() {
  const router = useRouter();
  const { showToast } = useToaster();
  const {
    control,
    register,
    errors,
    submitError,
    buildSubmitHandler,
  } = useIssueForm({
    defaultValues: initialIssueFormData,
  });

  const createIssueMutation = useCreateIssueMutation({
    onSuccess: () => {
      showToast({
        message: "Issue created successfully.",
        severity: "success",
      });
      router.push("/issues");
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
              Issue Board
            </Typography>
            <Typography variant="h4">Create New Issue</Typography>
            <Typography color="text.secondary">
              Add a new issue with enough detail for the team to review and act on it.
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            component="form"
            onSubmit={buildSubmitHandler((formData) => {
              return createIssueMutation.mutateAsync(formData);
            })}
          >
            <Stack spacing={3}>
              <IssueForm
                control={control}
                errors={errors}
                register={register}
                submitError={submitError}
              />

              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
                <Button
                  component={Link}
                  href="/issues"
                  disabled={createIssueMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createIssueMutation.isPending}
                >
                  {createIssueMutation.isPending ? "Submitting..." : "Submit Issue"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
