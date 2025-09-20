import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { prisma, prismaReady, isDatabaseConfigured } from "@/lib/prisma";

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export async function PATCH(request: Request) {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json(
        { message: "Password updates are currently unavailable because the database connection is not configured." },
        { status: 503 },
      );
    }
    await prismaReady;
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = passwordSchema.safeParse(json);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid payload";
      return NextResponse.json({ message }, { status: 400 });
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (!user?.password) {
      return NextResponse.json({ message: "User account is not configured for password login" }, { status: 400 });
    }

    const isValid = await compare(currentPassword, user.password);

    if (!isValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated" });
  } catch (error) {
    console.error("Failed to update password", error);
    return NextResponse.json({ message: "Unable to update password" }, { status: 500 });
  }
}
