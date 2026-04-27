"use client";

import { Container, Stack } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useToaster } from "@/components/toaster-provider";
import {
  isIssueOrderBy,
  isIssueOrderDirection,
  isIssueStatus,
  type IssueItem,
  type IssueOrderBy,
  type IssueOrderDirection,
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
  const orderByParam = searchParams.get("orderBy");
  const orderParam = searchParams.get("order");
  const orderBy: IssueOrderBy =
    orderByParam && isIssueOrderBy(orderByParam) ? orderByParam : "createdAt";
  const order: IssueOrderDirection =
    orderParam && isIssueOrderDirection(orderParam) ? orderParam : "desc";
  const pageParam = searchParams.get("page");
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { data, isLoading, error } = useIssuesQuery({
    status: selectedStatus,
    orderBy,
    order,
    page,
  });
  const issues = data?.issues ?? [];
  const totalIssues = data?.total ?? 0;
  const currentPage = data?.page ?? page;
  const pageCount = data?.pageCount ?? 1;

  useEffect(() => {
    if (!data || currentPage === page) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (currentPage === 1) {
      nextSearchParams.delete("page");
    } else {
      nextSearchParams.set("page", currentPage.toString());
    }

    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, [currentPage, data, page, pathname, router, searchParams]);

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

    nextSearchParams.delete("page");

    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleOrderChange = (nextOrderBy: IssueOrderBy) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    const nextOrder: IssueOrderDirection =
      orderBy === nextOrderBy && order === "asc" ? "desc" : "asc";

    nextSearchParams.set("orderBy", nextOrderBy);
    nextSearchParams.set("order", nextOrder);
    nextSearchParams.delete("page");

    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handlePageChange = (nextPage: number) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (nextPage === 1) {
      nextSearchParams.delete("page");
    } else {
      nextSearchParams.set("page", nextPage.toString());
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
          orderBy={orderBy}
          order={order}
          page={currentPage}
          pageCount={pageCount}
          totalIssues={totalIssues}
          isLoading={isLoading}
          loadError={error ? loadError : null}
          deletingIssueId={deleteIssueMutation.isPending ? issueToDelete?.id ?? null : null}
          createIssueHref="/issues/new"
          onStatusFilterChange={handleStatusFilterChange}
          onOrderChange={handleOrderChange}
          onPageChange={handlePageChange}
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
