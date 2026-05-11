"use client";

import {
  Alert,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  type SelectChangeEvent,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToaster } from "@/components/toaster-provider";
import {
  issueStatuses,
  type IssueItem,
  type IssueStatus,
} from "@/lib/issues";
import IssueCommentsSection from "../IssueCommentsSection";
import IssueDeleteDialog from "../IssueDeleteDialog";
import IssueDetailContent from "../IssueDetailContent";
import { useDeleteIssueMutation, useUpdateIssueStatusMutation } from "../hooks";
import { formatStatus, getStatusTextSx } from "../issue-formatters";

type IssueDetailClientProps = {
  issue: IssueItem;
};

export default function IssueDetailClient({
  issue,
}: IssueDetailClientProps) {
  const router = useRouter();
  const { showToast } = useToaster();
  const [currentIssue, setCurrentIssue] = useState(issue);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [statusError, setStatusError] = useState("");

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

  const updateIssueStatusMutation = useUpdateIssueStatusMutation({
    onSuccess: (updatedIssue) => {
      setCurrentIssue(updatedIssue);
      setStatusError("");
      showToast({
        message: "Issue status updated successfully.",
        severity: "success",
      });
      router.refresh();
    },
    onError: (message) => {
      setStatusError(message);
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
    await deleteIssueMutation.mutateAsync(currentIssue.id);
  };

  const handleStatusChange = async (
    event: SelectChangeEvent<IssueStatus>,
  ) => {
    const nextStatus = event.target.value as IssueStatus;

    if (nextStatus === currentIssue.status) {
      return;
    }

    setStatusError("");
    await updateIssueStatusMutation.mutateAsync({
      issueId: currentIssue.id,
      status: nextStatus,
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <IssueDetailContent issue={currentIssue} />
        </Paper>

        <IssueCommentsSection issueId={currentIssue.id} />

        {currentIssue.canUpdateStatus ? (
          <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={2}>
              <FormControl size="small" sx={{ maxWidth: 260 }}>
                <InputLabel id="issue-status-update-label">Status</InputLabel>
                <Select<IssueStatus>
                  labelId="issue-status-update-label"
                  id="issue-status-update"
                  value={currentIssue.status}
                  label="Status"
                  disabled={updateIssueStatusMutation.isPending}
                  onChange={handleStatusChange}
                >
                  {issueStatuses.map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                      sx={getStatusTextSx(status)}
                    >
                      {formatStatus(status)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {statusError ? <Alert severity="error">{statusError}</Alert> : null}
            </Stack>
          </Paper>
        ) : null}

        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1.5}>
            {currentIssue.canEdit ? (
              <Button
                component={Link}
                href={`/issues/${currentIssue.id}/edit`}
                variant="outlined"
                disabled={
                  deleteIssueMutation.isPending ||
                  updateIssueStatusMutation.isPending
                }
              >
                Edit
              </Button>
            ) : null}
            {currentIssue.canDelete ? (
              <Button
                color="error"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={
                  deleteIssueMutation.isPending ||
                  updateIssueStatusMutation.isPending
                }
              >
                {deleteIssueMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            ) : null}
          </Stack>
          <Button component={Link} href="/issues" variant="contained">
            Back to Issues
          </Button>
        </Stack>
      </Stack>

      <IssueDeleteDialog
        issue={isDeleteDialogOpen ? currentIssue : null}
        deleteError={deleteError}
        isDeleting={deleteIssueMutation.isPending}
        onClose={handleCloseDeleteDialog}
        onConfirm={() => void handleConfirmDelete()}
      />
    </Container>
  );
}
