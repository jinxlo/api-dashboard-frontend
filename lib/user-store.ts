import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export interface PersistedUserRecord {
  id: string;
  email: string;
  normalizedEmail: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

const dataDirectory = path.join(process.cwd(), ".data");
const storeFile = path.join(dataDirectory, "demo-users.json");

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
      const initialPayload = { users: [] as PersistedUserRecord[] };
      await fs.writeFile(storeFile, JSON.stringify(initialPayload, null, 2), "utf8");
    } else {
      throw error;
    }
  }
}

async function readUsers(): Promise<PersistedUserRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(storeFile, "utf8");
  const parsed = JSON.parse(raw) as { users?: PersistedUserRecord[] };
  return Array.isArray(parsed.users) ? parsed.users : [];
}

async function writeUsers(users: PersistedUserRecord[]) {
  await ensureStore();
  const payload = { users };
  await fs.writeFile(storeFile, JSON.stringify(payload, null, 2), "utf8");
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
