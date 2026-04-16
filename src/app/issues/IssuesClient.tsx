"use client";

import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { IssueItem } from "@/lib/issues";
import IssueDeleteDialog from "./IssueDeleteDialog";
import IssuesListSection from "./IssuesListSection";
import { useDeleteIssueMutation, useIssuesQuery } from "./hooks";

export default function IssuesClient() {
  const router = useRouter();
  const [issueToDelete, setIssueToDelete] = useState<IssueItem | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const { data: issues = [], isLoading, error } = useIssuesQuery();

  const deleteIssueMutation = useDeleteIssueMutation({
    onSuccess: () => {
      setIssueToDelete(null);
      setDeleteError("");
    },
    onError: setDeleteError,
  });

  const handleConfirmDelete = async () => {
    if (!issueToDelete) {
      return;
    }

    setDeleteError("");
    await deleteIssueMutation.mutateAsync(issueToDelete.id);
  };

  const handleCloseDeleteDialog = () => {
    if (deleteIssueMutation.isPending) {
      return;
    }

    setDeleteError("");
    setIssueToDelete(null);
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

            <Button component={Link} href="/issues/new" variant="contained">
              Create New Issue
            </Button>
          </Stack>
        </Paper>

        <IssuesListSection
          issues={issues}
          isLoading={isLoading}
          loadError={error ? loadError : null}
          deletingIssueId={deleteIssueMutation.isPending ? issueToDelete?.id ?? null : null}
          onOpenIssue={(issueId) => {
            router.push(`/issues/${issueId}`);
          }}
          onOpenDelete={(issueId) => {
            const matchedIssue = issues.find((issue) => issue.id === issueId) ?? null;
            setDeleteError("");
            setIssueToDelete(matchedIssue);
          }}
        />
      </Stack>

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
