import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type { IssueItem } from "@/lib/issues";

import { formatDateTime, formatStatus } from "./issue-formatters";

type IssueDetailDialogProps = {
  issue: IssueItem | null;
  deletingIssueId: number | null;
  onClose: () => void;
  onOpenDelete: (issueId: number) => void;
};

export default function IssueDetailDialog({
  issue,
  deletingIssueId,
  onClose,
  onOpenDelete,
}: IssueDetailDialogProps) {
  return (
    <Dialog open={issue !== null} onClose={onClose} fullWidth maxWidth="md">
      {issue ? (
        <>
          <DialogTitle sx={{ pb: 1.5 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="overline"
                sx={{ color: "primary.dark", letterSpacing: "0.18em" }}
              >
                Issue #{issue.id}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h5">{issue.title}</Typography>
                <Chip
                  label={formatStatus(issue.status)}
                  sx={{
                    backgroundColor: "rgba(109, 134, 125, 0.12)",
                    color: "primary.dark",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography sx={{ mt: 1, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                  {issue.description}
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Paper sx={{ p: 2.5, borderRadius: 5, flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    {formatDateTime(issue.createdAt)}
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2.5, borderRadius: 5, flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Updated At
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    {formatDateTime(issue.updatedAt)}
                  </Typography>
                </Paper>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              color="error"
              onClick={() => onOpenDelete(issue.id)}
              disabled={deletingIssueId !== null}
            >
              {deletingIssueId === issue.id ? "Deleting..." : "Delete"}
            </Button>
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
}
