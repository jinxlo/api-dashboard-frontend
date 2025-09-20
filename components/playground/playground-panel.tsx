"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const models = [
  { id: "atlas-large", name: "Atlas Large" },
  { id: "atlas-lite", name: "Atlas Lite" },
  { id: "atlas-code", name: "Atlas Code" },
];

export function PlaygroundPanel() {
  const [model, setModel] = useState(models[0].id);
  const [temperature, setTemperature] = useState(0.7);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);

  const codeSnippet = useMemo(() => {
    const maskedKey = "sk-YOUR-API-KEY";
    const sanitizedPrompt = prompt
      .replace(/\\/g, "\\\\")
      .replace(/\"/g, '\\"')
      .replace(/\n/g, "\\n");

    const baseUrl = process.env.NEXT_PUBLIC_KONG_API_URL ?? "https://api.example.com";

    return `curl -X POST ${baseUrl}/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${maskedKey}" \
  -d '{\"model\":\"${model}\",\"temperature\":${temperature.toFixed(2)},\"messages\":[{\"role\":\"user\",\"content\":\"${sanitizedPrompt}\"}]}'`;
  }, [model, prompt, temperature]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    const trimmedPrompt = prompt.trim();
    const nextMessages: Message[] = [...messages, { role: "user", content: trimmedPrompt }];
    setMessages(nextMessages);
    setPrompt("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/playground/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmedPrompt, model, temperature }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to contact the model");
      }

      const reply: Message = {
        role: "assistant",
        content: typeof data.response === "string" ? data.response : "Received an unexpected response.",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to contact the model");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "We could not load a response from the model. Please check your configuration and try again shortly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Request settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <select
              id="model"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {models.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <div className="flex items-center gap-3">
              <input
                id="temperature"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={temperature}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  if (!Number.isNaN(nextValue)) {
                    setTemperature(Math.min(1, Math.max(0, nextValue)));
                  }
                }}
                className="w-full"
              />
              <Input
                type="number"
                value={temperature}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  if (!Number.isNaN(nextValue)) {
                    setTemperature(Math.min(1, Math.max(0, nextValue)));
                  }
                }}
                min={0}
                max={1}
                step={0.05}
                className="w-20"
              />
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Temperature controls randomness. Lower values make responses more deterministic, while higher values introduce more
              creativity.
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowCode((prev) => !prev)}>
            {showCode ? "Hide code sample" : "View code sample"}
          </Button>
          {showCode ? (
            <pre className="max-h-64 overflow-auto rounded-md border border-border bg-muted/40 p-4 text-xs">
              <code>{codeSnippet}</code>
            </pre>
          ) : null}
        </CardContent>
      </Card>

      <Card className="flex h-[700px] flex-col">
        <CardHeader>
          <CardTitle>Playground</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col space-y-4">
          <div className="flex-1 space-y-4 overflow-y-auto rounded-md border border-border bg-background p-4">
            {messages.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Start a conversation by entering a prompt below. Responses from the model will appear here.
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xl rounded-lg px-4 py-3 text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {isLoading ? <div className="text-sm text-muted-foreground">Model is thinking…</div> : null}
          </div>
          {error ? <div className="text-sm text-destructive">{error}</div> : null}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask the Atlas model a question…"
              rows={4}
              required
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending…" : "Send"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
