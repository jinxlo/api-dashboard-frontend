"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useTranslations } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
  };
  databaseConfigured: boolean;
}

export function AppShell({ children, user, databaseConfigured }: AppShellProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navigation = [
    { href: "/dashboard", label: t("navigation.items.dashboard") },
    { href: "/keys", label: t("navigation.items.keys") },
    { href: "/playground", label: t("navigation.items.playground") },
    { href: "/settings", label: t("navigation.items.account") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="relative z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
              aria-label={mobileOpen ? t("navigation.accessibility.close") : t("navigation.accessibility.open")}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            </button>
            <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
              {t("common.appName")}
            </Link>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/keys?create=1">{t("dashboard.createKey")}</Link>
            </Button>
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogContent
            className="left-0 top-16 flex h-[calc(100dvh-4rem)] w-full max-w-none translate-x-0 translate-y-0 flex-col border-none bg-background px-4 py-6 text-left shadow-2xl sm:right-4 sm:top-24 sm:h-auto sm:max-h-[calc(100vh-8rem)] sm:w-[22rem] sm:rounded-3xl sm:border sm:border-border/60 sm:px-6 sm:py-6"
            aria-describedby={undefined}
          >
            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/80 hover:bg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="space-y-3 border-t border-border/80 pt-4">
              <Button asChild className="w-full" size="sm">
                <Link href="/keys?create=1">{t("dashboard.createKey")}</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setMobileOpen(false);
                  void signOut({ callbackUrl: "/" });
                }}
              >
                {t("header.signOut")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>
      {!databaseConfigured ? (
        <div className="border-b border-dashed border-amber-300/60 bg-amber-500/10">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
            <p>{t("dashboard.databaseWarning")}</p>
            <Link
              href="/settings"
              className="text-sm font-medium underline underline-offset-4 hover:text-amber-700 dark:hover:text-amber-200"
            >
              {t("dashboard.databaseAction")}
            </Link>
          </div>
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-12 pt-8">
        <div className="flex flex-col gap-3 pb-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{user.name ?? user.email}</span>
          <button
            type="button"
            className="w-fit text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            {t("header.signOut")}
          </button>
        </div>
        <main className="flex-1 pb-12">{children}</main>
      </div>
      <footer className="border-t border-border bg-background/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
          <span>{t("common.appName")}</span>
          <span>{t("footer.rights")}</span>
        </div>
      </footer>
    </div>
  );
}
