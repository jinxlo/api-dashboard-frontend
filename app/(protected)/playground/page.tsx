import { PlaygroundPanel } from "@/components/playground/playground-panel";
import { PageHeader } from "@/components/layout/page-header";
import { getServerDictionary, getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function PlaygroundPage() {
  const locale = await getServerLocale();
  const dictionary = await getServerDictionary(locale);
  const t = (key: string) => translate(dictionary, key);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.playgroundTitle")}
        description={t("dashboard.playgroundBody")}
      />
      <PlaygroundPanel />
    </div>
  );
}
