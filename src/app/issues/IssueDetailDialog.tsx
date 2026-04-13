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
import ReactMarkdown from "react-markdown";

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
                <Box
                  sx={{
                    mt: 1,
                    color: "text.primary",
                    lineHeight: 1.8,
                    "& > :first-of-type": {
                      mt: 0,
                    },
                    "& > :last-child": {
                      mb: 0,
                    },
                    "& p": {
                      my: 1.25,
                    },
                    "& ul, & ol": {
                      pl: 3,
                      my: 1.5,
                    },
                    "& li + li": {
                      mt: 0.5,
                    },
                    "& blockquote": {
                      m: 0,
                      px: 2,
                      py: 1,
                      borderLeft: "4px solid rgba(109, 134, 125, 0.35)",
                      backgroundColor: "rgba(255, 255, 255, 0.52)",
                      color: "text.secondary",
                      borderRadius: 2,
                    },
                    "& code": {
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      backgroundColor: "rgba(109, 134, 125, 0.12)",
                      fontFamily: "\"SFMono-Regular\", Consolas, monospace",
                      fontSize: "0.92em",
                    },
                    "& pre": {
                      overflowX: "auto",
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "rgba(39, 52, 50, 0.92)",
                      color: "#f4f7f5",
                    },
                    "& pre code": {
                      p: 0,
                      backgroundColor: "transparent",
                      color: "inherit",
                    },
                    "& a": {
                      color: "primary.dark",
                      textDecoration: "underline",
                    },
                    "& h1, & h2, & h3, & h4, & h5, & h6": {
                      mt: 2.5,
                      mb: 1,
                      lineHeight: 1.25,
                    },
                  }}
                >
                  <ReactMarkdown>{issue.description}</ReactMarkdown>
                </Box>
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
