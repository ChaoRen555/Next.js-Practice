"use client";

import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import {
  formatProjectStatus,
  projectStatuses,
  type ProjectFormData,
} from "@/lib/projects";

type ProjectFormProps = {
  errors: FieldErrors<ProjectFormData>;
  register: UseFormRegister<ProjectFormData>;
  submitError: string;
};

export default function ProjectForm({
  errors,
  register,
  submitError,
}: ProjectFormProps) {
  return (
    <Stack spacing={2.5}>
      <Typography color="text.secondary">
        Define the project basics first. Unit projects, division works, and
        sub-item works can be added after the project is created.
      </Typography>

      {submitError ? <Alert severity="error">{submitError}</Alert> : null}

      <TextField
        label="Project Name"
        fullWidth
        required
        autoFocus
        error={Boolean(errors.name)}
        helperText={errors.name?.message ?? " "}
        {...register("name")}
      />

      <TextField
        label="Description"
        fullWidth
        required
        multiline
        minRows={4}
        error={Boolean(errors.description)}
        helperText={errors.description?.message ?? " "}
        {...register("description")}
      />

      <FormControl fullWidth required error={Boolean(errors.status)}>
        <InputLabel id="project-status-label">Status</InputLabel>
        <Select
          labelId="project-status-label"
          id="project-status"
          label="Status"
          defaultValue="PLANNED"
          {...register("status")}
        >
          {projectStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              {formatProjectStatus(status)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Start Date"
          type="date"
          fullWidth
          required
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          error={Boolean(errors.startDate)}
          helperText={errors.startDate?.message ?? " "}
          {...register("startDate")}
        />
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          required
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          error={Boolean(errors.dueDate)}
          helperText={errors.dueDate?.message ?? " "}
          {...register("dueDate")}
        />
      </Stack>
    </Stack>
  );
}
