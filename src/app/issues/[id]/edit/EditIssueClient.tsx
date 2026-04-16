"use client";

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

import {
  type IssueItem,
} from "@/lib/issues";
import { useIssueForm, useUpdateIssueMutation } from "../../hooks";
import IssueForm from "../../IssueForm";

type EditIssueClientProps = {
  issue: IssueItem;
};

export default function EditIssueClient({
  issue,
}: EditIssueClientProps) {
  const router = useRouter();
  const {
    control,
    register,
    errors,
    submitError,
    buildSubmitHandler,
  } = useIssueForm({
    defaultValues: {
      title: issue.title,
      description: issue.description,
    },
  });

  const updateIssueMutation = useUpdateIssueMutation({
    onSuccess: (updatedIssue) => {
      router.push(`/issues/${updatedIssue.id}`);
      router.refresh();
    },
  });

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
          <Box
            component="form"
            onSubmit={buildSubmitHandler((formData) => {
              return updateIssueMutation.mutateAsync({
                issueId: issue.id,
                formData,
              });
            })}
          >
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
