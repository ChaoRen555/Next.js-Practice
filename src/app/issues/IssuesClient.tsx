"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

type IssueItem = {
  id: number;
  title: string;
  description: string;
  status: "OPEN" | "CLOSED" | "IN_PROGRESS";
  createdAt: string;
  updatedAt: string;
};

type FieldErrors = {
  title?: string[];
  description?: string[];
};

const initialFormData = {
  title: "",
  description: "",
};

const formatStatus = (status: IssueItem["status"]) => {
  return status.replaceAll("_", " ");
};

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString();
};

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
};

export default function IssuesClient() {
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoadError("");
        const response = await fetch("/api/issues", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch issues");
        }

        const data = (await response.json()) as IssueItem[];
        setIssues(data);
      } catch {
        setLoadError("Unable to load issues right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadIssues();
  }, []);

  const handleOpenCreateDialog = () => {
    setSubmitError("");
    setFieldErrors({});
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (isSubmitting) {
      return;
    }

    setIsCreateDialogOpen(false);
    setFormData(initialFormData);
    setFieldErrors({});
    setSubmitError("");
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
    setSubmitError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.fieldErrors) {
          setFieldErrors(data.fieldErrors as FieldErrors);
          return;
        }

        setSubmitError(data.error ?? "Unable to create issue.");
        return;
      }

      const newIssue = data as IssueItem;
      setIssues((current) => [newIssue, ...current]);
      setSelectedIssue(newIssue);
      setIsCreateDialogOpen(false);
      setFormData(initialFormData);
    } catch {
      setSubmitError("Unable to create issue right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 6 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ color: "primary.dark", letterSpacing: "0.24em" }}
              >
                Issue Board
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.5 }}>
                Issues
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Review the issues list, open any row to inspect details, or create a new issue when needed.
              </Typography>
            </Box>

            <Button variant="contained" onClick={handleOpenCreateDialog}>
              Create New Issue
            </Button>
          </Stack>
        </Paper>

        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h5">Issues List</Typography>
            <Typography color="text.secondary">
              {issues.length} {issues.length === 1 ? "issue" : "issues"}
            </Typography>
          </Box>

          {loadError ? <Alert severity="error">{loadError}</Alert> : null}

          {isLoading ? (
            <Paper
              sx={{
                minHeight: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
              }}
            >
              <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                <CircularProgress color="primary" />
                <Typography color="text.secondary">Loading issues...</Typography>
              </Stack>
            </Paper>
          ) : null}

          {!isLoading && !loadError && issues.length === 0 ? (
            <Paper sx={{ p: 4, borderRadius: 6 }}>
              <Typography variant="h6">No issues yet</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Click &quot;Create New Issue&quot; to add the first one.
              </Typography>
            </Paper>
          ) : null}

          {!isLoading && !loadError && issues.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 6,
                overflowX: "auto",
              }}
            >
              <Table sx={{ minWidth: 760 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow
                      key={issue.id}
                      hover
                      onClick={() => setSelectedIssue(issue)}
                      sx={{
                        cursor: "pointer",
                        "&:last-child td, &:last-child th": { borderBottom: 0 },
                      }}
                    >
                      <TableCell>{issue.id}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{issue.title}</TableCell>
                      <TableCell sx={{ color: "text.secondary", maxWidth: 320 }}>
                        {truncateText(issue.description, 90)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(issue.status)}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(109, 134, 125, 0.12)",
                            color: "primary.dark",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {formatDateTime(issue.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Stack>
      </Stack>

      <Dialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmit}>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
            <Button onClick={handleCloseCreateDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Issue"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={selectedIssue !== null}
        onClose={() => setSelectedIssue(null)}
        fullWidth
        maxWidth="md"
      >
        {selectedIssue ? (
          <>
            <DialogTitle sx={{ pb: 1.5 }}>
              <Stack spacing={1.5}>
                <Typography variant="overline" sx={{ color: "primary.dark", letterSpacing: "0.18em" }}>
                  Issue #{selectedIssue.id}
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
                  <Typography variant="h5">{selectedIssue.title}</Typography>
                  <Chip
                    label={formatStatus(selectedIssue.status)}
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
                  <Typography sx={{ mt: 1, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                    {selectedIssue.description}
                  </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Paper sx={{ p: 2.5, borderRadius: 5, flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      {formatDateTime(selectedIssue.createdAt)}
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2.5, borderRadius: 5, flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Updated At
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      {formatDateTime(selectedIssue.updatedAt)}
                    </Typography>
                  </Paper>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setSelectedIssue(null)} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Container>
  );
}
