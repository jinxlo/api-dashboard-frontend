"use client";

import { useWorkspace } from "@/components/providers/workspace-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const planCopy: Record<string, { headline: string; description: string }> = {
  Starter: {
    headline: "Starter plan",
    description: "Ideal for prototyping and small workloads with generous rate limits.",
  },
  Pro: {
    headline: "Pro plan",
    description: "Scaled concurrency with dedicated support for growing teams.",
  },
  Enterprise: {
    headline: "Enterprise plan",
    description: "Custom contracts, private networking, and 24/7 coverage.",
  },
};

export function WorkspaceSummary() {
  const { organization, project } = useWorkspace();
  const plan = planCopy[organization.plan] ?? planCopy.Starter;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-border/70 bg-card/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Plan</CardTitle>
          <CardDescription>{plan.headline}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>{plan.description}</p>
        </CardContent>
      </Card>
      <Card className="border-border/70 bg-card/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Billing contact</CardTitle>
          <CardDescription>Where invoices and quota alerts are delivered.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{organization.billingEmail}</p>
          <p className="mt-1">Update these details whenever your finance team changes.</p>
        </CardContent>
      </Card>
      <Card className="border-border/70 bg-card/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Active project</CardTitle>
          <CardDescription>Currently routing console actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">{project.name}</p>
            {project.description ? <p>{project.description}</p> : null}
          </div>
          <p>Switch projects from the header or promote new builds here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
