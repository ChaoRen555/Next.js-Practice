"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { KeyboardEvent, ReactNode } from "react";

export type AppTableColumn<Row> = {
  id: string;
  label: string;
  renderCell: (row: Row) => ReactNode;
  sx?: object;
};

type AppTableProps<Row> = {
  columns: Array<AppTableColumn<Row>>;
  rows: Row[];
  getRowHref?: (row: Row) => string;
  getRowKey: (row: Row) => string | number;
  emptyDescription: string;
  emptyTitle: string;
  minWidth?: number;
};

export default function AppTable<Row>({
  columns,
  rows,
  getRowHref,
  getRowKey,
  emptyDescription,
  emptyTitle,
  minWidth = 640,
}: AppTableProps<Row>) {
  const router = useRouter();

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    href: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(href);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth }} size="medium">
        <TableHead sx={{ backgroundColor: "var(--surface-soft)" }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  fontWeight: 700,
                  ...column.sx,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="h6">{emptyTitle}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {emptyDescription}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : null}

          {rows.map((row) => {
            const href = getRowHref?.(row);

            return (
              <TableRow
                key={getRowKey(row)}
                hover={Boolean(href)}
                tabIndex={href ? 0 : undefined}
                onClick={href ? () => router.push(href) : undefined}
                onKeyDown={href ? (event) => handleRowKeyDown(event, href) : undefined}
                sx={{
                  ...(href
                    ? {
                        cursor: "pointer",
                        textDecoration: "none",
                        "&:hover": {
                          backgroundColor: "var(--surface-hover)",
                        },
                      }
                    : {}),
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.renderCell(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
