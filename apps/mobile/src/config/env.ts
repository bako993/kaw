const ENV_NAME = 'EXPO_PUBLIC_API_URL';
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL;

if (rawApiUrl === undefined || rawApiUrl === '') {
  throw new Error(`${ENV_NAME} is missing. Copy apps/mobile/.env.example to apps/mobile/.env`);
}

if (!/^https?:\/\//.test(rawApiUrl)) {
  throw new Error(`${ENV_NAME} must start with http:// or https://, got "${rawApiUrl}"`);
}

export const env = {
  apiUrl: rawApiUrl.replace(/\/+$/, ''),
} as const;
