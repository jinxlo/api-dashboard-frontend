import { PrismaClient } from "@prisma/client";

const DATABASE_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_URL",
  "SUPABASE_DB_URL",
] as const;

const PLACEHOLDER_DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

type ResolvedDatabaseUrl = {
  url: string;
  fromEnvironment: boolean;
};

function resolveDatabaseUrl(): ResolvedDatabaseUrl {
  for (const key of DATABASE_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value) {
      if (key !== "DATABASE_URL") {
        process.env.DATABASE_URL = value;
      }
      return { url: value, fromEnvironment: true };
    }
  }

  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = PLACEHOLDER_DATABASE_URL;
  }

  return { url: process.env.DATABASE_URL, fromEnvironment: process.env.DATABASE_URL !== PLACEHOLDER_DATABASE_URL };
}

const { url: databaseUrl, fromEnvironment } = resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export const prismaReady = Promise.resolve();
export const isDatabaseConfigured = fromEnvironment;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
