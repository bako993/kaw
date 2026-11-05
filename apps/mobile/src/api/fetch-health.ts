import type { HealthResponse } from '@kaw/shared';

const TIMEOUT_MS = 5_000;

export async function fetchHealth(baseUrl: string): Promise<HealthResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/health`, { signal: controller.signal });
    return (await response.json()) as HealthResponse;
  } finally {
    clearTimeout(timer);
  }
}
