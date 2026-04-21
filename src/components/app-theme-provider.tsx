"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";

import QueryProvider from "@/components/query-provider";
import ToasterProvider from "@/components/toaster-provider";
import { appTheme } from "@/theme/theme";

type AppThemeProviderProps = {
  children: React.ReactNode;
};

export default function AppThemeProvider({
  children,
}: AppThemeProviderProps) {
  return (
    <QueryProvider>
      <ToasterProvider>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ToasterProvider>
    </QueryProvider>
  );
}
