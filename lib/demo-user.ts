const DEFAULT_EMAIL = "demo@atlas.ai";
const DEFAULT_PASSWORD = "AtlasDemo!2025";
const DEFAULT_NAME = "Atlas Demo";
const DEFAULT_ID = "demo-user";

export type DemoUserConfig = {
  id: string;
  email: string;
  name: string;
  password: string | null;
  passwordHash: string | null;
};

let memoizedConfig: DemoUserConfig | null = null;

export function getDemoUserConfig(): DemoUserConfig {
  if (memoizedConfig) {
    return memoizedConfig;
  }

  const passwordHash = process.env.DEMO_USER_PASSWORD_HASH?.trim() || null;
  const passwordFromEnv = process.env.DEMO_USER_PASSWORD?.trim();

  memoizedConfig = {
    id: process.env.DEMO_USER_ID?.trim() || DEFAULT_ID,
    email: process.env.DEMO_USER_EMAIL?.trim() || DEFAULT_EMAIL,
    name: process.env.DEMO_USER_NAME?.trim() || DEFAULT_NAME,
    password: passwordFromEnv ?? (passwordHash ? null : DEFAULT_PASSWORD),
    passwordHash,
  };

  return memoizedConfig;
}

export function getPublicDemoCredentialSummary() {
  const { email, password, passwordHash } = getDemoUserConfig();
  return {
    email,
    password: passwordHash ? null : password,
  };
}
