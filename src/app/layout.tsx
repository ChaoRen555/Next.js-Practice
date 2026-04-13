import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

import AppThemeProvider from "@/components/app-theme-provider";
import "@/styles/globals.css";
import NavBar from "./NavBar";

export const metadata: Metadata = {
  title: "Next Project",
  description: "A starter project built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AppRouterCacheProvider>
          <AppThemeProvider>
            <NavBar />
            <main>{children}</main>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
