"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderGit2, Key, LayoutDashboard, MessageSquare, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { useWorkspace } from "@/components/providers/workspace-provider";

const navigation = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Develop",
    items: [
      { name: "Projects", href: "/projects", icon: FolderGit2 },
      { name: "Playground", href: "/playground", icon: MessageSquare },
      { name: "Docs", href: "/docs", icon: BookOpen },
    ],
  },
  {
    label: "Security",
    items: [
      { name: "API keys", href: "/keys", icon: Key },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { organization, project } = useWorkspace();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/40 lg:flex lg:flex-col">
      <div className="space-y-2 border-b border-border px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{organization.name}</p>
            <p className="text-xs text-muted-foreground">{project.name}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
            {organization.plan}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Billing contact: <span className="font-medium text-foreground">{organization.billingEmail}</span>
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-6 px-4 py-6">
        {navigation.map((section) => (
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
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-4 pb-6">
        <div className="rounded-md border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
          Need production access? <span className="font-medium text-foreground">Contact sales</span>
        </div>
      </div>
    </aside>
  );
}
