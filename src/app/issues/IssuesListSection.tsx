import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  type SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import {
  issueStatuses,
  type IssueItem,
  type IssueOrderBy,
  type IssueOrderDirection,
  type IssueStatusFilter,
} from "@/lib/issues";

import {
  formatDateTime,
  formatStatus,
  getStatusChipSx,
  getStatusTextSx,
} from "./issue-formatters";

type IssuesListSectionProps = {
  issues: IssueItem[];
  statusFilter: IssueStatusFilter;
  orderBy: IssueOrderBy;
  order: IssueOrderDirection;
  page: number;
  pageCount: number;
  totalIssues: number;
  isLoading: boolean;
  loadError: string | null;
  deletingIssueId: number | null;
  createIssueHref: string;
  onStatusFilterChange: (statusFilter: IssueStatusFilter) => void;
  onOrderChange: (orderBy: IssueOrderBy) => void;
  onPageChange: (page: number) => void;
  onOpenIssue: (issueId: number) => void;
  onOpenDelete: (issueId: number) => void;
};

const sortableColumns: Array<{
  id: IssueOrderBy;
  label: string;
}> = [
  { id: "title", label: "Title" },
  { id: "createdByName", label: "Created By" },
  { id: "status", label: "Status" },
  { id: "createdAt", label: "Created At" },
];

export default function IssuesListSection({
  issues,
  statusFilter,
  orderBy,
  order,
  page,
  pageCount,
  totalIssues,
  isLoading,
  loadError,
  deletingIssueId,
  createIssueHref,
  onStatusFilterChange,
  onOrderChange,
  onPageChange,
  onOpenIssue,
  onOpenDelete,
}: IssuesListSectionProps) {
  const handleStatusFilterChange = (
    event: SelectChangeEvent<IssueStatusFilter>,
  ) => {
    onStatusFilterChange(event.target.value as IssueStatusFilter);
  };

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button href={createIssueHref} variant="contained">
          Create New Issue
        </Button>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: { xs: "stretch", sm: "center" } }}
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="issue-status-filter-label">Status</InputLabel>
            <Select<IssueStatusFilter>
              labelId="issue-status-filter-label"
              id="issue-status-filter"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="ALL">All statuses</MenuItem>
              {issueStatuses.map((status) => (
                <MenuItem key={status} value={status} sx={getStatusTextSx(status)}>
                  {formatStatus(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography color="text.secondary">
            {totalIssues} {totalIssues === 1 ? "issue" : "issues"}
          </Typography>
        </Stack>
      </Box>

      {loadError ? <Alert severity="error">{loadError}</Alert> : null}

      {isLoading ? (
        <Paper
          sx={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack spacing={1.5} sx={{ alignItems: "center" }}>
            <CircularProgress color="primary" />
            <Typography color="text.secondary">Loading issues...</Typography>
          </Stack>
        </Paper>
      ) : null}

      {!isLoading && !loadError && issues.length === 0 ? (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6">
            {statusFilter === "ALL" ? "No issues yet" : "No matching issues"}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {statusFilter === "ALL"
              ? "Click \"Create New Issue\" to add the first one."
              : `No issues match the ${formatStatus(statusFilter)} status.`}
          </Typography>
        </Paper>
      ) : null}

      {!isLoading && !loadError && issues.length > 0 ? (
        <Stack spacing={2}>
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 640 }} size="medium">
              <TableHead
                sx={{
                  backgroundColor: "rgba(109, 134, 125, 0.06)",
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: 64 }}>ID</TableCell>
                  {sortableColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        fontWeight: 700,
                        ...(column.id === "title"
                          ? {
                              maxWidth: 260,
                              width: "34%",
                            }
                          : {}),
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => onOrderChange(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 700, width: 140 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issues.map((issue, index) => (
                  <TableRow
                    key={issue.id}
                    hover
                    onClick={() => onOpenIssue(issue.id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(109, 134, 125, 0.04)",
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        maxWidth: 260,
                        overflowWrap: "anywhere",
                        whiteSpace: "normal",
                        width: "34%",
                      }}
                    >
                      {issue.title}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {issue.createdByName ?? "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatStatus(issue.status)}
                        size="small"
                        sx={getStatusChipSx(issue.status)}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {formatDateTime(issue.createdAt)}
                    </TableCell>
                    <TableCell
                      onClick={(event) => event.stopPropagation()}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        disabled={deletingIssueId !== null}
                        onClick={() => onOpenDelete(issue.id)}
                      >
                        {deletingIssueId === issue.id ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {pageCount > 1 ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={pageCount}
                page={page}
                color="primary"
                onChange={(_, nextPage) => onPageChange(nextPage)}
              />
            </Box>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}
