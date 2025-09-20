"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/components/providers/workspace-provider";

export function WorkspacePreferences() {
  const { organization, project, updateOrganization, updateProject } = useWorkspace();
  const [organizationName, setOrganizationName] = useState(organization.name);
  const [billingEmail, setBillingEmail] = useState(organization.billingEmail);
  const [plan, setPlan] = useState(organization.plan);
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(project.description ?? "");

  useEffect(() => {
    setOrganizationName(organization.name);
    setBillingEmail(organization.billingEmail);
    setPlan(organization.plan);
  }, [organization]);

  useEffect(() => {
    setProjectName(project.name);
    setProjectDescription(project.description ?? "");
  }, [project]);

  const handleOrganizationSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateOrganization(organization.id, {
      name: organizationName.trim() || organization.name,
      billingEmail: billingEmail.trim() || organization.billingEmail,
      plan: plan as typeof organization.plan,
    });
  };

  const handleProjectSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProject(organization.id, project.id, {
      name: projectName.trim() || project.name,
      description: projectDescription.trim() || undefined,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/70 bg-card/40">
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Update display information for invoices and shared workspaces.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOrganizationSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organization-name">Organization name</Label>
              <Input
                id="organization-name"
                value={organizationName}
                onChange={(event) => setOrganizationName(event.target.value)}
                placeholder="Atlas Labs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization-email">Billing email</Label>
              <Input
                id="organization-email"
                type="email"
                value={billingEmail}
                onChange={(event) => setBillingEmail(event.target.value)}
                placeholder="finance@atlas.ai"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization-plan">Plan</Label>
              <select
                id="organization-plan"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={plan}
                onChange={(event) => setPlan(event.target.value as typeof organization.plan)}
              >
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <Button type="submit">Save organization</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="border-border/70 bg-card/40">
        <CardHeader>
          <CardTitle>Active project</CardTitle>
          <CardDescription>Adjust the details for the currently selected project.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProjectSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Support assistant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Input
                id="project-description"
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder="Describe what this project powers"
              />
            </div>
            <Button type="submit">Save project</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

