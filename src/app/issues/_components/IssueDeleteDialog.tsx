import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import type { IssueItem } from "@/lib/issues";

type IssueDeleteDialogProps = {
  issue: IssueItem | null;
  deleteError: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function IssueDeleteDialog({
  issue,
  deleteError,
  isDeleting,
  onClose,
  onConfirm,
}: IssueDeleteDialogProps) {
  return (
    <Dialog open={issue !== null} onClose={onClose} fullWidth maxWidth="xs">
      {issue ? (
        <>
          <DialogTitle>Delete Issue</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography color="text.secondary">
                Are you sure you want to delete issue #{issue.id}?
              </Typography>
              <Typography sx={{ fontWeight: 600 }}>{issue.title}</Typography>
              {deleteError ? <Alert severity="error">{deleteError}</Alert> : null}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
}
