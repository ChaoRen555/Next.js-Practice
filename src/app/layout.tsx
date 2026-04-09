import type { Metadata } from "next";
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
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
