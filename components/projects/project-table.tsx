"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/components/providers/workspace-provider";

const availableRegions = [
  { value: "iad1", label: "iad1 · US East" },
  { value: "sfo3", label: "sfo3 · US West" },
  { value: "fra1", label: "fra1 · EU Central" },
  { value: "sin1", label: "sin1 · AP Southeast" },
];

export function ProjectTable() {
  const { organization, project, addProject, selectProject, updateProject } = useWorkspace();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState(availableRegions[0]?.value ?? "iad1");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  }, [name]);

  const projects = useMemo(() => organization.projects, [organization.projects]);

  const handleCreateProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    const created = addProject(organization.id, {
      name: name.trim(),
      slug: slug || name.trim().toLowerCase().replace(/\s+/g, "-"),
      region,
      status: "In review",
      description: description.trim() || undefined,
    });

    if (created) {
      setDialogOpen(false);
      setName("");
      setSlug("");
      setDescription("");
      setRegion(availableRegions[0]?.value ?? "iad1");
    }
  };

  const handleDescriptionBlur = (projectId: string, value: string) => {
    updateProject(organization.id, projectId, { description: value.trim() || undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Projects group credentials, usage, and auditing for a specific surface area.
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          + New project
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card/40">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                Region
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                Created
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background/40">
            {projects.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <input
                      defaultValue={item.description ?? "Add a short description"}
                      onBlur={(event) => handleDescriptionBlur(item.id, event.target.value)}
                      className="w-full bg-transparent text-xs text-muted-foreground focus:outline-none focus:ring-0"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.region.toUpperCase()}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.status}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant={project.id === item.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => selectProject(item.id)}
                    >
                      {project.id === item.id ? "Active" : "Set active"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new project</DialogTitle>
            <DialogDescription>
              Projects isolate API credentials, quotas, and metrics. You can switch between them at any time.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                placeholder="My production app"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-slug">Slug</Label>
              <Input
                id="project-slug"
                placeholder="my-production-app"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-region">Region</Label>
              <select
                id="project-region"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
              >
                {availableRegions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Input
                id="project-description"
                placeholder="What does this project power?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

