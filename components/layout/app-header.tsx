"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
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
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold lg:hidden">Atlas AI</span>
        <nav className="hidden items-center gap-4 text-sm font-medium lg:flex">
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
