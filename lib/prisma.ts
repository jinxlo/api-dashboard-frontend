import { PrismaClient } from "@prisma/client";

const DATABASE_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "SUPABASE_PRISMA_URL",
  "SUPABASE_DB_URL",
] as const;

const DIRECT_DATABASE_ENV_KEYS = [
  "DIRECT_URL",
  "SUPABASE_DIRECT_URL",
  "POSTGRES_URL_NON_POOLING",
  "SUPABASE_DB_URL",
] as const;

const PLACEHOLDER_DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:5432/postgres";
const PLACEHOLDER_FLAG = "__ATLAS_DATABASE_PLACEHOLDER";

let resolvedFromEnvironment = false;

function resolveDatabaseUrl(): string {
  for (const key of DATABASE_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value) {
      if (
        key === "DATABASE_URL" &&
        process.env[PLACEHOLDER_FLAG] === "1" &&
        value === PLACEHOLDER_DATABASE_URL
      ) {
        continue;
      }
      if (key !== "DATABASE_URL") {
        process.env.DATABASE_URL = value;
      }
      delete process.env[PLACEHOLDER_FLAG];
      resolvedFromEnvironment = true;
      return value;
    }
  }

  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = PLACEHOLDER_DATABASE_URL;
    process.env[PLACEHOLDER_FLAG] = "1";
  }

  resolvedFromEnvironment = false;
  return process.env.DATABASE_URL;
}

function resolveDirectDatabaseUrl(fallback: string) {
  for (const key of DIRECT_DATABASE_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value) {
      if (key !== "DIRECT_URL") {
        process.env.DIRECT_URL = value;
      }
      return value;
    }
  }

  if (!process.env.DIRECT_URL) {
    process.env.DIRECT_URL = fallback;
  }

  return process.env.DIRECT_URL;
}

const databaseUrl = resolveDatabaseUrl();
resolveDirectDatabaseUrl(databaseUrl);

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

export const prismaReady = resolvedFromEnvironment
  ? prisma
      .$connect()
      .catch((error) => {
        console.error("Failed to establish Prisma connection", error);
        throw error;
      })
  : Promise.resolve();
export const isDatabaseConfigured = resolvedFromEnvironment;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
