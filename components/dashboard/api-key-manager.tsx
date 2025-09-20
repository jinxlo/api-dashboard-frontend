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

interface ApiKeyRecord {
  id: string;
  key: string;
  createdAt: string;
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function maskKey(key: string) {
  if (key.length <= 8) return key;
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<ApiKeyRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadKeys = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void loadKeys();
  }, [loadKeys]);

  const handleGenerate = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/keys", {
        method: "POST",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Unable to generate key" }));
        throw new Error(data?.message ?? "Unable to generate key");
      }
      const data = await response.json();
      setCreatedKey(data);
      setModalOpen(true);
      await loadKeys();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to generate key");
    } finally {
      setIsLoading(false);
    }
  }, [loadKeys]);

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

  const maskedKeys = useMemo(() => keys.map((item) => ({ ...item, displayKey: maskKey(item.key) })), [keys]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">API keys</h2>
          <p className="text-sm text-muted-foreground">
            Generate and manage the credentials that authenticate your requests through the Atlas AI gateway.
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isLoading} className="self-start">
          + Generate new key
        </Button>
      </div>
      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-md border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                Key
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
            {maskedKeys.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  {isLoading ? "Loading keys…" : "No keys found. Generate one to get started."}
                </td>
              </tr>
            ) : (
              maskedKeys.map((key) => (
                <tr key={key.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{key.displayKey}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dateFormatter.format(new Date(key.createdAt))}
                  </td>
                  <td className="px-4 py-3 text-right">
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New API key generated</DialogTitle>
            <DialogDescription>
              This is the only time we will show you the full key. Store it securely before leaving this page.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-dashed border-primary/40 bg-primary/5 p-4 font-mono text-sm">
            {createdKey?.key}
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
            <Button onClick={() => setModalOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
