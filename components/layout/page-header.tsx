"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
  docsHref?: string;
}

export function PageHeader({ title, description, className, actions, docsHref }: PageHeaderProps) {
  const t = useTranslations();

  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
        {docsHref ? (
          <Button variant="ghost" size="sm" className="h-8 w-fit px-2" asChild>
            <Link href={docsHref} className="inline-flex items-center gap-1">
              {t("pageHeader.viewDocs")}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
