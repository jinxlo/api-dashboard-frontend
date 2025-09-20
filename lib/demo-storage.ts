import { promises as fs } from "fs";
import path from "path";

const FALLBACK_DIRECTORY_NAME = "atlas-demo-data";
const SKIPPABLE_ERROR_CODES = new Set(["EACCES", "EROFS", "EPERM", "ENOENT"]);

let resolvedDirectory: string | null = null;

async function resolveDemoDataDirectory(): Promise<string> {
  if (resolvedDirectory) {
    return resolvedDirectory;
  }

  const candidates = [
    process.env.DEMO_DATA_DIR?.trim(),
    path.join(process.cwd(), ".data"),
    process.env.TMPDIR ? path.join(process.env.TMPDIR, FALLBACK_DIRECTORY_NAME) : null,
    path.join("/tmp", FALLBACK_DIRECTORY_NAME),
  ].filter((candidate): candidate is string => Boolean(candidate && candidate.length > 0))
    .map((candidate) => path.resolve(candidate));

  let lastError: unknown;

  for (const candidate of candidates) {
    try {
      await fs.mkdir(candidate, { recursive: true });
      resolvedDirectory = candidate;
      return candidate;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;

      if (code === "EEXIST") {
        resolvedDirectory = candidate;
        return candidate;
      }

      if (code && SKIPPABLE_ERROR_CODES.has(code)) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error("Unable to resolve demo data directory");
}

export async function ensureDemoDataFile(fileName: string, initialContents: string) {
  const directory = await resolveDemoDataDirectory();
  const filePath = path.join(directory, fileName);

  try {
    await fs.access(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(filePath, initialContents, "utf8");
    } else {
      throw error;
    }
  }

  return filePath;
}
