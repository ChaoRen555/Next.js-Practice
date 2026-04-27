import { Box, Chip, Stack, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { IssueItem } from "@/lib/issues";

import {
  formatDateTime,
  formatStatus,
  getStatusChipSx,
} from "./issue-formatters";

type IssueDetailContentProps = {
  issue: IssueItem;
};

export default function IssueDetailContent({ issue }: IssueDetailContentProps) {
  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
      <Stack spacing={1.5}>
        <Typography
          variant="overline"
          sx={{ color: "primary.dark", letterSpacing: "0.18em" }}
        >
          Issue #{issue.id}
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
          <Typography
            variant="h4"
            sx={{
              minWidth: 0,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {issue.title}
          </Typography>
          <Chip
            label={formatStatus(issue.status)}
            sx={getStatusChipSx(issue.status)}
          />
        </Box>
      </Stack>

      <Box>
        <Box
          sx={{
            mt: 1,
            minWidth: 0,
            maxWidth: "100%",
            color: "text.primary",
            lineHeight: 1.8,
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
              my: 1.25,
            },
            "& ul, & ol": {
              pl: 3,
              my: 1.5,
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
              borderLeft: "4px solid rgba(109, 134, 125, 0.35)",
              backgroundColor: "rgba(255, 255, 255, 0.52)",
              color: "text.secondary",
              borderRadius: 2,
              maxWidth: "100%",
            },
            "& code": {
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              backgroundColor: "rgba(109, 134, 125, 0.12)",
              fontFamily: '"SFMono-Regular", Consolas, monospace',
              fontSize: "0.92em",
            },
            "& pre": {
              maxWidth: "100%",
              overflowX: "auto",
              p: 2,
              borderRadius: 3,
              backgroundColor: "rgba(39, 52, 50, 0.92)",
              color: "#f4f7f5",
            },
            "& pre code": {
              p: 0,
              backgroundColor: "transparent",
              color: "inherit",
              overflowWrap: "normal",
              wordBreak: "normal",
              whiteSpace: "pre",
            },
            "& table": {
              display: "block",
              maxWidth: "100%",
              overflowX: "auto",
              width: "100%",
              borderCollapse: "collapse",
              my: 2,
              overflow: "hidden",
              borderRadius: 3,
              border: "1px solid rgba(109, 134, 125, 0.18)",
            },
            "& thead": {
              backgroundColor: "rgba(109, 134, 125, 0.08)",
            },
            "& th, & td": {
              minWidth: 0,
              px: 1.5,
              py: 1,
              textAlign: "left",
              borderBottom: "1px solid rgba(109, 134, 125, 0.14)",
            },
            "& tr:last-child td": {
              borderBottom: "none",
            },
            "& a": {
              color: "primary.dark",
              textDecoration: "underline",
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              mt: 2.5,
              mb: 1,
              lineHeight: 1.25,
            },
            "& hr": {
              my: 2.5,
              border: 0,
              borderTop: "1px solid rgba(109, 134, 125, 0.18)",
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {issue.description}
          </ReactMarkdown>
        </Box>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 0.75, md: 3 }}
        sx={{
          pt: 0.5,
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          Created{" "}
          <Box component="span" sx={{ ml: 0.75, color: "text.primary" }}>
            {formatDateTime(issue.createdAt)}
          </Box>
        </Typography>
        <Typography variant="body2">
          Created By{" "}
          <Box component="span" sx={{ ml: 0.75, color: "text.primary" }}>
            {issue.createdByName ?? "Unknown"}
          </Box>
        </Typography>
        <Typography variant="body2">
          Updated{" "}
          <Box component="span" sx={{ ml: 0.75, color: "text.primary" }}>
            {formatDateTime(issue.updatedAt)}
          </Box>
        </Typography>
      </Stack>
    </Stack>
  );
}
