import Link from "next/link";
import { ArrowUpRight, Calendar, Filter, LinkIcon, ListChecks } from "lucide-react";

import { ApiKeyOverview } from "@/components/dashboard/api-key-overview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { modelCatalog, type ModelCategory } from "@/lib/models";
import { PageHeader } from "@/components/layout/page-header";
import { getServerDictionary, getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n";

const statusBreakdown = [
  { code: "200", ratio: 86 },
  { code: "201", ratio: 8 },
  { code: "400", ratio: 3 },
  { code: "401", ratio: 2 },
  { code: "500", ratio: 1 },
];

export default async function DashboardPage() {
  const locale = await getServerLocale();
  const dictionary = await getServerDictionary(locale);
  const t = (key: string) => translate(dictionary, key);

  const usageMetrics = [
    { label: t("dashboard.metrics.requests"), value: "42,810", delta: t("dashboard.metricsDelta.requests") },
    { label: t("dashboard.metrics.tokens"), value: "5.4M", delta: t("dashboard.metricsDelta.tokens") },
    { label: t("dashboard.metrics.voice"), value: "892", delta: t("dashboard.metricsDelta.voice") },
    { label: t("dashboard.metrics.images"), value: "1,240", delta: t("dashboard.metricsDelta.images") },
  ];

  const activityLog = [
    {
      title: t("dashboard.activity.entries.voice.title"),
      description: t("dashboard.activity.entries.voice.description"),
      timestamp: t("dashboard.activity.entries.voice.time"),
    },
    {
      title: t("dashboard.activity.entries.key.title"),
      description: t("dashboard.activity.entries.key.description"),
      timestamp: t("dashboard.activity.entries.key.time"),
    },
    {
      title: t("dashboard.activity.entries.policy.title"),
      description: t("dashboard.activity.entries.policy.description"),
      timestamp: t("dashboard.activity.entries.policy.time"),
    },
  ];

  const contextFormatter = new Intl.NumberFormat(locale, { notation: "compact" });
  const categoryLabels: Record<ModelCategory, string> = {
    llm: t("apiKeys.filters.language"),
    tts: t("apiKeys.filters.speech"),
    image: t("apiKeys.filters.vision"),
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        docsHref="/docs"
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" /> {t("dashboard.filters")}
            </Button>
            <Button size="sm" className="h-9" asChild>
              <Link href="/keys">
                {t("dashboard.createKey")}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </>
        }
      />

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> {t("dashboard.statusPill")}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {t("dashboard.statusPeriod")}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ListChecks className="h-4 w-4" />
          {t("dashboard.compliance")}
        </div>
        <Button variant="ghost" size="sm" className="ml-auto h-8 px-2" asChild>
          <Link href="https://status.example.com" className="inline-flex items-center gap-1 text-xs">
            {t("dashboard.statusHistory")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {usageMetrics.map((metric) => (
          <Card key={metric.label} className="border-border/60 bg-card/50">
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl tracking-tight">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium text-muted-foreground">{metric.delta}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t("dashboard.httpTitle")}</CardTitle>
              <CardDescription>{t("dashboard.httpDescription")}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-8">
              {t("dashboard.openMetrics")}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {statusBreakdown.map((status) => (
                <div key={status.code} className="flex flex-col items-center justify-end gap-2">
                  <div className="flex h-44 w-full items-end overflow-hidden rounded-lg border border-border bg-gradient-to-t from-primary/10 via-primary/40 to-primary/80">
                    <div style={{ height: `${status.ratio}%` }} className="w-full rounded-t-lg bg-gradient-to-t from-primary via-primary/80 to-white/80" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{status.code}</span>
                  <span className="text-xs text-muted-foreground">{status.ratio}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.latencyTitle")}</CardTitle>
            <CardDescription>{t("dashboard.latencyDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("dashboard.p95")}</p>
              <p className="text-3xl font-semibold text-foreground">382 ms</p>
              <p className="text-xs text-muted-foreground">Optimised edge runtime · -12% vs previous period</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("dashboard.availability")}</p>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-emerald-500/10">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "99.98%" }} />
                </div>
                <span className="text-sm font-medium text-foreground">99.98%</span>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-4 text-xs text-muted-foreground">
              {t("dashboard.availabilityNote")}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t("dashboard.apiCredentialsTitle")}</CardTitle>
              <CardDescription>{t("dashboard.apiCredentialsDescription")}</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8" asChild>
              <Link href="/keys">
                {t("dashboard.manageKeys")}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ApiKeyOverview />
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>{t("dashboard.activityTitle")}</CardTitle>
            <CardDescription>{t("dashboard.activityDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLog.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("dashboard.emptyActivity")}</p>
            ) : (
              <ol className="space-y-4 text-sm">
                {activityLog.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      <p className="text-xs text-muted-foreground/70">{item.timestamp}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t("dashboard.availableModelsTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("dashboard.availableModelsDescription")}</p>
          </div>
          <Button variant="outline" size="sm" className="h-9" asChild>
            <Link href="/docs">
              {t("dashboard.integrationGuide")}
              <LinkIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card/50">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t("dashboard.modelTable.model")}
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t("dashboard.modelTable.modality")}
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t("dashboard.modelTable.context")}
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t("dashboard.modelTable.release")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card/40">
              {modelCatalog.map((model) => (
                <tr key={model.id}>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.shortDescription}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{categoryLabels[model.category]}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {model.contextWindow
                      ? `${contextFormatter.format(model.contextWindow)} ${t("dashboard.modelTable.tokensLabel")}`
                      : t("dashboard.modelTable.unknown")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{model.release}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
