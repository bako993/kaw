import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ENV_FILE = fileURLToPath(new URL('../../../.env', import.meta.url));

if (existsSync(ENV_FILE)) {
  process.loadEnvFile(ENV_FILE);
}
