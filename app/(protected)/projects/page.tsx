import { ProjectTable } from "@/components/projects/project-table";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Structure your Atlas usage by project to isolate credentials, quotas, and audit logs."
        docsHref="/docs"
      />
      <Card className="border-border/70 bg-card/40">
        <CardHeader>
          <CardTitle>Workspace policies</CardTitle>
          <CardDescription>Control how new projects inherit access.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
          <div>
            <p className="font-medium text-foreground">Default access</p>
            <p>New projects start with read-only access to the shared staging environment.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Lifecycle</p>
            <p>After security review, promote projects to production to unlock live quotas and API key creation.</p>
          </div>
        </CardContent>
      </Card>
      <ProjectTable />
    </div>
  );
}

