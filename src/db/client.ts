import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

let dbSingleton: ReturnType<typeof drizzle> | undefined;

export function getDb() {
  if (dbSingleton) return dbSingleton;

  const filePath = process.env.SQLITE_DB_PATH ?? "./data.sqlite";

  // Creates DB file if it doesn't exist
  const sqlite = new Database(filePath);
  sqlite.pragma("journal_mode = WAL");

  dbSingleton = drizzle(sqlite, { schema });
  return dbSingleton;
}
