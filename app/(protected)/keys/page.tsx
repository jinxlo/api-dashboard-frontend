import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function KeysPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="API keys"
        description="Create, scope, and rotate credentials for every integration and environment."
        docsHref="/docs"
      />
      <Card className="border-border/70 bg-muted/30">
        <CardContent className="space-y-2 py-5 text-sm text-muted-foreground">
          <p>
            Atlas only surfaces newly generated secrets once. Store them securely in your vault and use separate keys for staging
            and production workloads.
          </p>
          <p>
            Need to automate rotation? Call the <code className="rounded bg-muted px-1 py-0.5">/api/keys</code> endpoints from your
            CI pipelines or Terraform provider.
          </p>
        </CardContent>
      </Card>
      <ApiKeyManager />
    </div>
  );
}

