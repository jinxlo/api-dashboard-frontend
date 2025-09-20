import { randomBytes } from "crypto";
import { promises as fs } from "fs";

import { ensureDemoDataFile } from "./demo-storage";

interface PersistedKeyRecord {
  id: string;
  key: string;
  userId: string;
  createdAt: string;
  label?: string;
  modelIds: string[];
}

const STORE_FILE_NAME = "demo-api-keys.json";
const INITIAL_PAYLOAD = JSON.stringify({ keys: [] as PersistedKeyRecord[] }, null, 2);

let storeFilePath: string | null = null;

async function ensureStore() {
  if (!storeFilePath) {
    storeFilePath = await ensureDemoDataFile(STORE_FILE_NAME, INITIAL_PAYLOAD);
  }

  return storeFilePath;
}

async function readStore(): Promise<PersistedKeyRecord[]> {
  const filePath = await ensureStore();
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as { keys?: PersistedKeyRecord[] };
  return Array.isArray(parsed.keys) ? parsed.keys : [];
}

async function writeStore(keys: PersistedKeyRecord[]) {
  const filePath = await ensureStore();
  const payload = { keys };
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

export async function listKeysForUser(userId: string) {
  const keys = await readStore();
  return keys.filter((key) => key.userId === userId);
}

export async function createKeyForUser(userId: string, modelIds: string[], label?: string) {
  const id = randomBytes(12).toString("hex");
  const key = `sk-${randomBytes(24).toString("base64url")}`;
  const createdAt = new Date().toISOString();
  const record: PersistedKeyRecord = {
    id,
    key,
    userId,
    createdAt,
    label: label?.trim() || undefined,
    modelIds: Array.from(new Set(modelIds)),
  };

  const keys = await readStore();
  keys.push(record);
  await writeStore(keys);

  return record;
}

export async function deleteKeyForUser(userId: string, keyId: string) {
  const keys = await readStore();
  const nextKeys = keys.filter((key) => !(key.userId === userId && key.id === keyId));
  await writeStore(nextKeys);
}
