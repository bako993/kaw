import type { HealthResponse } from '@kaw/shared';
import { useEffect, useState } from 'react';

import { env } from '@/platform/config/env';

import { fetchHealth } from '../services/fetch-health';

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
