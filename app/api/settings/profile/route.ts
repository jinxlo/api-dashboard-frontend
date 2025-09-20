import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
});

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = profileSchema.safeParse(json);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid payload";
      return NextResponse.json({ message }, { status: 400 });
    }

    const { name, email } = parsed.data;

    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingEmail) {
      return NextResponse.json({ message: "Email is already in use" }, { status: 409 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to update profile", error);
    return NextResponse.json({ message: "Unable to update profile" }, { status: 500 });
  }
}
