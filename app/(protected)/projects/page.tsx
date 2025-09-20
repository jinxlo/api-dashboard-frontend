import { ProjectTable } from "@/components/projects/project-table";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerDictionary, getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n";

export default async function ProjectsPage() {
  const locale = await getServerLocale();
  const dictionary = await getServerDictionary(locale);
  const t = (key: string) => translate(dictionary, key);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("projects.title")}
        description={t("projects.description")}
        docsHref="/docs"
      />
      <Card className="border-border/70 bg-card/40">
        <CardHeader>
          <CardTitle>{t("projects.policiesTitle")}</CardTitle>
          <CardDescription>{t("projects.policiesDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
          <div>
            <p className="font-medium text-foreground">{t("projects.defaultAccessTitle")}</p>
            <p>{t("projects.defaultAccessBody")}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{t("projects.lifecycleTitle")}</p>
            <p>{t("projects.lifecycleBody")}</p>
          </div>
        </CardContent>
      </Card>
      <ProjectTable />
    </div>
  );
}
