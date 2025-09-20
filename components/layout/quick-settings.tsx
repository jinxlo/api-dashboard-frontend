"use client";

import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function QuickSettings() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <LanguageToggle />
    </div>
  );
}

