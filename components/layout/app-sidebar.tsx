"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Playground", href: "/playground", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/40 lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <span className="text-lg font-semibold">Atlas AI</span>
      </div>
      <nav className="flex flex-1 flex-col gap-2 px-4 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 pb-6">
        <div className="rounded-md border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
          Need production access? <span className="font-medium text-foreground">Contact sales</span>
        </div>
      </div>
    </aside>
  );
}
