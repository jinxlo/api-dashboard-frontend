import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspacePreferences } from "@/components/settings/workspace-preferences";
import { WorkspaceSummary } from "@/components/settings/workspace-summary";

const governanceUpdates = [
  {
    title: "Staging hardening",
    body: "New projects start in staging with read-only data replication.",
  },
  {
    title: "Rotation cadence",
    body: "Production API keys rotate every 30 days with automated alerts.",
  },
  {
    title: "Audit exports",
    body: "Download workspace-wide audit logs as CSV for compliance reviews.",
  },
];

export default function WorkspacePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace"
        description="Manage organization details, govern projects, and keep your Atlas control plane aligned across teams."
      />
      <WorkspaceSummary />
      <WorkspacePreferences />
      <Card className="border-border/70 bg-muted/30">
        <CardHeader>
          <CardTitle>Governance playbook</CardTitle>
          <CardDescription>Recommended steps for keeping environments production-ready.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {governanceUpdates.map((item) => (
            <div key={item.title} className="space-y-2 rounded-lg border border-border/60 bg-background/50 p-4">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
