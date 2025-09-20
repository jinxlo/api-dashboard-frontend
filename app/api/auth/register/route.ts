import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma, prismaReady, isDatabaseConfigured } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json(
        { message: "User registration is temporarily unavailable while the database connection is not configured." },
        { status: 503 },
      );
    }
    await prismaReady;
    const json = await request.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid payload";
      return NextResponse.json({ message }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Account created" });
  } catch (error) {
    console.error("Failed to register user", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
