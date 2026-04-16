"use client";

import { Alert, Stack, TextField, Typography } from "@mui/material";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import type { IssueFormData } from "@/lib/issues";
import IssueDescriptionEditor from "./IssueDescriptionEditor";

type IssueFormProps = {
  control: Control<IssueFormData>;
  errors: FieldErrors<IssueFormData>;
  register: UseFormRegister<IssueFormData>;
  submitError: string;
};

export default function IssueForm({
  control,
  errors,
  register,
  submitError,
}: IssueFormProps) {
  return (
    <Stack spacing={2.5}>
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
  );
}
