"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ModelCategory } from "@/lib/models";
import { modelCatalog } from "@/lib/models";

interface PlaygroundModel {
  id: string;
  name: string;
  category: ModelCategory;
  shortDescription?: string;
}

type PlaygroundMode = "llm" | "tts" | "image";

const modeConfig: { id: PlaygroundMode; label: string; description: string }[] = [
  { id: "llm", label: "Language", description: "Chat with Atlas LLMs to evaluate responses." },
  { id: "tts", label: "Speech", description: "Convert text to lifelike audio across neural voices." },
  { id: "image", label: "Vision", description: "Prototype photorealistic or illustrated imagery." },
];

const fallbackModels: PlaygroundModel[] = modelCatalog.map((model) => ({
  id: model.id,
  name: model.name,
  category: model.category,
  shortDescription: model.shortDescription,
}));

const voiceOptions = [
  { id: "elysian", label: "Elysian · Conversational" },
  { id: "solstice", label: "Solstice · Warm" },
  { id: "ion", label: "Ion · Crisp" },
  { id: "lumen", label: "Lumen · Narration" },
];

const stylePresets = [
  "Photoreal", "Editorial", "Concept", "Cyberpunk", "Watercolour", "Line art",
];

interface PlaygroundMessage {
  role: "user" | "assistant";
  content: string;
}

export function PlaygroundPanel() {
  const [models, setModels] = useState<PlaygroundModel[]>(fallbackModels);
  const [activeMode, setActiveMode] = useState<PlaygroundMode>("llm");

  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch("/api/models", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!Array.isArray(data.models)) return;
        setModels(
          data.models.map((model: PlaygroundModel) => ({
            id: model.id,
            name: model.name,
            category: model.category,
            shortDescription: model.shortDescription,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };

    void loadModels();
  }, []);

  const llmModels = useMemo(() => models.filter((model) => model.category === "llm"), [models]);
  const ttsModels = useMemo(() => models.filter((model) => model.category === "tts"), [models]);
  const imageModels = useMemo(() => models.filter((model) => model.category === "image"), [models]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {modeConfig.map((mode) => (
          <Button
            key={mode.id}
            type="button"
            size="sm"
            variant={activeMode === mode.id ? "default" : "outline"}
            onClick={() => setActiveMode(mode.id)}
          >
            {mode.label}
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {modeConfig.find((mode) => mode.id === activeMode)?.description}
      </p>

      {activeMode === "llm" ? <LanguagePlayground models={llmModels} /> : null}
      {activeMode === "tts" ? <SpeechPlayground models={ttsModels} /> : null}
      {activeMode === "image" ? <ImagePlayground models={imageModels} /> : null}
    </div>
  );
}

interface LanguagePlaygroundProps {
  models: PlaygroundModel[];
}

function LanguagePlayground({ models }: LanguagePlaygroundProps) {
  const [model, setModel] = useState(models[0]?.id ?? "atlas-llm-pro");
  const [temperature, setTemperature] = useState(0.7);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    if (models.length && !models.some((item) => item.id === model)) {
      setModel(models[0].id);
    }
  }, [models, model]);

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
  -d '{"model":"${model}","temperature":${temperature.toFixed(2)},"messages":[{"role":"user","content":"${sanitizedPrompt}"}]}'`;
  }, [model, prompt, temperature]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    const trimmedPrompt = prompt.trim();
    const nextMessages: PlaygroundMessage[] = [...messages, { role: "user", content: trimmedPrompt }];
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

      const reply: PlaygroundMessage = {
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
          content: "We could not load a response from the model. Please verify your configuration and try again.",
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
            <Label htmlFor="llm-model">Model</Label>
            <select
              id="llm-model"
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
              Temperature controls randomness. Lower values make responses more deterministic, while higher values introduce more creativity.
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
                <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
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

interface SpeechPlaygroundProps {
  models: PlaygroundModel[];
}

function SpeechPlayground({ models }: SpeechPlaygroundProps) {
  const [model, setModel] = useState(models[0]?.id ?? "atlas-voice-studio");
  const [voice, setVoice] = useState(voiceOptions[0].id);
  const [script, setScript] = useState("Welcome to the Atlas platform. This sample demonstrates our neural voices.");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (models.length && !models.some((item) => item.id === model)) {
      setModel(models[0].id);
    }
  }, [models, model]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!script.trim()) return;
    setIsLoading(true);
    setStatus(null);
    setAudioUrl(null);

    try {
      const response = await fetch("/api/playground/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script.trim(), model, voice }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to synthesise speech");
      }
      if (typeof data.audio === "string") {
        setAudioUrl(data.audio);
      }
      setStatus(data?.message ?? "Playback ready");
    } catch (err) {
      console.error(err);
      setStatus(err instanceof Error ? err.message : "Unable to synthesise speech");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Speech</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tts-model">Model</Label>
              <select
                id="tts-model"
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
              <Label htmlFor="tts-voice">Voice</Label>
              <select
                id="tts-voice"
                value={voice}
                onChange={(event) => setVoice(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {voiceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tts-script">Script</Label>
            <Textarea
              id="tts-script"
              value={script}
              onChange={(event) => setScript(event.target.value)}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">Preview up to 800 characters per request.</p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Synthesising…" : "Generate audio"}
            </Button>
          </div>
        </form>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        {audioUrl ? (
          <div className="space-y-2">
            <Label>Preview</Label>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

interface ImagePlaygroundProps {
  models: PlaygroundModel[];
}

function ImagePlayground({ models }: ImagePlaygroundProps) {
  const [model, setModel] = useState(models[0]?.id ?? "atlas-vision-diffuse");
  const [prompt, setPrompt] = useState("Ultra-detailed render of a satellite orbit control room with holographic displays");
  const [style, setStyle] = useState<string | undefined>(stylePresets[0]);
  const [variations, setVariations] = useState(2);
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (models.length && !models.some((item) => item.id === model)) {
      setModel(models[0].id);
    }
  }, [models, model]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    setStatus(null);
    setImages([]);

    try {
      const response = await fetch("/api/playground/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), model, style, variations, aspectRatio: "1:1" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to generate imagery");
      }
      if (Array.isArray(data.images)) {
        setImages(data.images);
      }
      setStatus(data?.message ?? "Preview imagery ready");
    } catch (err) {
      console.error(err);
      setStatus(err instanceof Error ? err.message : "Unable to generate imagery");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="image-model">Model</Label>
              <select
                id="image-model"
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
              <Label htmlFor="image-style">Style preset</Label>
              <select
                id="image-style"
                value={style ?? ""}
                onChange={(event) => setStyle(event.target.value || undefined)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">No preset</option>
                {stylePresets.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-variations">Variations</Label>
              <Input
                id="image-variations"
                type="number"
                min={1}
                max={4}
                value={variations}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  if (!Number.isNaN(nextValue)) {
                    setVariations(Math.max(1, Math.min(4, nextValue)));
                  }
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-prompt">Prompt</Label>
            <Textarea
              id="image-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Rendering…" : "Generate preview"}
            </Button>
          </div>
        </form>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        {images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-border">
                <Image
                  src={image}
                  alt={`Generated preview ${index + 1}`}
                  width={512}
                  height={512}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
