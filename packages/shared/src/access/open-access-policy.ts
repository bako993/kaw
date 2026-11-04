import type { AccessPolicy } from './access-policy.ts';

export const openAccessPolicy: AccessPolicy = {
  canOpen: () => true,
};
