"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Playground", href: "/playground" },
  { name: "Settings", href: "/settings" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-3 py-1 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Atlas AI · Control Plane
        </div>
        <nav className="hidden items-center gap-4 text-sm font-medium xl:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground",
                pathname.startsWith(link.href) ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden w-64 lg:block">
          <Input placeholder="Search docs, playbooks, status…" className="h-9" />
        </div>
        <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
          <Link href="https://status.example.com" className="hover:text-foreground">
            Status
          </Link>
          <span className="text-muted-foreground/40">•</span>
          <Link href="https://atlas.example.com/docs" className="hover:text-foreground">
            Docs
          </Link>
          <span className="text-muted-foreground/40">•</span>
          <Link href="https://atlas.example.com/support" className="hover:text-foreground">
            Support
          </Link>
        </div>
        <div className="hidden flex-col text-right text-xs leading-tight sm:flex">
          <span className="font-semibold text-foreground">{data?.user?.name ?? "Developer"}</span>
          <span className="text-muted-foreground">{data?.user?.email}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
