"use client";

import { Button, Container, Paper, Stack } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToaster } from "@/components/toaster-provider";
import type { IssueItem } from "@/lib/issues";
import IssueDeleteDialog from "../IssueDeleteDialog";
import IssueDetailContent from "../IssueDetailContent";
import { useDeleteIssueMutation } from "../hooks";

type IssueDetailClientProps = {
  issue: IssueItem;
};

export default function IssueDetailClient({
  issue,
}: IssueDetailClientProps) {
  const router = useRouter();
  const { showToast } = useToaster();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const deleteIssueMutation = useDeleteIssueMutation({
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setDeleteError("");
      showToast({
        message: "Issue deleted successfully.",
        severity: "success",
      });
      router.push("/issues");
      router.refresh();
    },
    onError: (message) => {
      setDeleteError(message);
      showToast({
        message,
        severity: "error",
      });
    },
  });

  const handleCloseDeleteDialog = () => {
    if (deleteIssueMutation.isPending) {
      return;
    }

    setDeleteError("");
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    setDeleteError("");
    await deleteIssueMutation.mutateAsync(issue.id);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <IssueDetailContent issue={issue} />
        </Paper>

        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1.5}>
            <Button
              component={Link}
              href={`/issues/${issue.id}/edit`}
              variant="outlined"
              disabled={deleteIssueMutation.isPending}
            >
              Edit
            </Button>
            <Button
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteIssueMutation.isPending}
            >
              {deleteIssueMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </Stack>
          <Button component={Link} href="/issues" variant="contained">
            Back to Issues
          </Button>
        </Stack>
      </Stack>

      <IssueDeleteDialog
        issue={isDeleteDialogOpen ? issue : null}
        deleteError={deleteError}
        isDeleting={deleteIssueMutation.isPending}
        onClose={handleCloseDeleteDialog}
        onConfirm={() => void handleConfirmDelete()}
      />
    </Container>
  );
}
