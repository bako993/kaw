import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export interface Database {
  readonly db: PostgresJsDatabase;
  close(): Promise<void>;
}

const MAX_CONNECTIONS = 10;

export function createDatabase(url: string): Database {
  const client = postgres(url, { max: MAX_CONNECTIONS });

  return {
    db: drizzle(client),
    close: () => client.end(),
  };
}
