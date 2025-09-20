"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useWorkspace } from "@/components/providers/workspace-provider";

interface WorkspaceSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function WorkspaceSwitcher({ className, compact = false }: WorkspaceSwitcherProps) {
  const { organizations, organization, project, selectOrganization, selectProject } = useWorkspace();

  return (
    <div className={cn("min-w-[220px] space-y-1", className)}>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Workspace context</p>
      <div className={cn("flex flex-wrap items-center gap-2", compact ? "text-xs" : "text-sm")}
      >
        <div className="relative">
          <select
            className={cn(
              "appearance-none rounded-md border border-border bg-background px-3 py-1 pr-8 font-medium text-foreground shadow-sm",
              compact ? "text-xs" : "text-sm",
            )}
            value={organization.id}
            onChange={(event) => selectOrganization(event.target.value)}
          >
            {organizations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <span className="text-muted-foreground">/</span>
        <div className="relative">
          <select
            className={cn(
              "appearance-none rounded-md border border-border bg-background px-3 py-1 pr-8 font-medium text-foreground shadow-sm",
              compact ? "text-xs" : "text-sm",
            )}
            value={project.id}
            onChange={(event) => selectProject(event.target.value)}
          >
            {organization.projects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {organization.plan} plan · {project.region.toUpperCase()} region
      </p>
    </div>
  );
}

