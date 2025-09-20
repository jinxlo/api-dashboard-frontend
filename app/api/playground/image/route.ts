import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { getModelById } from "@/lib/models";

const bodySchema = z.object({
  prompt: z.string().min(1, { message: "Enter a prompt" }).max(400, { message: "Prompt too long" }),
  model: z.string().default("atlas-vision-diffuse"),
  style: z.string().max(32).optional(),
  aspectRatio: z.string().default("1:1"),
  variations: z.coerce.number().min(1).max(4).default(2),
});

function createPlaceholderImage(prompt: string, style: string | undefined, index: number) {
  const palette = ["#1f2937", "#0f172a", "#1e293b", "#111827"];
  const background = palette[index % palette.length];
  const caption = `${prompt.slice(0, 42)}${prompt.length > 42 ? "…" : ""}`;
  const styleLine = style ? `${style}` : "Atlas Vision";
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="${background}" rx="32" />
    <text x="50%" y="45%" fill="#e5e7eb" font-size="24" font-family="Inter, sans-serif" text-anchor="middle">
      ${styleLine}
    </text>
    <text x="50%" y="60%" fill="#94a3b8" font-size="18" font-family="Inter, sans-serif" text-anchor="middle">
      ${caption.replace(/&/g, "&amp;")}
    </text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
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

    const { prompt, model, style, aspectRatio, variations } = parsed.data;
    const resolvedModel = getModelById(model);

    if (!resolvedModel || resolvedModel.category !== "image") {
      return NextResponse.json({ message: "Selected model is not enabled for imagery" }, { status: 400 });
    }

    const gatewayUrl = process.env.NEXT_PUBLIC_KONG_API_URL;
    const imageKey = process.env.KONG_IMAGE_KEY ?? process.env.KONG_PLAYGROUND_KEY;

    const images = Array.from({ length: variations }, (_, index) => createPlaceholderImage(prompt, style, index));

    if (!gatewayUrl || !imageKey) {
      return NextResponse.json({
        configured: false,
        message: "Image generation is not configured. Returning design placeholders.",
        images,
        aspectRatio,
      });
    }

    return NextResponse.json({
      configured: true,
      message: "Replace the placeholder implementation in app/api/playground/image with your production text-to-image call.",
      images,
      aspectRatio,
    });
  } catch (error) {
    console.error("Image playground request failed", error);
    return NextResponse.json({ message: "Unable to generate preview imagery" }, { status: 500 });
  }
}
