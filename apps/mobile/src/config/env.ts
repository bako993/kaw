const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (apiUrl === undefined || apiUrl === '') {
  throw new Error(
    'EXPO_PUBLIC_API_URL is missing. Copy apps/mobile/.env.example to apps/mobile/.env',
  );
}

export const env = { apiUrl } as const;
