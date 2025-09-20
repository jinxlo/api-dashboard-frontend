import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { getModelById } from "@/lib/models";

const bodySchema = z.object({
  text: z.string().min(1, { message: "Provide text to synthesise" }).max(800, { message: "Keep prompts under 800 characters" }),
  voice: z.string().min(1).max(40).default("elysian"),
  model: z.string().default("atlas-voice-studio"),
  format: z.enum(["mp3", "wav"]).default("wav"),
});

function generatePlaceholderWav(durationSeconds = 1.6, frequency = 440, sampleRate = 16000) {
  const sampleCount = Math.floor(durationSeconds * sampleRate);
  const buffer = Buffer.alloc(44 + sampleCount * 2);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + sampleCount * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(sampleCount * 2, 40);

  for (let i = 0; i < sampleCount; i += 1) {
    const time = i / sampleRate;
    const amplitude = Math.sin(2 * Math.PI * frequency * time) * 0.2;
    buffer.writeInt16LE(Math.round(amplitude * 32767), 44 + i * 2);
  }

  return `data:audio/wav;base64,${buffer.toString("base64")}`;
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid payload";
      return NextResponse.json({ message }, { status: 400 });
    }

    const { text, voice, model, format } = parsed.data;
    const resolvedModel = getModelById(model);

    if (!resolvedModel || resolvedModel.category !== "tts") {
      return NextResponse.json({ message: "Selected model is not enabled for speech synthesis" }, { status: 400 });
    }

    const tone = 220 + ((text.length * 13) % 220);
    const previewAudio = generatePlaceholderWav(1.6, tone);

    const gatewayUrl = process.env.NEXT_PUBLIC_KONG_API_URL;
    const ttsKey = process.env.KONG_TTS_KEY ?? process.env.KONG_PLAYGROUND_KEY;

    if (!gatewayUrl || !ttsKey) {
      return NextResponse.json({
        configured: false,
        message: "TTS service is not configured. Returning a placeholder tone for preview purposes.",
        audio: previewAudio,
        voice,
        model,
        format,
      });
    }

    // Placeholder response even when configured to avoid unexpected failures in preview environments.
    return NextResponse.json({
      configured: true,
      message: "Replace the placeholder implementation in app/api/playground/tts to call your production speech endpoint.",
      audio: previewAudio,
      voice,
      model,
      format,
    });
  } catch (error) {
    console.error("TTS playground request failed", error);
    return NextResponse.json(
      {
        message: "Unable to process text-to-speech request",
      },
      { status: 500 },
    );
  }
}
