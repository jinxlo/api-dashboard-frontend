import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

interface PersistedKeyRecord {
  id: string;
  key: string;
  userId: string;
  createdAt: string;
  label?: string;
  modelIds: string[];
}

const dataDirectory = path.join(process.cwd(), ".data");
const storeFile = path.join(dataDirectory, "demo-api-keys.json");

async function ensureStore() {
  try {
    await fs.mkdir(dataDirectory, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }

  try {
    await fs.access(storeFile);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(storeFile, JSON.stringify({ keys: [] }, null, 2), "utf8");
    } else {
      throw error;
    }
  }
}

async function readStore(): Promise<PersistedKeyRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(storeFile, "utf8");
  const parsed = JSON.parse(raw) as { keys?: PersistedKeyRecord[] };
  return Array.isArray(parsed.keys) ? parsed.keys : [];
}

async function writeStore(keys: PersistedKeyRecord[]) {
  await ensureStore();
  const payload = { keys };
  await fs.writeFile(storeFile, JSON.stringify(payload, null, 2), "utf8");
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
