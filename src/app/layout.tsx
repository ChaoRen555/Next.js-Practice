import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

import AppThemeProvider from "@/components/app-theme-provider";
import "@/styles/globals.css";
import ConstructionSidebar from "./_components/ConstructionSidebar";
import NavBar from "./_components/NavBar";

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
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-start">
              <ConstructionSidebar />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
