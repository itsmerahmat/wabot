import dotenv from "dotenv";

// Load variables from .env into process.env (no-op if .env doesn't exist)
dotenv.config();

function getEnv(key: string): string | undefined {
  const value = process.env[key];
  if (typeof value === "string" && value.trim().length > 0) return value;
  return undefined;
}

export function requireEnv(key: string): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(
      `Missing required environment variable ${key}. ` +
        `Set it before running (e.g. ${key}=... or via .env).`
    );
  }
  return value;
}
