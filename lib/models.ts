export type ModelCategory = "llm" | "tts" | "image";

export interface ModelDefinition {
  id: string;
  name: string;
  category: ModelCategory;
  shortDescription: string;
  contextWindow?: number;
  defaultUseCase: string;
  release: string;
  latency?: string;
}

export const modelCatalog: ModelDefinition[] = [
  {
    id: "atlas-llm-pro",
    name: "Atlas LLM Pro",
    category: "llm",
    shortDescription: "Flagship reasoning model with 200K token context window.",
    contextWindow: 200_000,
    defaultUseCase: "Enterprise knowledge copilots and complex orchestration pipelines.",
    release: "2025.03",
    latency: "~1.8s first token",
  },
  {
    id: "atlas-llm-lite",
    name: "Atlas LLM Lite",
    category: "llm",
    shortDescription: "Cost optimised chat model tuned for fast support flows.",
    contextWindow: 64_000,
    defaultUseCase: "Customer support assistants, lightweight automations, summarisation.",
    release: "2025.01",
    latency: "~900ms first token",
  },
  {
    id: "atlas-llm-code",
    name: "Atlas LLM Code",
    category: "llm",
    shortDescription: "Code generation specialist with repository level context ingest.",
    contextWindow: 128_000,
    defaultUseCase: "Pair programming, migration assistance, static analysis with natural language outputs.",
    release: "2024.12",
    latency: "~2.2s first token",
  },
  {
    id: "atlas-voice-studio",
    name: "Atlas Voice Studio",
    category: "tts",
    shortDescription: "Neural TTS with expressive prosody controls and 20+ voices.",
    defaultUseCase: "Interactive voice assistants, localisation pipelines, marketing content.",
    release: "2025.02",
    latency: "Streaming <250ms",
  },
  {
    id: "atlas-voice-lite",
    name: "Atlas Voice Lite",
    category: "tts",
    shortDescription: "Lightweight speech synthesis ideal for IVR and IoT devices.",
    defaultUseCase: "Transaction notifications, embedded devices, accessibility cues.",
    release: "2024.11",
    latency: "Streaming <180ms",
  },
  {
    id: "atlas-vision-diffuse",
    name: "Atlas Vision Diffuse",
    category: "image",
    shortDescription: "Text-to-image diffusion tuned for photorealistic renders.",
    defaultUseCase: "Product marketing visuals, concept art, virtual staging.",
    release: "2025.04",
    latency: "1.4s per frame",
  },
  {
    id: "atlas-vision-illustrate",
    name: "Atlas Vision Illustrate",
    category: "image",
    shortDescription: "Illustration focused diffusion with stylised control presets.",
    defaultUseCase: "Storyboarding, editorial artwork, motion graphic frames.",
    release: "2024.10",
    latency: "1.1s per frame",
  },
];

const modelMap = new Map(modelCatalog.map((model) => [model.id, model]));

export function getModelById(modelId: string): ModelDefinition | undefined {
  return modelMap.get(modelId);
}
