import { QuickSettings } from "@/components/layout/quick-settings";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getServerDictionary, getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n";

export default async function Home() {
  const locale = await getServerLocale();
  const dictionary = await getServerDictionary(locale);
  const t = (key: string) => translate(dictionary, key);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/60">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {t("common.appName")}
          </div>
          <QuickSettings />
        </header>
        <div className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
          <div className="w-full max-w-md space-y-8 rounded-3xl border border-border/70 bg-card/80 p-8 shadow-2xl backdrop-blur">
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">{t("auth.brand")}</p>
              <h1 className="text-3xl font-semibold text-foreground">{t("auth.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("auth.subtitle")}</p>
            </div>
            <SignInForm showHeading={false} />
          </div>
        </div>
      </div>
    </main>
  );
}
