"use client";

import { FormHelperText, Stack, Typography } from "@mui/material";
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
      placeholder: "Describe the issue in Markdown...",
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
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
