import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { prisma, prismaReady, isDatabaseConfigured } from "./prisma";
import { resolveNextAuthSecret } from "./auth-secret";
import { getDemoUserConfig } from "./demo-user";

const credentialsSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(6, { message: "Password is required" }),
});

const demoUserConfig = getDemoUserConfig();

const resolvedAuthSecret = resolveNextAuthSecret();

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = resolvedAuthSecret;
}

await prismaReady;

export const authOptions: NextAuthOptions = {
  secret: resolvedAuthSecret,
  adapter: isDatabaseConfigured ? PrismaAdapter(prisma) : undefined,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          throw new Error(parsed.error.issues[0]?.message ?? "Invalid credentials");
        }

        const { email, password } = parsed.data;

        if (!isDatabaseConfigured) {
          const normalizedEmail = email.trim().toLowerCase();
          const normalizedDemoEmail = demoUserConfig.email.trim().toLowerCase();

          if (normalizedEmail !== normalizedDemoEmail) {
            throw new Error("No user found with that email");
          }

          const passwordMatches = demoUserConfig.passwordHash
            ? await compare(password, demoUserConfig.passwordHash)
            : demoUserConfig.password !== null && password === demoUserConfig.password;

          if (!passwordMatches) {
            throw new Error("Invalid email or password");
          }

          return {
            id: demoUserConfig.id,
            email: demoUserConfig.email,
            name: demoUserConfig.name,
          };
        }

        await prismaReady;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("No user found with that email");
        }

        const isValid = await compare(password, user.password);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      } else if (isDatabaseConfigured && token.sub && (!token.name || !token.email)) {
        await prismaReady;
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { name: true, email: true },
        });
        if (dbUser) {
          token.name = dbUser.name ?? undefined;
          token.email = dbUser.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
      }
      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
