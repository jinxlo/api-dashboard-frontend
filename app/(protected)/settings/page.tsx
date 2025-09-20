import { redirect } from "next/navigation";

import { PasswordForm } from "@/components/settings/password-form";
import { ProfileForm } from "@/components/settings/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";
import { prisma, prismaReady, isDatabaseConfigured } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  if (!isDatabaseConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Configure your managed database connection to unlock profile editing, password rotation, and organisation controls.
          </p>
        </div>
        <Card className="border-dashed border-border/80 bg-card/50">
          <CardHeader>
            <CardTitle>Database connection required</CardTitle>
            <CardDescription>
              Atlas is currently running in demo mode. Connect a Postgres database and run the Prisma migrations to persist user updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <ol className="list-decimal space-y-2 pl-4">
              <li>
                Provision a Postgres instance (Vercel Postgres, Neon, Supabase or any compatible managed provider).
              </li>
              <li>
                Set <code className="rounded bg-muted px-1 py-0.5">DATABASE_URL</code> (or the Vercel Postgres secrets) for your deployment.
              </li>
              <li>
                Run <code className="rounded bg-muted px-1 py-0.5">npx prisma migrate deploy</code> followed by <code className="rounded bg-muted px-1 py-0.5">npm run db:seed</code>.
              </li>
            </ol>
            <p>
              Until then, you can continue exploring the dashboard with the demo account <span className="font-medium text-foreground">{session.user.email}</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  await prismaReady;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your profile information and update your password.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your basic information that appears on invoices and notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm defaultValues={{ name: user.name ?? "", email: user.email }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Change your password to keep your account protected.</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
