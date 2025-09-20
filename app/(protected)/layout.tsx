import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <AppShell
      user={{ name: session.user.name, email: session.user.email }}
      databaseConfigured={isDatabaseConfigured}
    >
      {children}
    </AppShell>
  );
}
