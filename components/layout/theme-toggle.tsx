"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { useTranslations } from "@/components/providers/locale-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full border border-border/60 bg-background/70 text-muted-foreground hover:bg-muted"
      onClick={toggleTheme}
      aria-label={t("theme.toggleLabel")}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
      <span className="sr-only">{t("theme.toggleLabel")}</span>
    </Button>
  );
}

