"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import type { ModelCategory } from "@/lib/models";

interface ApiModel {
  id: string;
  name: string;
  category: ModelCategory;
}

interface ApiKeyRecord {
  id: string;
  key: string;
  label: string | null;
  createdAt: string;
  models: ApiModel[];
}

const categoryLabels: Record<ModelCategory, string> = {
  llm: "Language",
  tts: "Speech",
  image: "Vision",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

function maskKey(key: string) {
  if (key.length <= 12) return key;
  return `${key.slice(0, 6)}••••${key.slice(-4)}`;
}

export function ApiKeyOverview() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKeys = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/keys", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load API keys");
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
    };

    void loadKeys();
  }, []);

  const latestKeys = useMemo(() => {
    return [...keys]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [keys]);

  const summary = useMemo(() => {
    return keys.reduce(
      (acc, key) => {
        key.models.forEach((model) => {
          acc[model.category] = (acc[model.category] ?? 0) + 1;
        });
        if (key.models.length === 0) {
          acc.unscoped = (acc.unscoped ?? 0) + 1;
        }
        return acc;
      },
      { unscoped: 0 } as Record<string, number>,
    );
  }, [keys]);

  return (
    <div className="space-y-5 text-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {Object.entries(summary)
          .filter(([, count]) => count > 0)
          .map(([category, count]) => (
            <span key={category} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {category === "unscoped" ? "Unscoped" : categoryLabels[category as ModelCategory]} · {count}
            </span>
          ))}
        {keys.length === 0 ? <span>No keys yet</span> : null}
      </div>

      <div className="space-y-4">
        {error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">{error}</div>
        ) : null}
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="animate-pulse rounded-lg border border-border/60 bg-muted/30 p-4">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="mt-2 h-3 w-48 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : latestKeys.length === 0 ? (
          <div className="rounded-lg border border-border/60 bg-muted/20 p-6 text-center text-muted-foreground">
            Generate an API key to connect your first integration.
          </div>
        ) : (
          <ul className="space-y-3">
            {latestKeys.map((key) => (
              <li key={key.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{key.label ?? "Untitled key"}</p>
                    <p className="font-mono text-xs text-muted-foreground">{maskKey(key.key)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{dateFormatter.format(new Date(key.createdAt))}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {key.models.length === 0 ? (
                    <span className="inline-flex items-center rounded-full border border-border/50 bg-muted/40 px-2 py-0.5">
                      Unscoped access
                    </span>
                  ) : (
                    key.models.map((model) => (
                      <span
                        key={model.id}
                        className="inline-flex items-center rounded-full border border-border/50 bg-muted/40 px-2 py-0.5"
                      >
                        {categoryLabels[model.category]}
                      </span>
                    ))
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        Rotate production credentials regularly. <Link href="/docs" className="font-medium text-foreground hover:underline">Review the hardening checklist</Link> before deploying to customers.
      </div>
    </div>
  );
}

