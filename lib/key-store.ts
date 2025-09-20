import { randomBytes } from "crypto";

import { prisma, prismaReady, isDatabaseConfigured } from "./prisma";

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("Database connection is not configured");
    this.name = "DatabaseNotConfiguredError";
  }
}

export interface PersistedKeyRecord {
  id: string;
  key: string;
  userId: string;
  createdAt: string;
  label?: string;
  modelIds: string[];
}

function generateSecretKey() {
  return `sk-${randomBytes(24).toString("base64url")}`;
}

async function ensureDatabaseConnection() {
  if (!isDatabaseConfigured) {
    throw new DatabaseNotConfiguredError();
  }
  await prismaReady;
}

export async function listKeysForUser(userId: string): Promise<PersistedKeyRecord[]> {
  await ensureDatabaseConnection();

  const keys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return keys.map((key) => ({
    id: key.id,
    key: key.key,
    userId: key.userId,
    createdAt: key.createdAt.toISOString(),
    label: key.label ?? undefined,
    modelIds: key.modelIds,
  }));
}

export async function createKeyForUser(
  userId: string,
  modelIds: string[],
  label?: string,
): Promise<PersistedKeyRecord> {
  await ensureDatabaseConnection();

  const created = await prisma.apiKey.create({
    data: {
      userId,
      key: generateSecretKey(),
      label: label?.trim() || null,
      modelIds: Array.from(new Set(modelIds)),
    },
  });

  return {
    id: created.id,
    key: created.key,
    userId: created.userId,
    createdAt: created.createdAt.toISOString(),
    label: created.label ?? undefined,
    modelIds: created.modelIds,
  };
}

export async function deleteKeyForUser(userId: string, keyId: string) {
  await ensureDatabaseConnection();

  await prisma.apiKey.deleteMany({
    where: { id: keyId, userId },
  });
}
