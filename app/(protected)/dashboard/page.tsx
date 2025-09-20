import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured, prisma, prismaReady } from "@/lib/prisma";
import { modelCatalog } from "@/lib/models";
import { getServerDictionary, getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const RECENT_KEY_LIMIT = 4;

type RecentKey = {
  id: string;
  label: string | null;
  createdAt: string;
  models: string[];
};

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return null;
  }

  const locale = await getServerLocale();
  const dictionary = await getServerDictionary(locale);
  const t = (key: string) => translate(dictionary, key);

  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const createdLabel = t("dashboard.keyCreatedLabel");

  let recentKeys: RecentKey[] = [];

  if (isDatabaseConfigured) {
    await prismaReady;
    const keys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: RECENT_KEY_LIMIT,
    });

    const modelLookup = new Map(modelCatalog.map((model) => [model.id, model.name]));

    recentKeys = keys.map((key) => ({
      id: key.id,
      label: key.label ?? null,
      createdAt: formatter.format(key.createdAt),
      models: key.modelIds.length
        ? key.modelIds.map((modelId) => modelLookup.get(modelId) ?? modelId)
        : [t("apiKeys.list.unscoped")],
    }));
  }

  const displayName = session.user.name ?? session.user.email ?? "";

  return (
    <div className="space-y-10">
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        actions={
          <Button asChild size="sm">
            <Link href="/keys?create=1">{t("dashboard.createKey")}</Link>
          </Button>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="border-border/70 bg-card/60">
          <CardHeader className="space-y-2">
            <CardTitle>{t("dashboard.welcomeTitle")}</CardTitle>
            <CardDescription>{t("dashboard.welcomeBody")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            {displayName ? (
              <div className="rounded-md border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                {displayName}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/keys?create=1">{t("dashboard.createKey")}</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/playground">{t("dashboard.openPlayground")}</Link>
              </Button>
              <Button variant="ghost" size="sm" className="px-0" asChild>
                <Link href="/keys">{t("dashboard.viewAllKeys")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border border-border/70",
            isDatabaseConfigured
              ? "bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
              : "bg-amber-500/10 text-amber-900 dark:text-amber-50",
          )}
        >
          <CardHeader className="space-y-2">
            <CardTitle>
              {isDatabaseConfigured
                ? t("dashboard.databaseConnectedTitle")
                : t("dashboard.databaseMissingTitle")}
            </CardTitle>
            <CardDescription className="text-sm">
              {isDatabaseConfigured
                ? t("dashboard.databaseConnectedBody")
                : t("dashboard.databaseMissingBody")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              size="sm"
              variant={isDatabaseConfigured ? "outline" : "secondary"}
              className={cn(isDatabaseConfigured ? "border-emerald-500/40" : "bg-amber-500 text-amber-950")}
            >
              <Link href="/settings">
                {isDatabaseConfigured
                  ? t("dashboard.databaseManage")
                  : t("dashboard.databaseAction")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">{t("dashboard.recentKeysTitle")}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/keys">{t("dashboard.viewAllKeys")}</Link>
          </Button>
        </div>
        {!isDatabaseConfigured ? (
          <Card className="border-dashed border-border/70 bg-muted/40">
            <CardContent className="py-6 text-sm text-muted-foreground">
              {t("dashboard.databaseWarning")}
            </CardContent>
          </Card>
        ) : recentKeys.length === 0 ? (
          <Card className="border-dashed border-border/70">
            <CardContent className="py-6 text-sm text-muted-foreground">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>{t("dashboard.recentKeysEmpty")}</p>
                <Button asChild size="sm">
                  <Link href="/keys?create=1">{t("dashboard.recentKeysCta")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentKeys.map((key) => (
              <Card key={key.id} className="border-border/70">
                <CardContent className="space-y-3 py-5 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{key.label ?? t("dashboard.keyLabelFallback")}</p>
                    <p className="text-xs text-muted-foreground">{`${createdLabel} ${key.createdAt}`}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {key.models.map((model) => (
                      <span
                        key={`${key.id}-${model}`}
                        className="inline-flex items-center rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
