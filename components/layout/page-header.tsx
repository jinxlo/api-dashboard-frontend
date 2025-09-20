"use client";

import { ReactNode } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/components/providers/workspace-provider";
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
  const { organization, project } = useWorkspace();
  const t = useTranslations();

  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-6", className)}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <span>{organization.name}</span>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span>{project.name}</span>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="font-medium text-foreground">{title}</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
        </div>
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

