"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import { useLocale, useTranslations } from "@/components/providers/locale-provider";

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

function maskKey(value: string) {
  if (value.length <= 10) return value;
  return `${value.slice(0, 5)}••••${value.slice(-4)}`;
}

export function ApiKeyManager() {
  const { locale } = useLocale();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [locale],
  );
  const categoryLabels = useMemo(
    () => ({
      llm: t("apiKeys.filters.language"),
      tts: t("apiKeys.filters.speech"),
      image: t("apiKeys.filters.vision"),
    }),
    [t],
  );

  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [models, setModels] = useState<ApiModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formModelIds, setFormModelIds] = useState<string[]>([]);
  const [createdKey, setCreatedKey] = useState<GeneratedKey | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setCreateOpen(true);
      setFormLabel("");
      setFormModelIds(models.length ? [models[0].id] : []);
      router.replace("/keys", { scroll: false });
    }
  }, [models, router, searchParams]);

  useEffect(() => {
    if (createOpen && models.length > 0 && formModelIds.length === 0) {
      setFormModelIds([models[0].id]);
    }
  }, [createOpen, formModelIds.length, models]);

  const loadModels = useCallback(async () => {
    try {
      const response = await fetch("/api/models", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(t("apiKeys.errors.models"));
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
      } else {
        setModels(
          modelCatalog.map((model) => ({
            id: model.id,
            name: model.name,
            category: model.category,
          })),
        );
      }
    } catch (err) {
      console.error(err);
      setModels(
        modelCatalog.map((model) => ({
          id: model.id,
          name: model.name,
          category: model.category,
        })),
      );
      setError(t("apiKeys.errors.models"));
    }
  }, [t]);

  const loadKeys = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/keys", { cache: "no-store" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: t("apiKeys.errors.load") }));
        if (response.status === 503) {
          throw new Error(t("apiKeys.errors.database"));
        }
        throw new Error(data?.message ?? t("apiKeys.errors.load"));
      }
      const data = await response.json();
      setKeys(Array.isArray(data.keys) ? data.keys : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setKeys([]);
      setError(err instanceof Error ? err.message : t("apiKeys.errors.load"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadModels();
    void loadKeys();
  }, [loadModels, loadKeys]);

  const openCreateDialog = useCallback(() => {
    setFormLabel("");
    setFormModelIds(models.length ? [models[0].id] : []);
    setCreateError(null);
    setCreateOpen(true);
  }, [models]);

  const toggleModelSelection = useCallback((modelId: string) => {
    setFormModelIds((previous) => {
      if (previous.includes(modelId)) {
        return previous.filter((id) => id !== modelId);
      }
      return [...previous, modelId];
    });
  }, []);

  const handleGenerate = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (formModelIds.length === 0) {
        setCreateError(t("apiKeys.dialog.error"));
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
        const data = await response.json().catch(() => ({ message: t("apiKeys.errors.generate") }));
        if (!response.ok) {
          if (response.status === 503) {
            throw new Error(t("apiKeys.errors.database"));
          }
          throw new Error(data?.message ?? t("apiKeys.errors.generate"));
        }
        setCreatedKey(data as GeneratedKey);
        setShowKeyModal(true);
        setCreateOpen(false);
        await loadKeys();
      } catch (err) {
        console.error(err);
        setCreateError(err instanceof Error ? err.message : t("apiKeys.errors.generate"));
      } finally {
        setIsLoading(false);
      }
    },
    [formLabel, formModelIds, loadKeys, t],
  );

  const handleDelete = useCallback(
    async (keyId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/keys/${keyId}`, { method: "DELETE" });
        const data = await response.json().catch(() => ({ message: t("apiKeys.errors.revoke") }));
        if (!response.ok) {
          if (response.status === 503) {
            throw new Error(t("apiKeys.errors.database"));
          }
          throw new Error(data?.message ?? t("apiKeys.errors.revoke"));
        }
        await loadKeys();
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : t("apiKeys.errors.revoke"));
      } finally {
        setIsLoading(false);
      }
    },
    [loadKeys, t],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{t("apiKeys.heading")}</h2>
          <p className="text-sm text-muted-foreground">{t("apiKeys.description")}</p>
        </div>
        <Button onClick={openCreateDialog} disabled={isLoading || models.length === 0}>
          + {t("apiKeys.create")}
        </Button>
      </div>

      {error ? <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                {t("apiKeys.table.label")}
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                {t("apiKeys.table.models")}
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                {t("apiKeys.table.created")}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                {t("apiKeys.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card/40">
            {keys.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  {isLoading ? t("apiKeys.loading") : t("apiKeys.table.empty")}
                </td>
              </tr>
            ) : (
              keys.map((key) => (
                <tr key={key.id}>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{key.label ?? t("dashboard.keyLabelFallback")}</p>
                      <p className="font-mono text-xs text-muted-foreground">{maskKey(key.key)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {key.models.length === 0 ? (
                        <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-2 py-0.5 text-xs text-muted-foreground">
                          {t("apiKeys.list.unscoped")}
                        </span>
                      ) : (
                        key.models.map((model) => (
                          <span
                            key={model.id}
                            className="inline-flex items-center rounded-full border border-border/70 bg-background px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {model.name}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{dateFormatter.format(new Date(key.createdAt))}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(key.key)}
                        disabled={isLoading}
                      >
                        {t("apiKeys.table.copy")}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(key.id)} disabled={isLoading}>
                        {t("apiKeys.table.revoke")}
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
            <DialogTitle>{t("apiKeys.dialog.title")}</DialogTitle>
            <DialogDescription>{t("apiKeys.dialog.description")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="key-label">{t("apiKeys.dialog.label")}</Label>
              <Input
                id="key-label"
                placeholder={t("apiKeys.dialog.labelPlaceholder")}
                value={formLabel}
                onChange={(event) => setFormLabel(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("apiKeys.dialog.labelHelp")}</p>
            </div>
            <div className="space-y-3">
              <Label>{t("apiKeys.dialog.modelAccess")}</Label>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {models.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border/70 px-3 py-4 text-sm text-muted-foreground">
                    {t("apiKeys.errors.models")}
                  </p>
                ) : (
                  models.map((model) => {
                    const isSelected = formModelIds.includes(model.id);
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => toggleModelSelection(model.id)}
                        className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background hover:border-foreground/40"
                        }`}
                      >
                        <p className="font-medium">{model.name}</p>
                        <p className="text-xs text-muted-foreground">{categoryLabels[model.category]}</p>
                      </button>
                    );
                  })
                )}
              </div>
              {createError ? <p className="text-sm text-destructive">{createError}</p> : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                {t("apiKeys.dialog.cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("apiKeys.dialog.generating") : t("apiKeys.dialog.submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showKeyModal} onOpenChange={setShowKeyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("apiKeys.generated.title")}</DialogTitle>
            <DialogDescription>{t("apiKeys.generated.description")}</DialogDescription>
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
                  {model.name}
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
              {t("apiKeys.generated.copy")}
            </Button>
            <Button onClick={() => setShowKeyModal(false)}>{t("apiKeys.generated.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
