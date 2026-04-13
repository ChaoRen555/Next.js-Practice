"use client";

import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

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
    formData,
    fieldErrors,
    submitError,
    deleteError,
    openCreateDialog,
    closeCreateDialog,
    setFormValue,
    setFieldErrors,
    setSubmitError,
    resetFormState,
    openIssueDetails,
    closeIssueDetails,
    openDeleteDialog,
    closeDeleteDialog,
    setDeleteError,
    handleCreateSuccess,
    handleDeleteSuccess,
  } = useIssuesUiStore();

  const { data: issues = [], isLoading, error } = useIssuesQuery();

  const selectedIssue =
    issues.find((issue) => issue.id === selectedIssueId) ?? null;
  const issueToDelete =
    issues.find((issue) => issue.id === issueToDeleteId) ?? null;

  const createIssueMutation = useCreateIssueMutation({
    onSuccess: (newIssue) => {
      handleCreateSuccess(newIssue.id);
    },
    onValidationError: setFieldErrors,
    onError: setSubmitError,
  });

  const deleteIssueMutation = useDeleteIssueMutation({
    onSuccess: handleDeleteSuccess,
    onError: setDeleteError,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValue(name as keyof typeof formData, value);
  };

  const handleDescriptionChange = (value: string) => {
    setFormValue("description", value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setFieldErrors({});

    await createIssueMutation.mutateAsync(formData);
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

    closeCreateDialog();
    resetFormState();
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
        formData={formData}
        fieldErrors={fieldErrors}
        submitError={submitError}
        isSubmitting={createIssueMutation.isPending}
        onClose={handleCloseCreateDialog}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onDescriptionChange={handleDescriptionChange}
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
