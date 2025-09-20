"use client";

import { LocaleProvider } from "@/components/providers/locale-provider";
import { ThemeProvider, type Theme } from "@/components/providers/theme-provider";
import type { Locale } from "@/lib/i18n";

interface UIProviderProps {
  initialLocale: Locale;
  initialTheme: Theme;
  children: React.ReactNode;
}

export function UIProvider({ initialLocale, initialTheme, children }: UIProviderProps) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
    </ThemeProvider>
  );
}

