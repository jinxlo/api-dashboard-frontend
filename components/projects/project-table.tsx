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
import { useLocale, useTranslations } from "@/components/providers/locale-provider";

const regionCodes = ["iad1", "sfo3", "fra1", "sin1"] as const;
type RegionCode = (typeof regionCodes)[number];

export function ProjectTable() {
  const { locale } = useLocale();
  const t = useTranslations();
  const { organization, project, addProject, selectProject, updateProject } = useWorkspace();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState<RegionCode>("iad1");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const availableRegions = useMemo(
    () =>
      regionCodes.map((code) => ({
        value: code,
        label: t(`projects.regions.${code}` as const),
      })),
    [t],
  );

  const statusLabels = useMemo(
    () => ({
      Active: t("projects.status.active"),
      "In review": t("projects.status.review"),
      Paused: t("projects.status.paused"),
    }),
    [t],
  );

  useEffect(() => {
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    );
  }, [name]);

  useEffect(() => {
    setRegion(availableRegions[0]?.value ?? "iad1");
  }, [availableRegions]);

  const projects = useMemo(() => organization.projects, [organization.projects]);

  const handleCreateProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    const created = addProject(organization.id, {
      name: name.trim(),
      slug: slug || name.trim().toLowerCase().replace(/\s+/g, "-"),
      region,
      status: "Active",
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
          <p className="text-sm text-muted-foreground">{t("projects.table.intro")}</p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          + {t("projects.dialog.submit")}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card/40">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                {t("projects.table.name")}
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                {t("projects.table.region")}
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                {t("projects.table.status")}
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                {t("projects.table.created")}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                {t("projects.table.actions")}
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
                      defaultValue={item.description ?? t("projects.table.placeholder")}
                      onBlur={(event) => handleDescriptionBlur(item.id, event.target.value)}
                      className="w-full bg-transparent text-xs text-muted-foreground focus:outline-none focus:ring-0"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.region.toUpperCase()}</td>
                <td className="px-4 py-3 text-muted-foreground">{statusLabels[item.status]}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant={project.id === item.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => selectProject(item.id)}
                    >
                      {project.id === item.id ? t("projects.table.active") : t("projects.table.setActive")}
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
            <DialogTitle>{t("projects.dialog.title")}</DialogTitle>
            <DialogDescription>{t("projects.dialog.body")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project-name">{t("projects.dialog.name")}</Label>
              <Input
                id="project-name"
                placeholder={t("projects.dialog.namePlaceholder")}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-slug">{t("projects.dialog.slug")}</Label>
              <Input
                id="project-slug"
                placeholder={t("projects.dialog.slugPlaceholder")}
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-region">{t("projects.dialog.region")}</Label>
              <select
                id="project-region"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={region}
                onChange={(event) => setRegion(event.target.value as RegionCode)}
              >
                {availableRegions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">{t("projects.dialog.descriptionLabel")}</Label>
              <Input
                id="project-description"
                placeholder={t("projects.dialog.descriptionPlaceholder")}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {t("projects.dialog.cancel")}
              </Button>
              <Button type="submit">{t("projects.dialog.submit")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
