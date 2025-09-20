import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getServerDictionary, getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n";

export default async function KeysPage() {
  const locale = await getServerLocale();
  const dictionary = await getServerDictionary(locale);
  const t = (key: string) => translate(dictionary, key);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("apiKeys.heading")}
        description={t("apiKeys.description")}
        docsHref="/docs"
      />
      <Card className="border-border/70 bg-muted/30">
        <CardContent className="space-y-2 py-5 text-sm text-muted-foreground">
          <p>{t("apiKeys.page.reminder")}</p>
          <p>{t("apiKeys.page.automation")}</p>
        </CardContent>
      </Card>
      <ApiKeyManager />
    </div>
  );
}
