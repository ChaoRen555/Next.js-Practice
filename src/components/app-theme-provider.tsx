"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";

import QueryProvider from "@/components/query-provider";
import { appTheme } from "@/theme/theme";

type AppThemeProviderProps = {
  children: React.ReactNode;
};

export default function AppThemeProvider({
  children,
}: AppThemeProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
