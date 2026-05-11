"use client";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useToaster } from "@/components/toaster-provider";
import type { IssueComment } from "@/lib/issues";
import { getNotification, getNotificationText } from "@/lib/notifications";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useIssueCommentsQuery,
} from "./hooks";
import { formatDateTime } from "./issue-formatters";

type IssueCommentsSectionProps = {
  issueId: number;
};

const getAuthorDisplayName = (comment: IssueComment) => {
  return comment.authorName?.trim() || comment.authorEmail || "Unknown user";
};

const getAvatarFallback = (comment: IssueComment) => {
  return getAuthorDisplayName(comment).charAt(0).toUpperCase();
};

const markdownSx = {
  minWidth: 0,
  color: "text.primary",
  lineHeight: 1.75,
  "& > :first-of-type": {
    mt: 0,
  },
  "& > :last-child": {
    mb: 0,
  },
  "& p, & li, & blockquote, & td, & th, & a": {
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  "& p": {
    my: 1,
  },
  "& ul, & ol": {
    pl: 3,
    my: 1.25,
  },
  "& ul": {
    listStyleType: "disc",
  },
  "& ol": {
    listStyleType: "decimal",
  },
  "& ul.contains-task-list": {
    listStyle: "none",
    pl: 0.5,
  },
  "& li": {
    display: "list-item",
  },
  "& li + li": {
    mt: 0.5,
  },
  "& li > input[type='checkbox']": {
    mr: 1,
  },
  "& blockquote": {
    m: 0,
    px: 2,
    py: 1,
    borderLeft: "4px solid var(--markdown-quote-border)",
    backgroundColor: "var(--surface-soft)",
    color: "text.secondary",
    borderRadius: 2,
  },
  "& code": {
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    px: 0.75,
    py: 0.25,
    borderRadius: 1,
    backgroundColor: "var(--markdown-code-bg)",
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    fontSize: "0.92em",
  },
  "& pre": {
    maxWidth: "100%",
    overflowX: "auto",
    p: 2,
    borderRadius: 3,
    backgroundColor: "var(--markdown-pre-bg)",
    color: "var(--markdown-pre-text)",
  },
  "& pre code": {
    p: 0,
    backgroundColor: "transparent",
    color: "inherit",
    overflowWrap: "normal",
    wordBreak: "normal",
    whiteSpace: "pre",
  },
  "& a": {
    color: "primary.dark",
    textDecoration: "underline",
  },
};

export default function IssueCommentsSection({
  issueId,
}: IssueCommentsSectionProps) {
  const { showToast } = useToaster();
  const [commentBody, setCommentBody] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<IssueComment | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState("");

  const commentsQuery = useIssueCommentsQuery(issueId);
  const createCommentMutation = useCreateCommentMutation({
    onSuccess: () => {
      setCommentBody("");
      setSubmitError("");
      showToast(getNotification("comments.create.success"));
    },
    onError: (message) => {
      setSubmitError(message);
      showToast({
        message,
        severity: "error",
      });
    },
  });
  const deleteCommentMutation = useDeleteCommentMutation({
    onSuccess: () => {
      setCommentToDelete(null);
      setDeleteError("");
      showToast(getNotification("comments.delete.success"));
    },
    onError: (message) => {
      setDeleteError(message);
      showToast({
        message,
        severity: "error",
      });
    },
  });

  const comments = commentsQuery.data ?? [];
  const trimmedCommentBody = commentBody.trim();
  const isSubmitting = createCommentMutation.isPending;
  const isDeleting = deleteCommentMutation.isPending;

  const handleSubmit = async () => {
    if (!trimmedCommentBody) {
      setSubmitError(getNotificationText("comments.required.error"));
      return;
    }

    setSubmitError("");
    await createCommentMutation.mutateAsync({
      issueId,
      formData: {
        body: trimmedCommentBody,
      },
    });
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setCommentToDelete(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) {
      return;
    }

    setDeleteError("");
    await deleteCommentMutation.mutateAsync({
      issueId,
      commentId: commentToDelete.id,
    });
  };

  return (
    <Paper sx={{ p: { xs: 3, md: 4 } }}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h5">Comments</Typography>
          <Typography color="text.secondary">
            Add context, updates, or review notes for this issue.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <TextField
            label="Add a comment"
            value={commentBody}
            onChange={(event) => {
              setCommentBody(event.target.value);
            }}
            placeholder="Write a comment with Markdown..."
            multiline
            minRows={4}
            fullWidth
            disabled={isSubmitting}
            error={Boolean(submitError)}
            helperText={submitError || "Markdown is supported."}
          />

          <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="contained"
              disabled={isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </Stack>
        </Stack>

        {commentsQuery.isLoading ? (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <CircularProgress size={18} />
            <Typography color="text.secondary">Loading comments...</Typography>
          </Stack>
        ) : null}

        {commentsQuery.isError ? (
          <Alert severity="error">
            {getNotificationText("comments.load.error")}
          </Alert>
        ) : null}

        {!commentsQuery.isLoading && !commentsQuery.isError && !comments.length ? (
          <Box
            sx={{
              border: "1px dashed var(--line-strong)",
              borderRadius: 3,
              px: 3,
              py: 4,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            No comments yet.
          </Box>
        ) : null}

        {comments.length ? (
          <Stack spacing={2}>
            {comments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  border: "1px solid var(--line)",
                  borderRadius: 3,
                  backgroundColor: "var(--surface-soft)",
                  p: { xs: 2, md: 2.5 },
                }}
              >
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ alignItems: "center", minWidth: 0 }}
                    >
                      <Avatar
                        src={comment.authorImage ?? undefined}
                        alt={getAuthorDisplayName(comment)}
                        sx={{
                          bgcolor: "primary.dark",
                          height: 36,
                          width: 36,
                        }}
                      >
                        {getAvatarFallback(comment)}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "text.primary",
                            fontWeight: 700,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getAuthorDisplayName(comment)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(comment.createdAt)}
                        </Typography>
                      </Box>
                    </Stack>

                    {comment.canDelete ? (
                      <Button
                        size="small"
                        color="error"
                        disabled={isDeleting}
                        onClick={() => {
                          setCommentToDelete(comment);
                        }}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </Stack>

                  <Box sx={markdownSx}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {comment.body}
                    </ReactMarkdown>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : null}
      </Stack>

      <Dialog
        open={commentToDelete !== null}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography color="text.secondary">
              Are you sure you want to delete this comment?
            </Typography>
            {deleteError ? <Alert severity="error">{deleteError}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void handleConfirmDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
