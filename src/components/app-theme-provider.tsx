"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useMemo } from "react";

import QueryProvider from "@/components/query-provider";
import ToasterProvider from "@/components/toaster-provider";
import { useThemeStore } from "@/stores/theme-store";
import { createAppTheme } from "@/theme/theme";

type AppThemeProviderProps = {
  children: React.ReactNode;
};

export default function AppThemeProvider({
  children,
}: AppThemeProviderProps) {
  const themeMode = useThemeStore((state) => state.themeMode);
  const appTheme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  return (
    <QueryProvider>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <ToasterProvider>
          {children}
        </ToasterProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
