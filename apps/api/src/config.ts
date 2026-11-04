export interface ServerConfig {
  readonly host: string;
  readonly port: number;
  readonly prettyLogs: boolean;
  readonly databaseUrl: string;
}

const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_PORT = 3000;
const MAX_PORT = 65_535;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  return {
    host: env.HOST ?? DEFAULT_HOST,
    port: parsePort(env.PORT),
    prettyLogs: env.NODE_ENV !== 'production',
    databaseUrl: requireValue(env, 'DATABASE_URL'),
  };
}

function parsePort(value: string | undefined): number {
  if (value === undefined || value === '') {
    return DEFAULT_PORT;
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > MAX_PORT) {
    throw new Error(
      `PORT must be a whole number between 1 and ${String(MAX_PORT)}, got "${value}"`,
    );
  }

  return port;
}

function requireValue(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (value === undefined || value === '') {
    throw new Error(`${name} is missing. Copy apps/api/.env.example to apps/api/.env`);
  }

  return value;
}
