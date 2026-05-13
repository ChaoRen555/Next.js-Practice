"use client";

import {
  Box,
  Chip,
  FormHelperText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type SimpleMDE from "easymde";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Controller, type Control } from "react-hook-form";

import type { IssueFormData } from "@/lib/issues";

const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type IssueDescriptionEditorProps = {
  control: Control<IssueFormData>;
  error?: string;
};

const markdownHighlights = ["Tables", "Task lists", "Code fences", "Quotes"];

export default function IssueDescriptionEditor({
  control,
  error,
}: IssueDescriptionEditorProps) {
  const options = useMemo<SimpleMDE.Options>(
    () => ({
      autofocus: false,
      spellChecker: false,
      status: false,
      minHeight: "220px",
      placeholder: "Describe the issue",
      promptURLs: true,
      renderingConfig: {
        singleLineBreaks: false,
      },
      toolbar: [
        "bold",
        "italic",
        "strikethrough",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        {
          name: "task-list",
          action: (editor) => {
            editor.codemirror.replaceSelection(
              "- [ ] First task\n- [x] Done task",
            );
          },
          className: "fa fa-check-square-o",
          title: "Task List",
        },
        {
          name: "table",
          action: (editor) => {
            editor.codemirror.replaceSelection(
              "| Column | Value |\n| --- | --- |\n| Item | Detail |",
            );
          },
          className: "fa fa-table",
          title: "Table",
        },
        "|",
        "link",
        "code",
        "preview",
        "side-by-side",
        "fullscreen",
      ],
    }),
    [],
  );

  return (
    <Stack spacing={1}>
      <Typography
        component="label"
        variant="body2"
        sx={{ color: "text.secondary", fontWeight: 600 }}
      >
        Description
      </Typography>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMdeEditor
            value={field.value}
            onChange={field.onChange}
            options={options}
          />
        )}
      />
      <FormHelperText error={Boolean(error)} sx={{ mx: 0 }}>
        {error ?? " "}
      </FormHelperText>
    </Stack>
  );
}
