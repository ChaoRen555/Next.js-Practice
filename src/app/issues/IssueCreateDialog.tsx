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
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import type { IssueFormData } from "@/lib/issues";
import IssueDescriptionEditor from "./IssueDescriptionEditor";

type IssueCreateDialogProps = {
  open: boolean;
  control: Control<IssueFormData>;
  errors: FieldErrors<IssueFormData>;
  register: UseFormRegister<IssueFormData>;
  submitError: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event?: React.BaseSyntheticEvent) => void;
};

export default function IssueCreateDialog({
  open,
  control,
  errors,
  register,
  submitError,
  isSubmitting,
  onClose,
  onSubmit,
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
              fullWidth
              required
              autoFocus
              error={Boolean(errors.title)}
              helperText={errors.title?.message ?? " "}
              {...register("title")}
            />

            <IssueDescriptionEditor
              control={control}
              error={errors.description?.message}
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
