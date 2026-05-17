"use client";

import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { useToaster } from "@/components/toaster-provider";
import { getNotification, getNotificationText } from "@/lib/notifications";
import type {
  WorkBreakdownImportIssue,
  WorkBreakdownImportResult,
} from "@/lib/work-breakdown";

type WorkBreakdownImportPanelProps = {
  projectId: number;
};

type ImportApiError = {
  error?: string;
  issues?: WorkBreakdownImportIssue[];
};

export default function WorkBreakdownImportPanel({
  projectId,
}: WorkBreakdownImportPanelProps) {
  const router = useRouter();
  const { showToast } = useToaster();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importIssues, setImportIssues] = useState<WorkBreakdownImportIssue[]>([]);
  const [importError, setImportError] = useState("");

  const handleImportFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsImporting(true);
    setImportIssues([]);
    setImportError("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/work-breakdown/import`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = (await response.json()) as WorkBreakdownImportResult | ImportApiError;

      if (!response.ok) {
        if ("issues" in data && data.issues?.length) {
          setImportIssues(data.issues);
          showToast(getNotification("projects.import.validationError"));
          return;
        }

        const message =
          ("error" in data && data.error) ||
          getNotificationText("projects.import.error");
        setImportError(message);
        showToast({
          message,
          severity: "error",
        });
        return;
      }

      const result = data as WorkBreakdownImportResult;
      showToast(getNotification("projects.import.success", {
        rowsProcessed: result.rowsProcessed,
      }));
      router.refresh();
    } catch {
      const message = getNotificationText("projects.import.error");
      setImportError(message);
      showToast({
        message,
        severity: "error",
      });
    } finally {
      setIsImporting(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Box className="app-panel rounded-lg p-4">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h6">Import Work Breakdown</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Upload CSV, XLS, or XLSX with unit, division, and sub-item work columns.
          </Typography>
        </Box>

        <Button
          component="label"
          disabled={isImporting}
          variant="contained"
        >
          {isImporting ? "Importing..." : "Upload File"}
          <input
            ref={fileInputRef}
            accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            hidden
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                void handleImportFile(file);
              }
            }}
          />
        </Button>
      </Stack>

      {isImporting ? <LinearProgress sx={{ mt: 3 }} /> : null}

      {importError ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          {importError}
        </Alert>
      ) : null}

      {importIssues.length > 0 ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 700 }}>Import validation failed</Typography>
          <Box component="ul" sx={{ mb: 0, pl: 2.5 }}>
            {importIssues.slice(0, 8).map((issue) => (
              <li key={`${issue.row}-${issue.message}`}>
                Row {issue.row}: {issue.message}
              </li>
            ))}
          </Box>
          {importIssues.length > 8 ? (
            <Typography sx={{ mt: 1 }}>
              {importIssues.length - 8} more rows need attention.
            </Typography>
          ) : null}
        </Alert>
      ) : null}
    </Box>
  );
}
