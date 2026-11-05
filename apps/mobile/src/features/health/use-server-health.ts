import type { HealthResponse } from '@kaw/shared';
import { useEffect, useState } from 'react';

import { fetchHealth } from '@/api/fetch-health';
import { env } from '@/config/env';

export type ServerHealth =
  | { readonly state: 'checking' }
  | { readonly state: 'reachable'; readonly health: HealthResponse }
  | { readonly state: 'unreachable' };

export function useServerHealth(): ServerHealth {
  const [serverHealth, setServerHealth] = useState<ServerHealth>({ state: 'checking' });

  useEffect(() => {
    let active = true;

    fetchHealth(env.apiUrl)
      .then((health) => {
        if (active) setServerHealth({ state: 'reachable', health });
      })
      .catch(() => {
        if (active) setServerHealth({ state: 'unreachable' });
      });

    return () => {
      active = false;
    };
  }, []);

  return serverHealth;
}
