"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { QuickSettings } from "@/components/layout/quick-settings";
import { useTranslations } from "@/components/providers/locale-provider";

import { AppMobileNav } from "./app-mobile-nav";

export function AppHeader() {
  const { data } = useSession();
  const t = useTranslations();

  return (
    <header className="border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          <AppMobileNav />
          <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {t("header.console")}
          </div>
          <WorkspaceSwitcher className="hidden md:block" />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden w-64 lg:block">
            <Input placeholder={t("header.searchPlaceholder")} className="h-9" />
          </div>
          <div className="hidden items-center gap-3 text-xs text-muted-foreground lg:flex">
            <Link href="https://status.example.com" className="hover:text-foreground">
              {t("header.status")}
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link href="https://atlas.example.com/docs" className="hover:text-foreground">
              {t("header.docs")}
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link href="https://atlas.example.com/support" className="hover:text-foreground">
              {t("header.support")}
            </Link>
          </div>
          <QuickSettings />
          <div className="hidden flex-col text-right text-xs leading-tight sm:flex">
            <span className="font-semibold text-foreground">{data?.user?.name ?? "Developer"}</span>
            <span className="text-muted-foreground">{data?.user?.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
            {t("header.signOut")}
          </Button>
        </div>
      </div>
      <div className="pb-4 md:hidden">
        <WorkspaceSwitcher compact />
      </div>
    </header>
  );
}
