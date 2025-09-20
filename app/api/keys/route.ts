import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { createKeyForUser, listKeysForUser } from "@/lib/key-store";
import { getModelById } from "@/lib/models";

const adminApiUrl = process.env.KONG_ADMIN_API_URL;

const createKeySchema = z.object({
  label: z
    .string()
    .trim()
    .max(80, { message: "Label must be 80 characters or fewer" })
    .optional(),
  modelIds: z
    .array(z.string())
    .nonempty({ message: "Select at least one model" })
    .refine((ids) => ids.every((id) => getModelById(id)), {
      message: "One or more models are not available",
    }),
});

function encodeLabelTag(label: string) {
  return `label:${Buffer.from(label).toString("base64url")}`;
}

function decodeLabelTag(tag: unknown) {
  if (typeof tag !== "string" || !tag.startsWith("label:")) {
    return undefined;
  }
  try {
    return Buffer.from(tag.slice(6), "base64url").toString("utf8");
  } catch {
    return undefined;
  }
}

function extractModelIdsFromTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .filter((tag): tag is string => typeof tag === "string" && tag.startsWith("model:"))
    .map((tag) => tag.slice(6))
    .filter((id) => Boolean(getModelById(id)));
}

function presentKey(record: {
  id: string;
  key: string;
  createdAt: string;
  label?: string;
  modelIds: string[];
}) {
  const models = record.modelIds
    .map((id) => getModelById(id))
    .filter((model): model is NonNullable<typeof model> => Boolean(model));

  return {
    id: record.id,
    key: record.key,
    createdAt: record.createdAt,
    label: record.label ?? null,
    models: models.map((model) => ({
      id: model.id,
      name: model.name,
      category: model.category,
    })),
  };
}

async function ensureConsumer(userId: string) {
  if (!adminApiUrl) {
    throw new Error("KONG_ADMIN_API_URL is not configured");
  }

  const consumerUrl = `${adminApiUrl}/consumers/${userId}`;
  const response = await fetch(consumerUrl, { cache: "no-store" });

  if (response.status === 404) {
    const createResponse = await fetch(`${adminApiUrl}/consumers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ custom_id: userId, username: userId }),
    });

    if (!createResponse.ok) {
      const body = await createResponse.text();
      throw new Error(`Failed to create consumer: ${body}`);
    }
  } else if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to load consumer: ${body}`);
  }
}

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!adminApiUrl) {
      const keys = await listKeysForUser(session.user.id);
      return NextResponse.json({ keys: keys.map((key) => presentKey(key)) });
    }

    const response = await fetch(`${adminApiUrl}/consumers/${session.user.id}/key-auth`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      return NextResponse.json({ keys: [] });
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to fetch keys: ${body}`);
    }

    const payload = (await response.json()) as {
      data?: { id: string; key: string; created_at?: number; tags?: string[] }[];
    };
    const keys = (payload.data ?? []).map((item) => {
      const modelIds = extractModelIdsFromTags(item.tags ?? []);
      const label = (item.tags ?? []).map((tag) => decodeLabelTag(tag)).find(Boolean);
      return presentKey({
        id: item.id,
        key: item.key,
        createdAt: item.created_at ? new Date(item.created_at * 1000).toISOString() : new Date().toISOString(),
        modelIds,
        label,
      });
    });

    return NextResponse.json({ keys });
  } catch (error) {
    console.error("Failed to list API keys", error);
    return NextResponse.json({ message: "Unable to load API keys" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json().catch(() => null);
    const parsed = createKeySchema.safeParse(json);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid payload";
      return NextResponse.json({ message }, { status: 400 });
    }

    const { label, modelIds } = parsed.data;
    const normalizedLabel = label?.trim() ? label.trim() : undefined;

    if (!adminApiUrl) {
      const created = await createKeyForUser(session.user.id, modelIds, normalizedLabel);
      return NextResponse.json(presentKey(created));
    }

    await ensureConsumer(session.user.id);

    const tags = modelIds.map((id) => `model:${id}`);
    if (normalizedLabel) {
      tags.push(encodeLabelTag(normalizedLabel));
    }

    const response = await fetch(`${adminApiUrl}/consumers/${session.user.id}/key-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to create key: ${body}`);
    }

    const payload = await response.json();
    const createdAt = payload.created_at
      ? new Date(Number(payload.created_at) * 1000).toISOString()
      : new Date().toISOString();

    return NextResponse.json(
      presentKey({
        id: payload.id as string,
        key: payload.key as string,
        createdAt,
        label: normalizedLabel,
        modelIds,
      }),
    );
  } catch (error) {
    console.error("Failed to create API key", error);
    return NextResponse.json({ message: "Unable to create API key" }, { status: 500 });
  }
}
