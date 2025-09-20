import type { Metadata } from "next";
import localFont from "next/font/local";

import { AuthSessionProvider } from "@/components/providers/session-provider";
import { cn } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth";

import "./globals.css";

const geistSans = localFont({
  src: [
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2",
      style: "normal",
      weight: "600",
    },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    {
      path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-SemiBold.woff2",
      style: "normal",
      weight: "600",
    },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Atlas AI Platform",
  description:
    "Self-service developer platform for managing API access to the Atlas AI large language model.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
