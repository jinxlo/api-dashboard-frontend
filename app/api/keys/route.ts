import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";

const adminApiUrl = process.env.KONG_ADMIN_API_URL;

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
      return NextResponse.json({ message: "Kong Admin API is not configured" }, { status: 500 });
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
      data?: { id: string; key: string; created_at?: number }[];
    };
    const keys = (payload.data ?? []).map((item) => ({
      id: item.id,
      key: item.key,
      createdAt: item.created_at ? new Date(item.created_at * 1000).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ keys });
  } catch (error) {
    console.error("Failed to list API keys", error);
    return NextResponse.json({ message: "Unable to load API keys" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!adminApiUrl) {
      return NextResponse.json({ message: "Kong Admin API is not configured" }, { status: 500 });
    }

    await ensureConsumer(session.user.id);

    const response = await fetch(`${adminApiUrl}/consumers/${session.user.id}/key-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to create key: ${body}`);
    }

    const payload = await response.json();

    return NextResponse.json({
      key: payload.key as string,
      id: payload.id as string,
      createdAt: payload.created_at ? new Date(payload.created_at * 1000).toISOString() : new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to create API key", error);
    return NextResponse.json({ message: "Unable to create API key" }, { status: 500 });
  }
}
