"use client";

import { Container, Stack } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useToaster } from "@/components/toaster-provider";
import {
  isIssueStatus,
  type IssueItem,
  type IssueStatus,
  type IssueStatusFilter,
} from "@/lib/issues";
import IssueDeleteDialog from "./IssueDeleteDialog";
import IssuesListSection from "./IssuesListSection";
import { useDeleteIssueMutation, useIssuesQuery } from "./hooks";

export default function IssuesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToaster();
  const [issueToDelete, setIssueToDelete] = useState<IssueItem | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const statusParam = searchParams.get("status");
  const selectedStatus: IssueStatus | null =
    statusParam && isIssueStatus(statusParam) ? statusParam : null;
  const statusFilter: IssueStatusFilter = selectedStatus ?? "ALL";

  const { data: issues = [], isLoading, error } = useIssuesQuery(selectedStatus);

  const deleteIssueMutation = useDeleteIssueMutation({
    onSuccess: () => {
      setIssueToDelete(null);
      setDeleteError("");
      showToast({
        message: "Issue deleted successfully.",
        severity: "success",
      });
    },
    onError: (message) => {
      setDeleteError(message);
      showToast({
        message,
        severity: "error",
      });
    },
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

  const handleStatusFilterChange = (nextStatusFilter: IssueStatusFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (nextStatusFilter === "ALL") {
      nextSearchParams.delete("status");
    } else {
      nextSearchParams.set("status", nextStatusFilter);
    }

    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <IssuesListSection
          issues={issues}
          statusFilter={statusFilter}
          isLoading={isLoading}
          loadError={error ? loadError : null}
          deletingIssueId={deleteIssueMutation.isPending ? issueToDelete?.id ?? null : null}
          createIssueHref="/issues/new"
          onStatusFilterChange={handleStatusFilterChange}
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
