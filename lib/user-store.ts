import { randomUUID } from "crypto";
import { promises as fs } from "fs";

import { ensureDemoDataFile } from "./demo-storage";

export interface PersistedUserRecord {
  id: string;
  email: string;
  normalizedEmail: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

const STORE_FILE_NAME = "demo-users.json";
const INITIAL_PAYLOAD = JSON.stringify({ users: [] as PersistedUserRecord[] }, null, 2);

let storeFilePath: string | null = null;

async function ensureStore() {
  if (!storeFilePath) {
    storeFilePath = await ensureDemoDataFile(STORE_FILE_NAME, INITIAL_PAYLOAD);
  }

  return storeFilePath;
}

async function readUsers(): Promise<PersistedUserRecord[]> {
  const filePath = await ensureStore();
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as { users?: PersistedUserRecord[] };
  return Array.isArray(parsed.users) ? parsed.users : [];
}

async function writeUsers(users: PersistedUserRecord[]) {
  const filePath = await ensureStore();
  const payload = { users };
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

export async function findPersistedUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await readUsers();
  return users.find((user) => user.normalizedEmail === normalizedEmail) ?? null;
}

export interface CreatePersistedUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

export async function createPersistedUser(input: CreatePersistedUserInput) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const users = await readUsers();

  const existing = users.find((user) => user.normalizedEmail === normalizedEmail);

  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const now = new Date().toISOString();
  const record: PersistedUserRecord = {
    id: randomUUID(),
    email: input.email.trim(),
    normalizedEmail,
    name: input.name.trim(),
    passwordHash: input.passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  users.push(record);
  await writeUsers(users);

  return record;
}
