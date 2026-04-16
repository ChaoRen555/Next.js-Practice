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

import {
  type FieldErrors as ApiFieldErrors,
  type IssueFormData,
  type IssueItem,
} from "@/lib/issues";
import { createIssueSchema } from "@/lib/validationSchemas";
import { useUpdateIssueMutation } from "../../hooks";
import IssueForm from "../../IssueForm";

type EditIssueClientProps = {
  issue: IssueItem;
};

export default function EditIssueClient({
  issue,
}: EditIssueClientProps) {
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
    defaultValues: {
      title: issue.title,
      description: issue.description,
    },
    resolver: zodResolver(createIssueSchema),
  });

  const updateIssueMutation = useUpdateIssueMutation({
    onSuccess: (updatedIssue) => {
      router.push(`/issues/${updatedIssue.id}`);
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

  const handleEditSubmit = async (formData: IssueFormData) => {
    setSubmitError("");
    clearErrors();

    try {
      await updateIssueMutation.mutateAsync({
        issueId: issue.id,
        formData,
      });
    } catch (mutationError) {
      const errorWithMeta = mutationError as Error & {
        status?: number;
        fieldErrors?: ApiFieldErrors;
      };

      if (errorWithMeta.status === 400 && errorWithMeta.fieldErrors) {
        applyServerFieldErrors(errorWithMeta.fieldErrors);
        return;
      }

      setSubmitError(errorWithMeta.message || "Unable to update issue.");
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
            <Typography variant="h4">Edit Issue #{issue.id}</Typography>
            <Typography color="text.secondary">
              Update the issue title and description, then save your changes.
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit(handleEditSubmit)}>
            <Stack spacing={3}>
              <IssueForm
                control={control}
                errors={errors}
                register={register}
                submitError={submitError}
                descriptionText="Adjust the current issue details, then save the updated version."
              />

              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
                <Button
                  component={Link}
                  href={`/issues/${issue.id}`}
                  disabled={updateIssueMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={updateIssueMutation.isPending}
                >
                  {updateIssueMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
