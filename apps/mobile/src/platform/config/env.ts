const ENV_NAME = 'EXPO_PUBLIC_API_URL';
// Expo copies EXPO_PUBLIC_ values into the app at build time, so the name is written out in full.
const rawApiUrl: unknown = process.env.EXPO_PUBLIC_API_URL;

if (typeof rawApiUrl !== 'string' || rawApiUrl === '') {
  throw new Error(`${ENV_NAME} is missing. Copy apps/mobile/.env.example to apps/mobile/.env`);
}

if (!/^https?:\/\//.test(rawApiUrl)) {
  throw new Error(`${ENV_NAME} must start with http:// or https://, got "${rawApiUrl}"`);
}

export const env = {
  apiUrl: rawApiUrl.replace(/\/+$/, ''),
} as const;
