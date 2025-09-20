import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { UIProvider } from "@/components/providers/ui-provider";
import { THEME_COOKIE, type Theme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth";
import { getServerLocale } from "@/lib/i18n/server";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

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
  const cookieStore = await cookies();
  const initialLocale = await getServerLocale();
  const storedTheme = cookieStore.get(THEME_COOKIE)?.value;
  const initialTheme: Theme = storedTheme === "light" ? "light" : "dark";

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <UIProvider initialLocale={initialLocale} initialTheme={initialTheme}>
          <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
        </UIProvider>
      </body>
    </html>
  );
}
