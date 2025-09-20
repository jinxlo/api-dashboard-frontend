import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";

const bodySchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required" }),
  model: z.string().default("atlas-large"),
  temperature: z.coerce.number().min(0).max(1).default(0.7),
});

const gatewayUrl = process.env.NEXT_PUBLIC_KONG_API_URL;
const playgroundKey = process.env.KONG_PLAYGROUND_KEY;

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid payload";
      return NextResponse.json({ message }, { status: 400 });
    }

    const { prompt, model, temperature } = parsed.data;

    if (!gatewayUrl || !playgroundKey) {
      return NextResponse.json(
        {
          message: "Playground is not configured",
          response:
            "The platform administrator must configure the Kong gateway credentials before the playground can be used.",
        },
        { status: 200 },
      );
    }

    const response = await fetch(`${gatewayUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${playgroundKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Playground request failed: ${body}`);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "The model did not return any content.";

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("Playground request failed", error);
    return NextResponse.json(
      {
        message: "Playground request failed",
        response: "We were unable to reach the language model. Please try again or verify your configuration.",
      },
      { status: 500 },
    );
  }
}
