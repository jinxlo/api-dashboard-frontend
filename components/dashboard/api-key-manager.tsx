"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

import type { ModelCategory } from "@/lib/models";
import { modelCatalog } from "@/lib/models";

interface ApiModel {
  id: string;
  name: string;
  category: ModelCategory;
}

interface ApiKeyRecord {
  id: string;
  key: string;
  createdAt: string;
  label: string | null;
  models: ApiModel[];
}

type GeneratedKey = ApiKeyRecord;

const categoryLabels: Record<ModelCategory, string> = {
  llm: "Language",
  tts: "Speech",
  image: "Vision",
};

const filters: { id: "all" | ModelCategory; label: string }[] = [
  { id: "all", label: "All keys" },
  { id: "llm", label: "Language" },
  { id: "tts", label: "Speech" },
  { id: "image", label: "Vision" },
];

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function maskKey(key: string) {
  if (key.length <= 12) return key;
  return `${key.slice(0, 6)}••••${key.slice(-4)}`;
}

function formatModelList(models: ApiModel[]) {
  if (models.length === 0) {
    return "Unscoped";
  }
  if (models.length === 1) {
    return models[0].name;
  }
  if (models.length === 2) {
    return `${models[0].name} + ${models[1].name}`;
  }
  return `${models[0].name} +${models.length - 1}`;
}

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [models, setModels] = useState<ApiModel[]>(() =>
    modelCatalog.map((model) => ({ id: model.id, name: model.name, category: model.category })),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formModelIds, setFormModelIds] = useState<string[]>([]);
  const [createdKey, setCreatedKey] = useState<GeneratedKey | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const loadModels = useCallback(async () => {
    try {
      const response = await fetch("/api/models", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load models");
      }
      const data = await response.json();
      if (Array.isArray(data.models)) {
        setModels(
          data.models.map((model: ApiModel) => ({
            id: model.id,
            name: model.name,
            category: model.category,
          })),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadKeys = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/keys", { cache: "no-store" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Unable to load API keys" }));
        throw new Error(data?.message ?? "Unable to load API keys");
      }
      const data = await response.json();
      setKeys(Array.isArray(data.keys) ? data.keys : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to load API keys");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadModels();
    void loadKeys();
  }, [loadModels, loadKeys]);

  const filteredKeys = useMemo(() => {
    if (filter === "all") return keys;
    return keys.filter((key) => key.models.some((model) => model.category === filter));
  }, [filter, keys]);

  const summaryByCategory = useMemo(() => {
    return keys.reduce(
      (acc, key) => {
        key.models.forEach((model) => {
          acc[model.category] = (acc[model.category] ?? 0) + 1;
        });
        return acc;
      },
      {} as Record<ModelCategory, number>,
    );
  }, [keys]);

  const handleDelete = useCallback(
    async (keyId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/keys/${keyId}`, { method: "DELETE" });
        if (!response.ok) {
          const data = await response.json().catch(() => ({ message: "Unable to revoke key" }));
          throw new Error(data?.message ?? "Unable to revoke key");
        }
        await loadKeys();
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to revoke key");
      } finally {
        setIsLoading(false);
      }
    },
    [loadKeys],
  );

  const openCreateDialog = useCallback(() => {
    setFormLabel("");
    setFormModelIds(models.length ? [models[0].id] : []);
    setCreateError(null);
    setCreateOpen(true);
  }, [models]);

  const toggleModelSelection = useCallback((modelId: string) => {
    setFormModelIds((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      }
      return [...prev, modelId];
    });
  }, []);

  const handleGenerate = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (formModelIds.length === 0) {
        setCreateError("Select at least one model to scope the key.");
        return;
      }
      try {
        setIsLoading(true);
        setCreateError(null);
        const response = await fetch("/api/keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: formLabel || undefined, modelIds: formModelIds }),
        });
        const data = await response.json().catch(() => ({ message: "Unable to generate key" }));
        if (!response.ok) {
          throw new Error(data?.message ?? "Unable to generate key");
        }
        const generated: GeneratedKey = data;
        setCreatedKey(generated);
        setShowKeyModal(true);
        setCreateOpen(false);
        await loadKeys();
      } catch (err) {
        console.error(err);
        setCreateError(err instanceof Error ? err.message : "Unable to generate key");
      } finally {
        setIsLoading(false);
      }
    },
    [formLabel, formModelIds, loadKeys],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filters
          .filter((filterOption) => filterOption.id !== "all")
          .map((filterOption) => (
            <div
              key={filterOption.id}
              className="rounded-lg border border-border/60 bg-card/40 p-4 shadow-sm"
            >
              <p className="text-sm text-muted-foreground">{filterOption.label}</p>
              <p className="mt-2 text-2xl font-semibold">
                {summaryByCategory[filterOption.id as ModelCategory] ?? 0}
              </p>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">API keys</h2>
          <p className="text-sm text-muted-foreground">
            Generate environment-scoped credentials for the Atlas API and control which models each key can access.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active workspace
          </div>
          <Button onClick={openCreateDialog} disabled={isLoading || models.length === 0} className="sm:self-start">
            + New access key
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        {filters.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={filter === item.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                Key
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                Models
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                Created
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card/40">
            {filteredKeys.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  {isLoading ? "Loading keys…" : "No keys found. Generate one to get started."}
                </td>
              </tr>
            ) : (
              filteredKeys.map((key) => (
                <tr key={key.id}>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{key.label ?? formatModelList(key.models)}</p>
                      <p className="font-mono text-xs text-muted-foreground">{maskKey(key.key)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {key.models.map((model) => (
                        <span
                          key={model.id}
                          className="inline-flex items-center rounded-full border border-border/70 bg-background px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          {categoryLabels[model.category]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dateFormatter.format(new Date(key.createdAt))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(key.key)}
                        disabled={isLoading}
                      >
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(key.id)} disabled={isLoading}>
                        Revoke
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new API key</DialogTitle>
            <DialogDescription>
              Scope the key to the models your integration needs. You can rotate or revoke keys at any time.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="key-label">Label</Label>
              <Input
                id="key-label"
                placeholder="Production webhook"
                value={formLabel}
                onChange={(event) => setFormLabel(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Optional. Shown only within this dashboard to help you recognise each key.
              </p>
            </div>
            <div className="space-y-3">
              <Label>Model access</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {models.map((model) => {
                  const isSelected = formModelIds.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => toggleModelSelection(model.id)}
                      className={`rounded-lg border px-3 py-3 text-left transition ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background hover:border-foreground/40"
                      }`}
                    >
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{categoryLabels[model.category]}</p>
                    </button>
                  );
                })}
              </div>
              {createError ? <p className="text-sm text-destructive">{createError}</p> : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating…" : "Create key"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showKeyModal} onOpenChange={setShowKeyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New API key generated</DialogTitle>
            <DialogDescription>
              This is the only time we will show you the full key. Store it securely before leaving this page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {createdKey?.label ? (
              <p className="text-sm font-medium text-foreground">{createdKey.label}</p>
            ) : null}
            <div className="rounded-md border border-dashed border-primary/40 bg-primary/5 p-4 font-mono text-sm">
              {createdKey?.key}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {createdKey?.models.map((model) => (
                <span key={model.id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {categoryLabels[model.category]}
                </span>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (createdKey?.key) {
                  void navigator.clipboard.writeText(createdKey.key);
                }
              }}
            >
              Copy key
            </Button>
            <Button onClick={() => setShowKeyModal(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
