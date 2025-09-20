import { NextRequest, NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";

const adminApiUrl = process.env.KONG_ADMIN_API_URL;

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> },
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!adminApiUrl) {
      return NextResponse.json({ message: "Kong Admin API is not configured" }, { status: 500 });
    }

    const { keyId } = await params;

    const response = await fetch(`${adminApiUrl}/consumers/${session.user.id}/key-auth/${keyId}`, {
      method: "DELETE",
    });

    if (response.status === 404) {
      return NextResponse.json({ message: "Key not found" }, { status: 404 });
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to revoke key: ${body}`);
    }

    return NextResponse.json({ message: "Key revoked" });
  } catch (error) {
    console.error("Failed to delete API key", error);
    return NextResponse.json({ message: "Unable to revoke API key" }, { status: 500 });
  }
}
