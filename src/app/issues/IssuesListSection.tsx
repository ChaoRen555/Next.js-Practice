import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { IssueItem } from "@/lib/issues";

import {
  formatDateTime,
  formatDescriptionPreview,
  formatStatus,
  getStatusChipSx,
} from "./issue-formatters";

type IssuesListSectionProps = {
  issues: IssueItem[];
  isLoading: boolean;
  loadError: string | null;
  deletingIssueId: number | null;
  onOpenIssue: (issueId: number) => void;
  onOpenDelete: (issueId: number) => void;
};

export default function IssuesListSection({
  issues,
  isLoading,
  loadError,
  deletingIssueId,
  onOpenIssue,
  onOpenDelete,
}: IssuesListSectionProps) {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h5">Issues List</Typography>
        <Typography color="text.secondary">
          {issues.length} {issues.length === 1 ? "issue" : "issues"}
        </Typography>
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
          <Typography variant="h6">No issues yet</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Click &quot;Create New Issue&quot; to add the first one.
          </Typography>
        </Paper>
      ) : null}

      {!isLoading && !loadError && issues.length > 0 ? (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 760 }} size="medium">
            <TableHead
              sx={{
                backgroundColor: "rgba(109, 134, 125, 0.06)",
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
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
                  <TableCell sx={{ fontWeight: 600 }}>{issue.title}</TableCell>
                  <TableCell sx={{ color: "text.secondary", maxWidth: 320 }}>
                    {formatDescriptionPreview(issue.description, 90)}
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
      ) : null}
    </Stack>
  );
}
