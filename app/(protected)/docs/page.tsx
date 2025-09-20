import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const resources = [
  {
    title: "API reference",
    description: "Endpoints, schemas, and examples for every Atlas capability.",
    href: "https://atlas.example.com/docs/api",
  },
  {
    title: "Quickstart",
    description: "Spin up your first integration in less than five minutes.",
    href: "https://atlas.example.com/docs/quickstart",
  },
  {
    title: "Playground recipes",
    description: "Prompt templates and guardrails for production-grade chat experiences.",
    href: "https://atlas.example.com/docs/playground",
  },
  {
    title: "Security hardening",
    description: "Recommended policies for rotating keys and monitoring misuse.",
    href: "https://atlas.example.com/docs/security",
  },
];

const sdks = [
  { language: "TypeScript", version: "v2.1.0", href: "https://atlas.example.com/sdk/typescript" },
  { language: "Python", version: "v1.8.3", href: "https://atlas.example.com/sdk/python" },
  { language: "Go", version: "v0.9.6", href: "https://atlas.example.com/sdk/go" },
];

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentation"
        description="Everything you need to integrate Atlas into your applications, from REST endpoints to governance policies."
      />
      <Card className="border-border/70 bg-card/40">
        <CardHeader>
          <CardTitle>Featured guides</CardTitle>
          <CardDescription>Curated walkthroughs to get teams productive quickly.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {resources.map((resource) => (
            <Link
              key={resource.title}
              href={resource.href}
              className="group rounded-lg border border-border/50 bg-background/40 p-4 transition hover:border-primary hover:shadow-sm"
            >
              <p className="font-medium text-foreground group-hover:text-primary">{resource.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
              <span className="mt-3 inline-flex items-center text-xs font-medium text-primary">
                Read guide →
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>
      <Card className="border-border/70 bg-card/40">
        <CardHeader>
          <CardTitle>SDK downloads</CardTitle>
          <CardDescription>Always pinned to the latest stable release.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {sdks.map((sdk) => (
              <Link
                key={sdk.language}
                href={sdk.href}
                className="rounded-lg border border-border/60 bg-background/40 p-4 transition hover:border-primary hover:text-primary"
              >
                <p className="text-sm font-semibold">{sdk.language}</p>
                <p className="text-xs text-muted-foreground">Version {sdk.version}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

