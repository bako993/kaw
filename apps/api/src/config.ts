export interface ServerConfig {
  readonly host: string;
  readonly port: number;
  readonly prettyLogs: boolean;
}

const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_PORT = 3000;
const MAX_PORT = 65_535;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  return {
    host: env.HOST ?? DEFAULT_HOST,
    port: parsePort(env.PORT),
    prettyLogs: env.NODE_ENV !== 'production',
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
