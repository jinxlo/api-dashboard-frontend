const SECRET_MIN_LENGTH = 32;
const DEFAULT_SECRET_SEED = "atlas-local-development-secret";

const directSecretEnvOrder = [
  "NEXTAUTH_SECRET",
  "AUTH_SECRET",
  "AUTHJS_SECRET",
  "NEXT_PUBLIC_NEXTAUTH_SECRET",
] as const;

const derivedSecretEnvOrder = [
  "VERCEL_DEPLOYMENT_ID",
  "VERCEL_URL",
  "NEXTAUTH_URL",
] as const;

function coalesceEnvValue(keys: readonly string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function deriveDeterministicSecret(seed: string) {
  if (!seed) {
    seed = DEFAULT_SECRET_SEED;
  }

  const hex = Array.from(seed, (char) =>
    char.charCodeAt(0).toString(16).padStart(2, "0"),
  ).join("");

  if (hex.length >= SECRET_MIN_LENGTH) {
    return hex;
  }

  const repeatCount = Math.ceil(SECRET_MIN_LENGTH / hex.length);
  return hex.repeat(repeatCount).slice(0, SECRET_MIN_LENGTH);
}

export function resolveNextAuthSecret() {
  const directSecret = coalesceEnvValue(directSecretEnvOrder);
  if (directSecret) {
    return directSecret;
  }

  const derivedSeed =
    coalesceEnvValue(derivedSecretEnvOrder) ?? DEFAULT_SECRET_SEED;

  return deriveDeterministicSecret(derivedSeed);
}
