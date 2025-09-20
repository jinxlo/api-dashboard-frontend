"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/components/providers/workspace-provider";

import { useNavigationSections } from "./navigation";
import { useTranslations } from "@/components/providers/locale-provider";

export function AppMobileNav() {
  const pathname = usePathname();
  const { organization, project } = useWorkspace();
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const navigationSections = useNavigationSections();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label={t("navigation.accessibility.open")}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full w-72 border-r border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{organization.name}</p>
                <p className="text-xs text-muted-foreground">{project.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label={t("navigation.accessibility.close")}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
            <nav className="flex h-[calc(100%-4rem)] flex-col gap-6 overflow-y-auto px-4 py-6">
              {navigationSections.map((section) => (
                <div key={section.label} className="space-y-2">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.label}
                  </p>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
          <button
            type="button"
            aria-label={t("navigation.accessibility.dismiss")}
            className="h-full flex-1 bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
    </>
  );
}
