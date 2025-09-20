"use client";

import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "@/components/providers/locale-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations();
  const nextLocale = locale === "es" ? "en" : "es";

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 rounded-full border border-border/60 bg-background/70 px-4 text-xs font-medium text-muted-foreground hover:bg-muted"
      onClick={() => setLocale(nextLocale)}
      aria-label={t("locale.toggleLabel")}
    >
      <span className={locale === "es" ? "text-foreground" : "text-muted-foreground/70"}>ES</span>
      <span className="mx-2 text-muted-foreground/60">/</span>
      <span className={locale === "en" ? "text-foreground" : "text-muted-foreground/70"}>EN</span>
    </Button>
  );
}

