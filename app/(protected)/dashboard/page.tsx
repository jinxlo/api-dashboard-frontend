import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { modelCatalog } from "@/lib/models";

const usageMetrics = [
  {
    label: "Monthly requests",
    value: "42,810",
    description: "+8.4% vs last billing cycle",
  },
  {
    label: "Token consumption",
    value: "5.4M",
    description: "Cap at 20M tokens",
  },
  {
    label: "Voice minutes",
    value: "892",
    description: "Streaming tier includes 2,500 min",
  },
  {
    label: "Image renders",
    value: "1,240",
    description: "Vision quota resets in 6 days",
  },
];

const categories = [
  { id: "llm", title: "Language models", blurb: "Conversational, reasoning and code-capable models." },
  { id: "tts", title: "Speech synthesis", blurb: "Production ready neural voices with expressive controls." },
  { id: "image", title: "Vision + imagery", blurb: "Diffusion systems tuned for photorealism and illustration." },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Operational status: green
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Orchestrate your Atlas AI footprint with enterprise-grade observability.
            </h1>
            <p className="text-sm text-white/70">
              Manage access credentials, monitor usage across modalities, and prepare new experiences in the unified Atlas workspace.
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/80 backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-white/50">Environment summary</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Region</span>
                <span className="font-medium text-white">iad1 · us-east</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Runtime</span>
                <span className="font-medium text-white">Edge + Serverless</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Next maintenance</span>
                <span className="font-medium text-white">Oct 12, 02:00 UTC</span>
              </div>
            </div>
            <a
              href="https://atlas.example.com/docs"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/20"
            >
              View integration playbooks
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {usageMetrics.map((metric) => (
          <Card key={metric.label} className="border-border/60 bg-card/50">
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Model catalogue</h2>
          <p className="text-sm text-muted-foreground">
            Atlas unifies large language, speech, and vision systems behind a shared gateway. Provision access by selecting the models your application requires.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="flex h-full flex-col border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.blurb}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                {modelCatalog
                  .filter((model) => model.category === category.id)
                  .map((model) => (
                    <div key={model.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{model.name}</p>
                        {model.contextWindow ? (
                          <span className="text-xs text-muted-foreground">{Intl.NumberFormat("en", { notation: "compact" }).format(model.contextWindow)} ctx</span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{model.shortDescription}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Release {model.release}
                        </span>
                        {model.latency ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {model.latency}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                          Use case: {model.defaultUseCase}
                        </span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <ApiKeyManager />
      </section>
    </div>
  );
}
