"use client";

import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { initialIssueFormData, type FieldErrors as ApiFieldErrors, type IssueFormData } from "@/lib/issues";
import { createIssueSchema } from "@/lib/validationSchemas";
import { useIssuesUiStore } from "@/stores/issues-ui-store";
import IssueCreateDialog from "./IssueCreateDialog";
import IssueDeleteDialog from "./IssueDeleteDialog";
import IssueDetailDialog from "./IssueDetailDialog";
import IssuesListSection from "./IssuesListSection";
import {
  useCreateIssueMutation,
  useDeleteIssueMutation,
  useIssuesQuery,
} from "./hooks";

export default function IssuesClient() {
  const {
    selectedIssueId,
    issueToDeleteId,
    isCreateDialogOpen,
    deleteError,
    openCreateDialog,
    closeCreateDialog,
    openIssueDetails,
    closeIssueDetails,
    openDeleteDialog,
    closeDeleteDialog,
    setDeleteError,
    handleCreateSuccess,
    handleDeleteSuccess,
  } = useIssuesUiStore();
  const [submitError, setSubmitError] = useState("");

  const { data: issues = [], isLoading, error } = useIssuesQuery();
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IssueFormData>({
    defaultValues: initialIssueFormData,
    resolver: zodResolver(createIssueSchema),
  });

  const selectedIssue =
    issues.find((issue) => issue.id === selectedIssueId) ?? null;
  const issueToDelete =
    issues.find((issue) => issue.id === issueToDeleteId) ?? null;

  const createIssueMutation = useCreateIssueMutation({
    onSuccess: (newIssue) => {
      setSubmitError("");
      reset(initialIssueFormData);
      handleCreateSuccess(newIssue.id);
    },
  });

  const deleteIssueMutation = useDeleteIssueMutation({
    onSuccess: handleDeleteSuccess,
    onError: setDeleteError,
  });

  const applyServerFieldErrors = (fieldErrors: ApiFieldErrors) => {
    (Object.entries(fieldErrors) as Array<
      [keyof IssueFormData, string[] | undefined]
    >).forEach(([fieldName, messages]) => {
      if (!messages?.length) {
        return;
      }

      setError(fieldName, {
        type: "server",
        message: messages[0],
      });
    });
  };

  const handleCreateSubmit = async (formData: IssueFormData) => {
    setSubmitError("");
    clearErrors();

    try {
      await createIssueMutation.mutateAsync(formData);
    } catch (mutationError) {
      const errorWithMeta = mutationError as Error & {
        status?: number;
        fieldErrors?: ApiFieldErrors;
      };

      if (errorWithMeta.status === 400 && errorWithMeta.fieldErrors) {
        applyServerFieldErrors(errorWithMeta.fieldErrors);
        return;
      }

      setSubmitError(errorWithMeta.message || "Unable to create issue.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!issueToDelete) {
      return;
    }

    setDeleteError("");
    await deleteIssueMutation.mutateAsync(issueToDelete.id);
  };

  const handleCloseCreateDialog = () => {
    if (createIssueMutation.isPending) {
      return;
    }

    setSubmitError("");
    reset(initialIssueFormData);
    closeCreateDialog();
  };

  const handleCloseDeleteDialog = () => {
    if (deleteIssueMutation.isPending) {
      return;
    }

    closeDeleteDialog();
  };

  const loadError =
    error instanceof Error ? error.message : "Unable to load issues right now.";

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ color: "primary.dark", letterSpacing: "0.24em" }}
              >
                Issue Board
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.5 }}>
                Issues
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Review the issues list, open any row to inspect details, or create a new issue when needed.
              </Typography>
            </Box>

            <Button variant="contained" onClick={openCreateDialog}>
              Create New Issue
            </Button>
          </Stack>
        </Paper>

        <IssuesListSection
          issues={issues}
          isLoading={isLoading}
          loadError={error ? loadError : null}
          deletingIssueId={deleteIssueMutation.isPending ? issueToDeleteId : null}
          onOpenIssue={openIssueDetails}
          onOpenDelete={openDeleteDialog}
        />
      </Stack>

      <IssueCreateDialog
        open={isCreateDialogOpen}
        control={control}
        errors={errors}
        register={register}
        submitError={submitError}
        isSubmitting={createIssueMutation.isPending}
        onClose={handleCloseCreateDialog}
        onSubmit={handleSubmit(handleCreateSubmit)}
      />

      <IssueDetailDialog
        issue={selectedIssue}
        deletingIssueId={deleteIssueMutation.isPending ? issueToDeleteId : null}
        onClose={closeIssueDetails}
        onOpenDelete={openDeleteDialog}
      />

      <IssueDeleteDialog
        issue={issueToDelete}
        deleteError={deleteError}
        isDeleting={deleteIssueMutation.isPending}
        onClose={handleCloseDeleteDialog}
        onConfirm={() => void handleConfirmDelete()}
      />
    </Container>
  );
}
