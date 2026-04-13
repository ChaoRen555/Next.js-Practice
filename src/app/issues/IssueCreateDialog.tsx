import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { FieldErrors, IssueFormData } from "@/lib/issues";

type IssueCreateDialogProps = {
  open: boolean;
  formData: IssueFormData;
  fieldErrors: FieldErrors;
  submitError: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

export default function IssueCreateDialog({
  open,
  formData,
  fieldErrors,
  submitError,
  isSubmitting,
  onClose,
  onSubmit,
  onChange,
}: IssueCreateDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>Create New Issue</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Typography color="text.secondary">
              Fill in the title and description, then submit to create the issue.
            </Typography>

            {submitError ? <Alert severity="error">{submitError}</Alert> : null}

            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={onChange}
              fullWidth
              required
              autoFocus
              error={Boolean(fieldErrors.title?.length)}
              helperText={fieldErrors.title?.[0] ?? " "}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={onChange}
              fullWidth
              required
              multiline
              minRows={6}
              error={Boolean(fieldErrors.description?.length)}
              helperText={fieldErrors.description?.[0] ?? " "}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
