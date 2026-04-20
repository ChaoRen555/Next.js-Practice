"use client";

import { Container, Stack } from "@mui/material";
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
        <IssuesListSection
          issues={issues}
          isLoading={isLoading}
          loadError={error ? loadError : null}
          deletingIssueId={deleteIssueMutation.isPending ? issueToDelete?.id ?? null : null}
          createIssueHref="/issues/new"
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
