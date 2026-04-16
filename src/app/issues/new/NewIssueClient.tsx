"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { initialIssueFormData, type FieldErrors as ApiFieldErrors, type IssueFormData } from "@/lib/issues";
import { createIssueSchema } from "@/lib/validationSchemas";
import { useCreateIssueMutation } from "../hooks";
import IssueForm from "../IssueForm";

export default function NewIssueClient() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IssueFormData>({
    defaultValues: initialIssueFormData,
    resolver: zodResolver(createIssueSchema),
  });

  const createIssueMutation = useCreateIssueMutation({
    onSuccess: () => {
      router.push("/issues");
      router.refresh();
    },
  });

  const applyServerFieldErrors = (fieldErrors: ApiFieldErrors) => {
    (Object.entries(fieldErrors) as Array<
      [keyof IssueFormData, string[] | undefined]
    >).forEach(([fieldName, messages]) => {
      if (!messages?.length) {
        return;
      }

      setError(fieldName, {
        type: "server",
        message: messages[0],
      });
    });
  };

  const handleCreateSubmit = async (formData: IssueFormData) => {
    setSubmitError("");
    clearErrors();

    try {
      await createIssueMutation.mutateAsync(formData);
    } catch (mutationError) {
      const errorWithMeta = mutationError as Error & {
        status?: number;
        fieldErrors?: ApiFieldErrors;
      };

      if (errorWithMeta.status === 400 && errorWithMeta.fieldErrors) {
        applyServerFieldErrors(errorWithMeta.fieldErrors);
        return;
      }

      setSubmitError(errorWithMeta.message || "Unable to create issue.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={1}>
            <Typography
              variant="overline"
              sx={{ color: "primary.dark", letterSpacing: "0.24em" }}
            >
              Issue Board
            </Typography>
            <Typography variant="h4">Create New Issue</Typography>
            <Typography color="text.secondary">
              Add a new issue with enough detail for the team to review and act on it.
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit(handleCreateSubmit)}>
            <Stack spacing={3}>
              <IssueForm
                control={control}
                errors={errors}
                register={register}
                submitError={submitError}
              />

              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
                <Button
                  component={Link}
                  href="/issues"
                  disabled={createIssueMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createIssueMutation.isPending}
                >
                  {createIssueMutation.isPending ? "Submitting..." : "Submit Issue"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
